const request = require('superagent')
const { expect } = require('chai')

const CONFIG = require('../../config')

class API {
  constructor(options = {}) {
    this.options = options
    this.host = CONFIG.apiHost
    this.headers = {
      'Content-Type': 'application/json',
      lang: CONFIG.lang,
      device: 'cucumber',
      version: 'test',
      mobile: 'true' /*Todo: remove this hack*/
    }
    if (options.headers)
      this.headers = { ...this.headers, ...options.headers }
    if (options.bsAuthToken)
      this.headers.bsAuthToken = options.bsAuthToken
  }

  async call(options = this.options) {
    if (!options)
      throw 'API - missing options'
    try {
      /*Headers*/
      const headers = {
        'Content-Type': 'application/json',
        lang: CONFIG.lang,
        device: 'cucumber',
        version: 'test',
        mobile: 'true' /*Todo: remove this hack*/
      }
      if (!headers.bsAuthToken && API.bsAuthToken)
        headers.bsAuthToken = API.bsAuthToken
      /*Call api*/
      const response = await request
        [options.method](`${this.host}${options.endpoint}`)
        .send(options.payload)
        .set(headers)

      this.response = response.body

      if (this.options.failureExpected)
        this.responseIsNotOK()
      else
        this.responseIsOK()
            
      return this.response
    } catch (err) {
      if (err.status >= 500)
        throw 'Internal Server Error'
                
      if (err.response && err.response.body) {
        this.response = err.response.body
        return this.response
      }

      throw `API Error - ${err}`
    }
  }

  responseIsOK() {
    expect(this.response.ok).to.equal(1)
  }

  responseIsNotOK() {
    expect(this.response.ok).to.equal(0)
  }
}

module.exports = API