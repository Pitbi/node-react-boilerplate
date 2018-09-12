const URLS = require('@common/constants/URLS')

const ROUTES = [
  {
    endpoint: URLS.session.auth,
    method: 'post',
    Controller: require('../features/session/controllers/auth/Controller')
  },
  {
    endpoint: URLS.user.resource,
    method: 'post',
    Controller: require('../features/user/controllers/create/Controller')
  }
]

module.exports = ROUTES