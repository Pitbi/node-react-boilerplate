const { makeTypeError, makeError } = require('../../../../helpers/errors')

const feature = 'session_auth'

const ERRORS = {
  MAIN: makeError(feature, 'payload_validation', 400),
  EMAIL_INVALID_TYPE: makeTypeError(feature, 'email', 'string'),
  EMAIL_MISSING: makeError(feature, 'email_missing'),
  EMAIL_INVALID_FORMAT: makeError(feature, 'email_invalid'),
  EMAIL_UNKNOWN: makeError(feature, 'email_unknown', 401),
  PASSWORD_INVALID_TYPE: makeTypeError(feature, 'password', 'string'),
  PASSWORD_MISSING: makeError(feature, 'password_missing'),
  PASSWORD_INVALID_FORMAT: makeError(feature, 'password_invalid'),
  PASSWORD_WRONG: makeError(feature, 'password_wrong', 401),
  USER_NOT_VALIDATED: makeError(feature, 'user_not_validated', 401),
  USER_NOT_ACTIVE: makeError(feature, 'user_not_active', 401)
}

module.exports = ERRORS