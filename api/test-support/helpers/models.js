const validate = async (instance) => {
  let error
  try {
    await instance.validate()
  } catch (err) {
    error = err
  }
  return error
}

module.exports = {
  validate
}