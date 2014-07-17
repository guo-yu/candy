module.exports = function(Schema) {
  return new Schema({
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
}
