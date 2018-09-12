const mockRequest = require('sinon-express-mock').mockReq
const mockResponse = require('sinon-express-mock').mockRes

const mockReq = (request = {}) => {
  const headers = request.headers || { lang: 'fr' }
  return mockRequest({
    ...request,
    headers
  })
}

const mockRes = (response = {}) => mockResponse({
  ...response,
  __: (string = '') => `i18n_test_${string}`
})

const mockCallback = (callback) => callback ? callback() : () => null

const constructorAttributes = (request, response, callback) =>
  [mockReq(request), mockRes(response), mockCallback(callback)]

const responseIsOk = (controller) =>
  expect(controller.response.ok).toBe(1)

module.exports = {
  constructorAttributes,
  mockCallback,
  mockReq,
  mockRes,
  responseIsOk
}