import { Schema } from 'mongoose'
import Duoshuo from 'duoshuo'
import moment from 'moment'

const User = new Schema({
  url: String,
  email: String,
  phone: String,
  avatar: String,
  nickname: String,
  password: String,
  email_notification: String,
  social_networks: {},
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
})

User.static('read', id => {
  const query = {
    'duoshuo.user_id': id
  }

  return this.findOneAsync(query)
})

User.static('addThreadId', (id, tid) => {
  const query = {
    $push: {
      threads: tid
    }
  }

  return this.findByIdAndUpdateAsync(id, query)
})

User.static('sync', id => {
  const duoshuo = new Duoshuo(config)
  const typeMap = {
    admin: 'administrator',
    editor: 'editor',
    author: 'author',
    normal: 'user'
  }

  return this.findByIdAsync(id).then(user => {
    let ds = duoshuo.getClient(user.duoshuo.access_token)

    // Any other better choice ?
    return new Promise((res, rej) => {
      ds.join({
        info: {
          user_key: user._id,
          name: user.nickname,
          role: typeMap[user.type],
          avatar_url: user.avatar,
          url: user.url,
          created_at: moment(user.created).format('YYYY-MM-DD hh:MM:ss')
        }
      }, (err, ret) => {
        if (err)
          return rej(err)

        res(ret)
      })
    })
  })
})

User.virtual('admin').get(() => {
  return this.type === 'admin'
})

export default User
