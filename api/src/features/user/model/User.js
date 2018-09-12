const _ = require('lodash')
const mongoose = require('mongoose')
const userSchema = require('./schemas/user')
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

const RegisterWorker = require('./workers/Register')

class UserClass {
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  get label() {
    return `${this.firstName} ${this.lastName}`
  }

  get shortFullName() {
    return `${this.firstName[0].toUpperCase()}. ${this.lastName}`
  }

  get initials() {
    return `${this.firstName[0].toUpperCase()}${this.lastName[0].toUpperCase()}`
  }

  static async findActiveByEmail(email) {
    return await this.findOne({
      email,
      active: true
    })
  }

  static async register(attributes, options = {}) {
    /*Todo: make worker*/
    const user = new User()
    const worker = new RegisterWorker(user, attributes, options)
    await worker.work()
    return user
  }

  async preSave() {
    if (this.isModified('password'))
      await this.setPassword()
  }

  async setPassword(password = this.password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(password, salt)
    this.password = hash
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
  }

  generateValidationToken() {
    this.tokens.accountValidations = _.times(20, () =>
      _.random(35).toString(36)).join('')
  }

  format() {
    const formated = this.toObject()
    delete formated.password
    return formated
  }
}

userSchema.loadClass(UserClass)

userSchema.pre('save', async function () {
  await this.preSave()
})

const User = mongoose.model('User', userSchema)

module.exports = User