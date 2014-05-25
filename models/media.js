module.exports = function(Schema) {
  return new Schema({
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
  });
}