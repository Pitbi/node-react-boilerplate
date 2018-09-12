const User = require('@features/user/model')

const {
  constructorAttributes,
  responseIsOk
} = require('@test-support/helpers/controllers')

const Controller = require('../Controller')

require('@test-support/jest-hooks')

describe('Auth controller', () => {
  it('Login success', async () => {
    await User.create({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@mail.com',
      password: '123456',
      active: true,
      validated: true
    })
    const controller = new Controller(...constructorAttributes({
      body: {
        email: 'email@mail.com',
        password: '123456'
      }
    }))
    await controller.work()
    responseIsOk(controller)
    expect(controller.response.user.email).toBe('email@mail.com')
    expect(controller.response.user.authToken).toBeDefined()
    expect(controller.response.user.password).toBeUndefined()
  })
  it('Login failure: unknown email', async () => {
    await User.create({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@mail.com',
      password: '123456',
      active: false,
      validated: true
    })
    const controller = new Controller(...constructorAttributes({
      body: {
        email: 'emailunknown@mail.com',
        password: '123456'
      }
    }))
    await controller.work()
    expect(controller.response.ok).toBe(0)
    expect(controller.response.user).toBeUndefined()
    expect(controller.response.error).toBe('error_session_auth_email_unknown')
  })
  it('Login failure: user not validated', async () => {
    await User.create({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@mail.com',
      password: '123456',
      active: true,
      validated: false
    })
    const controller = new Controller(...constructorAttributes({
      body: {
        email: 'email@mail.com',
        password: '123456'
      }
    }))
    await controller.work()
    expect(controller.response.ok).toBe(0)
    expect(controller.response.user).toBeUndefined()
    expect(controller.response.error).toBe('error_session_auth_user_not_validated')
  })
  it('Login failure: wrong password', async () => {
    await User.create({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@mail.com',
      password: '123456',
      active: true,
      validated: true
    })
    const controller = new Controller(...constructorAttributes({
      body: {
        email: 'email@mail.com',
        password: '123456sdvsdv'
      }
    }))
    await controller.work()
    expect(controller.response.ok).toBe(0)
    expect(controller.response.user).toBeUndefined()
    expect(controller.response.error).toBe('error_session_auth_password_wrong')
  })
  it('Login failure: user not active', async () => {
    await User.create({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@mail.com',
      password: '123456',
      active: false,
      validated: true
    })
    const controller = new Controller(...constructorAttributes({
      body: {
        email: 'email@mail.com',
        password: '123456'
      }
    }))
    await controller.work()
    expect(controller.response.ok).toBe(0)
    expect(controller.response.user).toBeUndefined()
    expect(controller.response.error).toBe('error_session_auth_email_unknown')
  })
})