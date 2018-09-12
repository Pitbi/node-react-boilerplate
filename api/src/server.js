const bodyParser = require('body-parser')
const colour = require('colour')
const express = require('express')
const http = require('http')
const i18n = require('i18n')
const morgan = require('morgan')
const multipart = require('connect-multiparty')

const router = require('./router')

const APP = require('@common/constants/APP')

//Express server
const app = express()
const server = http.createServer(app)

//i18n
i18n.configure({
  locales: APP.i18n.locales,
  directory: `${__PWD}/src/locales`,
  extension: '.json',
  defaultLocale: APP.i18n.default,
  updateFiles: false,
  syncFiles: false
})
app.use(i18n.init)

//Setup
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({
  limit: '1mb'
}))
app.use(multipart())
if (__DEV)
  app.use(morgan('dev'))

//Router
app.use(router)

//Launch server
server.listen(__SERVER_PORT, () => {
  console.info('[ENV]'.cyan, ` ${__ENV}`)
  console.info('[DB]'.cyan, `  ${__MONGO_URI}`)
  console.info('[PORT]'.cyan, `Listening on port ${__SERVER_PORT}`)
  console.info(`       http://localhost:${__SERVER_PORT}`)
})