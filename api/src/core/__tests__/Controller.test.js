const sinon = require('sinon')

const {
  constructorAttributes,
  responseIsOk
} = require('@test-support/helpers/controllers')
const {
  mockValidator
} = require('@test-support/helpers/validators')

const Controller = require('../Controller')

describe('Core Controller', () => {
  test('worker methods order', async () => {
    const controller = new Controller(...constructorAttributes())
    controller.Validator = mockValidator()
    const preWorkSpy = sinon.spy(controller, 'preWork')
    const workSpy = sinon.spy(controller, 'work')
    const ensureLoginSpy = sinon.spy(controller, 'ensureLogin')
    const validatePayloadSpy = sinon.spy(controller, 'validatePayload')
    const preValidateSpy = sinon.spy(controller, 'preValidate')
    await controller.run()
    sinon.assert.callOrder(preWorkSpy, ensureLoginSpy, validatePayloadSpy, preValidateSpy, workSpy)
    expect(workSpy.callCount).toBe(1)
  })
  test('validator error', async () => {
    const controller = new Controller(...constructorAttributes())
    controller.Validator = mockValidator({ fakeValidaton: true })
    await controller.run()
    expect(controller.response.ok).toBe(0)
    expect(controller.response.error).toBe('main_error')
    expect(controller.response.errors).toHaveProperty('fake')
    expect(controller.response.errors.fake[0].error).toEqual('fake_validator_error')
    expect(controller.response.message).toBe('i18n_test_main_error')
  })
  test('validator warning', async () => {
    const controller = new Controller(...constructorAttributes())
    controller.Validator = mockValidator({ fakeWarning: true })
    await controller.run()
    controller.respond()
    responseIsOk(controller)
    expect(controller.response.APIWarnings[0].warning).toEqual('fake_validator_warning')
    expect(controller.response.APIWarnings[0].info).toEqual('Fake warning')
  })
  test('login', async () => {
    const controller = new Controller(...constructorAttributes())
    await controller.logIn({ firstName: 'Pierre' })
    expect(controller.user.firstName).toBe('Pierre')
    expect(controller.req.user.firstName).toBe('Pierre')
  })
  test('respond', async () => {
    const controller = new Controller(...constructorAttributes())
    controller.responseCode = 201
    controller.respond()
    responseIsOk(controller)
    expect(controller.response.code).toBe(201)
  })
  test('throw error: whitout code', async () => {
    const controller = new Controller(...constructorAttributes())
    controller.throwError({})
    expect(controller.response.ok).toBe(0)
    expect(controller.response.code).toBe(500)
  })
  test('throw error: string error', async () => {
    const controller = new Controller(...constructorAttributes())
    controller.throwError('string')
    expect(controller.response.ok).toBe(0)
    expect(controller.response.code).toBe(500)
  })
})
