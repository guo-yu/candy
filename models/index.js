// define modles
module.exports = function(db, Schema) {

  // configs
  var configModel = new Schema({
    name: String,
    desc: String,
    theme: {
      type: String,
      default: 'flat'
    },
    duoshuo: {
      short_name: String,
      secret: String
    },
    created: {
      type: Date,
      default: Date.now
    }
  });

  // users
  var userModel = new Schema({
    nickname: String,
    email: String,
    avatar: String,
    password: String,
    phone: String,
    url: String,
    created: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      default: 'normal'
    },
    threads: [{
      type: Schema.Types.ObjectId,
      ref: 'thread'
    }],
    duoshuo: {
      user_id: {
        type: String,
        unique: true
      },
      access_token: String
    }
  });

  // boards
  var boardModel = new Schema({
    name: String,
    desc: String,
    banner: String,
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

  // threads
  var threadModel = new Schema({
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
  });

  // media
  var mediaModel = new Schema({
    name: String,
    src: String,
    url: String,
    cdn: String,
    type: String,
    size: Number,
    count: {
      download: {
        type: Number,
        default: 0
      },
      share: {
        type: Number,
        default: 0
      }
    },
    stat: {
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
  });

  return {
    config: db.model('config', configModel),
    user: db.model('user', userModel),
    board: db.model('board', boardModel),
    thread: db.model('thread', threadModel),
    media: db.model('media', mediaModel)
  }
}