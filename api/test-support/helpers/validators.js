const _ = require('lodash')
const apiRequestValidator = require('api-request-validator')

const mockValidator = (options = {}) => {
  let validations = options.validations || {}
  if (options.fakeValidaton) {
    validations = {
      fake: {
        required: {
          error: { error: 'fake_validator_error', code: 400 }
        }
      }
    }
  }
  if (options.fakeWarning) {
    validations = {
      fake: {
        required: {
          warning: {
            warning: 'fake_validator_warning',
            info: 'Fake warning'
          }
        }
      }
    }
  }

  class MockValidator extends apiRequestValidator {
    constructor(req) {
      super(validations, req.body, {
        mainError: !options.fakeWarning ? { error: 'main_error' } : undefined,
        filter: options.filter
      })
    }
  }

  return MockValidator
}

const expectFakeErrors = (validator) =>
  expectIsNotValidAndErrors(validator, {
    mainError: 'main_error',
    errors: {
      field: ['fake_validator_error']
    }
  })

const expectMainError = (validator, error) =>
  expect(validator.error.error).toBe(error)

const expectError = (validator, path, error) =>
  expect(_.get(validator.errors, path).find(validatorError =>
    validatorError.error === error)
  ).toBeDefined()

const expectErrors = (validator, errors) => {
  for (const field in errors) {
    expect(validator.errors).toHaveProperty(field)
    errors[field].forEach(error => {
      expect(validator.errors[field]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            error: error
          })
        ])
      )
    })
  }
  for (const field in validator.errors) {
    expect(errors).toHaveProperty(field)
    validator.errors[field].forEach(error => {
      expect(errors[field]).toEqual(
        expect.arrayContaining([error.error])
      )
    })
  }
}

const expectIsValid = (validator) => {
  expect(validator.warnings[0]).toBeUndefined()
  expect(validator.isValid).toBeTruthy()
}

const expectIsNotValid = (validator, expectWarnings) => {
  if (expectWarnings)
    expect(validator.warnings[0]).toBeDefined()
  else
    expect(validator.warnings[0]).toBeUndefined()
  expect(validator.isValid).toBeFalsy()
}

const expectIsNotValidAndErrors = (validator, options = {}) => {
  expectIsNotValid(validator)
  if (options.mainError)
    expectMainError(validator, options.mainError)
  if (options.errors)
    expectErrors(validator, options.errors)
}

module.exports = {
  expectError,
  expectErrors,
  expectIsNotValid,
  expectIsNotValidAndErrors,
  expectIsValid,
  expectMainError,
  mockValidator,
  expectFakeErrors
}