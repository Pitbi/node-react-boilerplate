const { expect } = require('chai')

class ApiFeature {
  constructor(world) {
    this.world = world
    this.APIOptions = {
      headers: {}
    }
    this.expectedData = {}
    this.tmp = {}
    this.i18n = world.i18n
  }

  async wait(delay = 1000) {
    return new Promise((resolve) => 
      setTimeout(() => resolve(), delay)
    )
  }

  responseIsOK() {
    expect(this.apiResponse.ok || this.apiResponse.result).to.equal(1, 'API call failure: success expected')
  }

  responseIsNotOK() {
    expect(this.apiResponse.ok).to.equal(0, 'API call success: failure expected')
  }

  checkResponseValidationError(error, field) {
    expect(this.apiResponse.errors[field]).to.be.equal(error)
  }

  checkResponseMessage() {
    expect(this.apiResponse.message).to.exist
  }
}

module.exports = ApiFeature