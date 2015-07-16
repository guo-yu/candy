import { Schema } from 'mongoose'

const media = new Schema({
  name: String,
  src: String,
  url: String,
  cdn: String,
  type: String,
  size: Number,
  download: {
    type: Number,
    default: 0
  },
  share: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'public'
  },
  pubdate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

media.static('read', (id, fn) => {
  this.findById(id)
    .populate('threads')
    .populate('user')
    .exec(fn)
})

// Should be rewited with $inc
media.static('count', (file, fn) => {
  if (file.count) {
    file.count.download ++
  } else {
    file.download ++
  }

  return file.save(fn)
})

export default media 
