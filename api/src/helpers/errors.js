const _ = require('lodash')

const makeTypeError = (feature = '', key = '', validType = '', validTypes = []) => ({
  error: `type_error_${feature}_${key}`,
  info: `The ${key} attribute must be a ${validType}`,
  code: 422
})

const makeError = (feature = '', error = '', code = 422, info) => ({
  error: `error_${feature}_${error}`,
  code,
  info
})

const makeWarning = (feature = '', warning = '', info) => ({
  warning: `warning_${feature}_${warning}`,
  info
})

const makeEmailErrors = (feature, label = 'email') => ({
  EMAIL_INVALID_TYPE: makeTypeError(feature, label, 'string'),
  EMAIL_MISSING: makeError(feature, `${label}_missing`),
  EMAIL_INVALID_FORMAT: makeError(feature, `${label}_invalid`),
  EMAIL_UNKNOWN: makeError(feature, `${label}_unknown`, 401)
})

const makeErrors = (feature, label = 'name') => ({
  [`${_.toUpper(label.trim().replace(/ /g, '_'))}_INVALID_TYPE`]: makeTypeError(feature, label, 'string'),
  [`${_.toUpper(label.trim().replace(/ /g, '_'))}_MISSING`]: makeError(feature, `${label}_missing`),
  [`${_.toUpper(label.trim().replace(/ /g, '_'))}_INVALID_FORMAT`]: makeError(feature, `${label}_invalid`)
})

module.exports = {
  makeTypeError,
  makeError,
  makeWarning,
  makeEmailErrors,
  makeErrors
}