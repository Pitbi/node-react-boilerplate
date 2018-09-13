const { setWorldConstructor } = require('cucumber')
const chai = require('chai')
const _ = require('lodash')

const CONFIG = require('@common/config/test.config')

const layer = global.__LAYER = process.env.LAYER || 'api'
global.__CONFIG = CONFIG
global.__FRONT = Boolean(__LAYER === 'front')
global.__API = Boolean(__LAYER === 'api')

chai.use(require('chai-match'))
chai.should()
chai.use(require('chai-things'))
chai.use(require('chai-subset'))

const LayerWorld = require(`./${layer}-world`)

const Classes = {
  User: require(`./User/${_.upperFirst(layer)}`)
}

class CustomWorld extends LayerWorld {
  constructor() {
    super()
    this.loadClasses()
  }

  loadClasses() {
    for (const Feature in Classes) {
      this[_.camelCase(Feature)] = new Classes[Feature](this)
    }
  }
}
  
setWorldConstructor(CustomWorld)