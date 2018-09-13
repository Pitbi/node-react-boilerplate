const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const util = require('util')
const exec = util.promisify(require('child_process').exec)


class Mongo {
  static async connectClient() {
    return await MongoClient.connect('mongodb://localhost:27017/betterstreet-test', { useNewUrlParser: true })
  }

  static async importFile(collection, filePath) {
    if (!collection)
      throw 'Mongo import: missing collection'
    if (!filePath)
      throw 'Mongo import: missing file path'
    try {
      if (filePath[0] === '/')
        filePath = filePath.substr(1)
      await exec(`mongoimport --db betterstreet-test --collection ${collection} --drop --file ./dataset/${filePath.replace('.json', '')}.json`)
    } catch (err) {
      throw `Mongo import failure: ${err}`
    }
  }

  static async findDocument(collectionName, query = {}) {
    try {
      if (query._id)
        query._id = ObjectID(query._id)
      const client = await Mongo.connectClient()
      const db = client.db('betterstreet-test')
      const collection = db.collection(collectionName)
      const doc = await collection.findOne(query)
      return doc
    } catch (err) {
      throw `Mongo find document on ${collectionName} with ${query} ERROR: ${err}`
    }
  }

  static async updateDocument(collectionName, query, update) {
    try {
      const client = await Mongo.connectClient()
      const db = client.db('betterstreet-test')
      const collection = db.collection(collectionName)
      await collection.updateOne(query, { $set: update })
      return await Mongo.findDocument(collectionName, query)
      return result
    } catch (err) {
      throw `Mongo update document on ${collectionName} with ${query} and ${update} ERROR: ${err}`
    }
    
  }
}

module.exports = Mongo