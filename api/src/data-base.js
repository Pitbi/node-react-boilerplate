const mongoose = require('mongoose')

const connect = async () => {
  try {
    await mongoose.connect(__MONGO_URI, { useNewUrlParser: true })
  } catch (err) {
    throw err
  }
}

module.exports = connect