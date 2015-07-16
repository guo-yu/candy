import { Schema } from 'mongoose'
import * as Models from './'

const Thread = new Schema({
  name: String,
  content: String,
  pined: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  pubdate: {
    type: Date,
    default: Date.now
  },
  lz: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'board'
  },
  media: [{
    type: Schema.Types.ObjectId,
    ref: 'media'
  }]
})

Thread.static('add', (baby, fn) => {
  const keysMap = {
    'Board': 'board',
    'User': 'lz'
  }

  this.createAsync(baby)
    .then(thread => {
      return Promise.all(['Board', 'User'].forEach(item => {
        return Models[item].addThreadId(
          thread[keysMap[item]], 
          thread._id
        )
      }))
    })
    .then(ret => fn(null, ret))
    .catch(fn)
})

Thread.static('read', (id, fn) => {
  return this.findById(id)
    .populate('lz')
    .populate('board')
    .populate('media')
    .exec(fn)
})

// 这里有冗余查询逻辑
Thread.static('fetch', ({ query }, fn) => {
  // `Page` should be rewrited as a mongoose plugin
  var cursor = this.page(page, limit, query)

  cursor.count.exec((err, count) => {
    if (err) 
      return fn(err)

    cursor.pager.max = Math.ceil(count / limit)
    cursor.query
      .populate('lz')
      .populate('board')
      .sort('-pined')
      .sort('-pubdate')
      .exec(function(err, threads) {
        fn(err, threads, cursor.pager)
      })
  })
})

Thread.static('ifGranted', (threadId, userId, fn) => {
  this
    .findByIdAsync(threadId)
    .then(thread => {
      if (!thread)
        return fn(null, false)

      return fn(null, thread.lz == userId)
    })
    .catch(fn)
})

export default Thread