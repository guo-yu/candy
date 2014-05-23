module.exports = function(Schema) {
  return new Schema({
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
}