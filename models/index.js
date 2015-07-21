import mongoose from 'mongoose'
import Promise from 'bluebird'

Promise.promisifyAll(mongoose)

const models = {}
const files = ['user', 'board', 'thread', 'media', 'config'] 

files.forEach(item =>
  models[toUpperCase(item)] = mongoose.model(item, require(`./${item}`)))

export default models

function toUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}
