module.exports = function(Schema) {
  return new Schema({
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
  });
}