const configuration = require('./configuration')
const Datastore = require('nestdb')
const path = require('path')

const database = new Datastore({
  filename: path.join(configuration.databaseDir, 'installStatus.nedb'),
  autoload: true,
})

const set = (key, value) => {
  return new Promise((resolve, reject) => {
    database.update({ key }, { key, value }, { upsert: true }, (error) => {
      error ? reject(error) : resolve(value)
    })
  })
}

const get = (key) => {
  return new Promise((resolve, reject) => {
    database.findOne({ key }).exec((error, document_) => {
      if (error) reject(error)
      resolve((document_ || {}).value)
    })
  })
}

module.exports = {
  set,
  get,
}
