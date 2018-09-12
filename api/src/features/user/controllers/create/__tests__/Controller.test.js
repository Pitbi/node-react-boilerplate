const {
  constructorAttributes,
  responseIsOk
} = require('@test-support/helpers/controllers')

const Controller = require('../Controller')

require('@test-support/jest-hooks')

describe('Create user controller', () => {
  it('Success', async () => {
    const controller = new Controller(...constructorAttributes({
      body: {
        firstName: 'Toz',
        lastName: 'Moz',
        email: 'email@mail.com',
        password: '123456'
      }
    }))
    await controller.work()
    responseIsOk(controller)
    expect(controller.response.user).toBeDefined()
    expect(controller.response.user.firstName).toBe('Toz')
    expect(controller.response.user.lastName).toBe('Moz')
    expect(controller.response.user.email).toBe('email@mail.com')
    expect(controller.response.user.password).toBeUndefined()
  })
})