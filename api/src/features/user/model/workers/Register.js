const UserWorker = require('./Worker')

class RegisterUserWorker extends UserWorker {
  constructor(user, attributes, options) {
    super(...arguments)
  }

  async work() {
    this.user.set(this.attributes)
    this.user.validated = true /*In the case of normal use, the account should be validated via email or other channel*/
    await this.saveUser()
  }
}

module.exports = RegisterUserWorker