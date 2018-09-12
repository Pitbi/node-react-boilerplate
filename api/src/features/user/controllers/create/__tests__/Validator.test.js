const User = require('../../../model')

const {
  expectIsNotValidAndErrors,
  expectMainError,
  expectIsValid
} = require('@test-support/helpers/validators')

const Validator = require('../Validator')

const mainError = 'error_user_creation_payload_validation'

require('@test-support/jest-hooks')

describe('Auth validator', () => {
  it('Valid', async () => {
    const validator = new Validator({
      body: {
        firstName: 'xxx',
        lastName: 'yxx',
        email: 'existing@mail.com',
        password: 'azqscqs'
      }
    })
    await validator.run()
    expectIsValid(validator)
  })
  it('Not valid: empty payload', async () => {
    const validator = new Validator({
      body: {}
    })
    await validator.run()
    expectIsNotValidAndErrors(validator, {
      mainError,
      errors: {
        firstName: ['error_user_creation_first_name_missing'],
        lastName: ['error_user_creation_last_name_missing'],
        email: ['error_user_creation_email_missing'],
        password: ['error_user_creation_password_missing']
      }
    })
  })
  it('Not valid: invalid attribtues values', async () => {
    const validator = new Validator({
      body: {
        firstName: 'x',
        lastName: 'y',
        email: 'wrong',
        password: 'az'
      }
    })
    await validator.run()
    expectIsNotValidAndErrors(validator, {
      mainError,
      errors: {
        firstName: ['error_user_creation_first_name_invalid'],
        lastName: ['error_user_creation_last_name_invalid'],
        email: ['error_user_creation_email_invalid'],
        password: ['error_user_creation_password_invalid']
      }
    })
  })
  it('Not valid: email already used', async () => {
    await User.create({
      firstName: 'xxx',
      lastName: 'yxx',
      email: 'existing@mail.com',
      password: 'azqscqs',
      active: true,
      validated: true
    })
    const validator = new Validator({
      body: {
        firstName: 'xxx',
        lastName: 'yxx',
        email: 'existing@mail.com',
        password: 'azqscqs'
      }
    })
    await validator.run()
    expectMainError(validator, 'error_user_creation_email_already_used')
  })
})
