const UserController = require('../Controller')
const Validator = require('./Validator')
const User = require('../../model')

class CreateUserController extends UserController {
  constructor() {
    super(...arguments)
    this.Validator = Validator
  }

  async work() {
    this.user = await User.register(this.req.body)
    this.response.user = this.user.format()
    this.respond()
  }
}

module.exports = CreateUserController