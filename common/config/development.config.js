const DEFAULT_CONFIG = require('./config')

const CONFIG = {
  ...DEFAULT_CONFIG,
  database: {
    name: 'nodejs-api-boilerplate-dev',
    uri: 'mongodb://localhost:27017/nodejs-api-boilerplate-dev'
  }
}

module.exports = CONFIG