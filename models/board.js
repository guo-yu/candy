module.exports = function(Schema) {
  return new Schema({
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
  });
}
