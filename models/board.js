import { Schema } from 'mongoose'
import { Thread } from './'

const Board = new Scheme({
  name: String,
  desc: String,
  banner: String,
  created: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    unique: true
  },
  threads: [{
    type: Schema.Types.ObjectId,
    ref: 'thread'
  }],
  bz: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
})

Board.static('add', ({ moderator, baby }, fn) => {
  baby.bz.push(moderator)
  return this.create(baby, fn)
})

Board.static('addThreadId', (id, tid, fn) => {
  return this.findByIdAndUpdate(id, {
    $push: {
      threads: tid
    }
  }, fn)
})

Board.static('findByIdAndPop', (id, fn) => {
  return this.findById(id)
    .populate('threads')
    .populate('bz')
    .exec(fn)
})

Board.static('list', fn => {
  return this.find({})
    .populate('bz')
    .populate('threads')
    .exec(fn)
})

Board.static('latest', fn => 
  return this.findOne({}).exec(fn))

Board.static('fetch', ({ query }, fn) => {
  this.findOne(query)
    .populate('bz')
    .exec(filters)

  function filters(err, target) {
    if (err)
      return fn(err)
    if (!target)
      return fn(null, null)

    const q = {
      board: target._id
    }

    var cursor = Thread.page(page, limit, q)

    return cursor.count.exec((err, count) => {
      if (err) 
        return fn(err)

      cursor.pager.max = Math.round((count + limit - 1) / limit)
      cursor.query
        .populate('lz')
        .populate('board')
        .sort('-pined')
        .sort('-pubdate')
        .exec((err, threads) => {
          return fn(err, {
            threads,
            board: target,
            page: cursor.pager
          })
        })
    })
  }
})

export default Board
