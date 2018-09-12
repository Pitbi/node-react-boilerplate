const mongoose = require('mongoose')
const {
  schemaRegexpValidation,
  makeValidationError
} = require('../../../../helpers/models')
const REGEXP = require('@common/constants/REGEXP')

const userSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, makeValidationError('User', 'firstName', 'required')],
    validate: schemaRegexpValidation.bind(null, REGEXP.validations.userName, 'User', 'firstName', 'invalid')()
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, makeValidationError('User', 'lastName', 'required')],
    validate: schemaRegexpValidation.bind(null, REGEXP.validations.userName, 'User', 'lastName', 'invalid')()
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, makeValidationError('User', 'email', 'required')],
    validate: schemaRegexpValidation.bind(null, REGEXP.validations.email, 'User', 'email', 'invalid')()
  },
  password: {
    type: String,
    required: [true, makeValidationError('User', 'password', 'required')],
    validate: schemaRegexpValidation.bind(null, REGEXP.validations.password, 'User', 'password', 'invalid')()
  },
  active: {
    type: Boolean,
    default: true
  },
  validated: {
    type: Boolean,
    default: false
  },
  tokens: {
    accountValidation: {
      type: String
    }
  }
})

module.exports = userSchema