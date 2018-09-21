const SessionController = require('../Controller')
const Validator = require('./Validator')
const User = require('../../../user/model')
const ERRORS = require('./ERRORS')

class AuthController extends SessionController {
  constructor() {
    super(...arguments)
    this.Validator = Validator
  }

  async work() {
    const { body } = this.req
    const user = await User.findActiveByEmail(body.email)
    if (!user)
      return this.throwError(ERRORS.EMAIL_UNKNOWN)
    const passwordMatch = await user.comparePassword(body.password)
    if (!passwordMatch)
      return this.throwError(ERRORS.PASSWORD_WRONG)
    if (!user.validated)
      return this.throwError(ERRORS.USER_NOT_VALIDATED)
    await this.logIn(user)

    this.response.authToken = user.makeJWT()
    this.response.user = user.format()

    this.respond()
  }
}

module.exports = AuthController