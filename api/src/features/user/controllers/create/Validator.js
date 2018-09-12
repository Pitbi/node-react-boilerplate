const Validator = require('api-request-validator')

const User = require('../../model')

const ERRORS = require('./ERRORS')
const REGEX = require('@common/constants/REGEXP')

const validations = {
  firstName: {
    required: {
      error: ERRORS.FIRST_NAME_MISSING
    },
    regexp: {
      error: ERRORS.FIRST_NAME_INVALID_FORMAT,
      data: REGEX.validations.userName
    }
  },
  lastName: {
    required: {
      error: ERRORS.LAST_NAME_MISSING
    },
    regexp: {
      error: ERRORS.LAST_NAME_INVALID_FORMAT,
      data: REGEX.validations.userName
    }
  },
  email: {
    required: {
      error: ERRORS.EMAIL_MISSING
    },
    regexp: {
      error: ERRORS.EMAIL_INVALID_FORMAT,
      data: REGEX.validations.email
    },
    asyncMethods: [
      {
        error: ERRORS.EMAIL_ALREADY_USED,
        data: 'isExistingEmail'
      }
    ]
  },
  password: {
    required: {
      error: ERRORS.PASSWORD_MISSING
    },
    regexp: {
      error: ERRORS.PASSWORD_INVALID_FORMAT,
      data: REGEX.validations.password
    }
  }
}

class CreateControllerValidator extends Validator {
  constructor(req, options = {}) {
    super(validations, req.body, {
      mainError: ERRORS.MAIN,
      filter: true
    })
  }

  async isExistingEmail(email) {
    if (this.errors.email)
      return true
    const user = await User.findOne({ email }).select('_id').lean()
    return !Boolean(user)
  }

  async afterValidate() {
    if (this.errors && this.errors.email) {
      const emailAlreadyExistError = this.errors.email.find(emailError =>
        emailError.error === 'error_user_creation_email_already_used'
      )
      if (emailAlreadyExistError) {
        this.error = emailAlreadyExistError
        delete this.errors
      }
    }
  }
}

module.exports = CreateControllerValidator