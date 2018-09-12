const {
  expectIsNotValidAndErrors,
  expectIsValid
} = require('../../../../../../test-support/helpers/validators')

const Validator = require('../Validator')

const email = 'email@mail.com'
const password = '123456'
const mainError = 'error_session_auth_payload_validation'

describe('Auth validator', () => {
  it('Valid payload', async () => {
    const validator = new Validator({
      body: {
        email,
        password
      }
    })
    await validator.run()
    expectIsValid(validator)
  })
  it('Not valid: missing email', async () => {
    const validator = new Validator({
      body: {
        password
      }
    })
    await validator.run()
    expectIsNotValidAndErrors(validator, {
      mainError,
      errors: {
        email: ['error_session_auth_email_missing']
      }
    })
  })
  it('Not valid: missing password', async () => {
    const validator = new Validator({
      body: {
        email
      }
    })
    await validator.run()
    expectIsNotValidAndErrors(validator, {
      mainError,
      errors: {
        password: ['error_session_auth_password_missing']
      }
    })
  })
  it('Not valid: invalid email', async () => {
    const validator = new Validator({
      body: {
        email: 'wrong',
        password
      }
    })
    await validator.run()
    expectIsNotValidAndErrors(validator, {
      mainError,
      errors: {
        email: ['error_session_auth_email_invalid']
      }
    })
  })
  it('Not valid: invalid email & password type', async () => {
    const validator = new Validator({
      body: {
        email: 123,
        password: 123
      }
    })
    await validator.run()
    expectIsNotValidAndErrors(validator, {
      mainError,
      errors: {
        email: ['error_session_auth_email_invalid', 'type_error_session_auth_email'],
        password: ['error_session_auth_password_invalid', 'type_error_session_auth_password']
      }
    })
  })
})
