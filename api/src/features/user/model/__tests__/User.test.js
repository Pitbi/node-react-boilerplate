const User = require('../User')

const {
  validate
} = require('@test-support/helpers/models')

describe('User model', () => {
  it('Virtuals', async () => {
    const user = new User({
      firstName: 'pit',
      lastName: 'bi'
    })
    expect(user.fullName).toBe('pit bi')
    expect(user.label).toBe('pit bi')
    expect(user.shortFullName).toBe('P. bi')
    expect(user.initials).toBe('PB')
  })
  it('Schema validation: trim & lowercase', async () => {
    const user = new User({
      email: 'Email@Email.com   ',
      firstName: 'Jon   ',
      lastName: '   Doe  ',
      password: '123456'
    })
    expect(user.email).toBe('email@email.com')
    expect(user.firstName).toBe('Jon')
    expect(user.lastName).toBe('Doe')
  })
  it('Schema validations: required fields', async () => {
    const user = new User({})
    const error = await validate(user)
    expect(error.errors).toBeDefined()
    expect(error.errors.firstName.message).toBe('user_validation_firstName_required')
    expect(error.errors.lastName.message).toBe('user_validation_lastName_required')
    expect(error.errors.email.message).toBe('user_validation_email_required')
    expect(error.errors.password.message).toBe('user_validation_password_required')
  })
  it('Schema validations: invalid data', async () => {
    const user = new User({
      email: 'wrong',
      firstName: 'A',
      lastName: 'B',
      password: '123'
    })
    const error = await validate(user)
    expect(error.errors).toBeDefined()
    expect(error.errors.firstName.message).toBe('user_validation_firstName_invalid')
    expect(error.errors.lastName.message).toBe('user_validation_lastName_invalid')
    expect(error.errors.email.message).toBe('user_validation_email_invalid')
    expect(error.errors.password.message).toBe('user_validation_password_invalid')
  })
})
