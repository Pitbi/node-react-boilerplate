const DEFAULT_CONFIG = require('./development.config')

const CONFIG = {
  ...DEFAULT_CONFIG,
  database: {
    name: 'nodejs-api-boilerplate-test',
    uri: 'mongodb://localhost:27017/nodejs-api-boilerplate-test'
  }
}

module.exports = CONFIG