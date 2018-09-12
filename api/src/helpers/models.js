const makeValidationError = (model = '', key = '', error = '') =>
  `${model.toLowerCase()}_validation_${key}_${error}`

const schemaRegexpValidation = (regexp, Model = '', key = '', error = '') => ({
  validator: (value) => regexp.test(value),
  message: makeValidationError(Model, key, error)
})

module.exports = {
  makeValidationError,
  schemaRegexpValidation
}