import mongoose from 'mongoose'
import Promise from 'bluebird'

Promise.promisifyAll(mongoose)

const models = {}
const files = ['user', 'board', 'thread', 'media', 'config'] 

files.forEach(item =>
  models[item] = mongoose.model(toUpperCase(item), require(`./${item}`)))

function toUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}

export default models
