require('module-alias/register')
const path = require('path')
const _ = require('lodash')

const db = require('../src/data-base')

/*Globals*/
global.__ENV = process.env.NODE_ENV || 'development'
global.__DEV = __ENV === 'development'
global.__SERVER_PORT = process.env.PORT || 2000
global.__DEBUG = process.env.DEBUG ? true : false
global.__PWD = process.env.PWD
global.__CONFIG = require(`../config/${__ENV}.config`)
global.__TMP_DIR = path.join(process.env.PWD, 'tmp')
global.__CACHE_DIR = path.join(process.env.PWD, 'tmp', 'cache')
global.__MONGO_URI = process.env.MONGO_URI || __CONFIG.database.host


const run = async () => {
  /*Connect DB*/
  await db()

  /*Start express app*/
  require('../src/server')
}

run()

//NodeJS errors handlers
process.on('uncaughtException', (ex) => {
  console.error(ex)
  process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION AT:', p)
  console.error('REASON:', reason)
})