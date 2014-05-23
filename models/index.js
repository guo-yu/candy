var models = {};
models.user = require('./user');
models.board = require('./board');
models.thread = require('./thread');
models.media = require('./media');
models.config = require('./config');

// define modles
module.exports = function(db, Schema) {
  var schemas = {};
  Object.keys(models).forEach(function(model){
    schemas[model] = db.model(model, models[model](Schema));
  });
  return schemas;
}