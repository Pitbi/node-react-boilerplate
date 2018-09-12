const {
  makeError,
  makeEmailErrors,
  makeErrors
} = require('../../../../helpers/errors')

const feature = 'user_creation'

const ERRORS = {
  MAIN: makeError(feature, 'payload_validation', 400),
  ...makeEmailErrors(feature),
  EMAIL_ALREADY_USED: makeError(feature, 'email_already_used', 400),
  ...makeErrors(feature, 'first_name'),
  ...makeErrors(feature, 'last_name'),
  ...makeErrors(feature, 'password')
}

module.exports = ERRORS