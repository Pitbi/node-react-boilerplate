const Validator = require('api-request-validator')

const ERRORS = require('./ERRORS')
const REGEX = require('@common/constants/REGEXP')

const validations = {
  email: {
    type: {
      error: ERRORS.EMAIL_INVALID_TYPE,
      data: 'string'
    },
    required: {
      error: ERRORS.EMAIL_MISSING,
      data: 'string'
    },
    regexp: {
      error: ERRORS.EMAIL_INVALID_FORMAT,
      data: REGEX.validations.email
    }
  },
  password: {
    type: {
      error: ERRORS.PASSWORD_INVALID_TYPE,
      data: 'string'
    },
    required: {
      error: ERRORS.PASSWORD_MISSING
    },
    regexp: {
      error: ERRORS.PASSWORD_INVALID_FORMAT,
      data: REGEX.validations.password
    }
  }
}

class SessionAuthValidator extends Validator {
  constructor(req) {
    super(validations, req.body, {
      mainError: ERRORS.MAIN,
      filter: true
    })
  }
}

module.exports = SessionAuthValidator