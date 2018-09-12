const express = require('express')
const pathToRegexp = require('path-to-regexp')

const ROUTES = require('./constants/ROUTES')

/*All endpoints*/
const endpoints = ROUTES.map(route => route.endpoint)

/*Router*/
const router = express.Router()

router.use(endpoints, async (req, res, next) => {
  /*Get route & Controller*/
  const route = ROUTES.find(route =>
    req.baseUrl.match(pathToRegexp(route.endpoint)) &&
    route.method.toUpperCase() === req.method
  )
  if (!route)
    return next()
  const Controller = route.Controller
  if (!Controller)
    return next()
  /*Execute the controller*/
  const controller = new Controller(req, res, next)
  await controller.run()
})

//TODO: use error controller
router.use('*', (req, res, next) => {
  res.sendStatus(404)
})

module.exports = router