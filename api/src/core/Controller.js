const _ = require('lodash')
const APP = require('@common/constants/APP')
const jwt = require('jsonwebtoken')
const SESSION_ERRORS = {} || require('../features/session/ERRORS')

class Controller {
  constructor(req, res, next, options = {}) {
    if (!req || !res || !next)
      throw 'Controller.constructor error: missing attribute(s)'
    /*Express req, res & callback*/
    this.req = req
    this.res = res
    this.expressCallback = next
    /*HTTP attributes*/
    this.protocol = req.protocol
    this.host = req.get('host')
    this.url = req.originalUrl
    this.fullUrl = `${this.protocol}://${this.host}${this.url}`
    this.method = req.method

    /*Options*/
    this.__ = res.__
    this.lang = req.headers.lang || APP.i18n.default

    /*Initilize attributes*/
    this.options = options
    this.response = {}
    this.responseCode = 200
    this.validatorOptions = {}
  }

  async run() {
    try {
      await this.preWork()
      await this.work()
    } catch (err) {
      if (err.ok)
        return this.respond(err)
      if (__DEBUG)
        console.error(err)
      this.throwError(err)
    }
  }

  async work() {

  }

  async preWork() {
    await this.ensureLogin()
    await this.validatePayload()
  }

  async preValidate() {

  }

  async validatePayload() {
    if (!this.Validator)
      return
    await this.preValidate()
    const validator = new this.Validator(this.req, this.validatorOptions)
    await validator.run()
    this.expectValidatedData(validator)
  }

  expectValidatedData(validator) {
    if (validator.asyncMethodsErrors && validator.asyncMethodsErrors[0])
      throw validator.asyncMethodsErrors
    if (validator.warnings[0])
      this.response.APIWarnings = validator.warnings
    if (!validator.isValid) {
      if (Object.keys(validator.errors)[0])
        throw { ...validator.error, errors: validator.errors }
      throw validator.error
    }
  }

  async ensureLogin() {
    const authToken = this.req.headers.authtoken
    if (!this.loginRequired && !authToken)
      return
    else if (!authToken)
      throw SESSION_ERRORS.SESSION_REQUIRED
    try {
      const decoded = await jwt.verify(authToken, __CONFIG.jwt.secret)
      const user = await Usedr.findActiveById(decoded._id)
      if (!user)
        return ERRORS.SESSION_EXPIRED
      await this.logIn(user)
    } catch (err) {
      throw SESSION_ERRORS.SESSION_REQUIRED
    }
  }

  async logIn(user) {
    if (!user)
      throw 'Controller.logIn error: missing user'
    this.req.user = this.user = user
  }

  respond() {
    this.response.ok = 1
    this.response.code = this.responseCode
    this.send()
  }

  throwError(err) {
    this.response = {
      ok: 0,
      url: this.url,
      fullUrl: this.fullUrl,
      method: this.method
    }

    if (!_.isString(err))
      this.response = { ...this.response, ...err }
    else {
      this.response.code = 500
      return this.send()
    }
    if (err.errors) {
      for (const key in err.errors) {
        err.errors[key] = err.errors[key].map(validationError => {
          const message = this.__(validationError.error)
          if (message !== validationError.error)
            validationError.message = message
          return validationError
        })
      }
    }

    if (!this.response.code)
      this.response.code = 500

    if (!err.message && err.error) {
      const message = this.__(err.error)
      if (message !== err.error)
        this.response.message = message
      if (!this.response.message && err.error.match('payload_validation')) {
        this.response.message = this.__('error_payload_validation')
      }
    }
    this.send()
  }

  send() {
    this.res.status(this.response.code || 500).send(this.response)
  }
}

module.exports = Controller