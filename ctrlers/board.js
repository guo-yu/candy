module.exports = function(models, Ctrler) {

  var Board = new Ctrler(models.board);
  var Thread = new Ctrler(models.thread);
  var board = models.board;
  var thread = models.thread;

  // create board
  Board.create = function(bzid, baby, cb) {
    var baby = new board(baby);
    baby.bz.push(bzid);
    baby.save(function(err) {
      cb(err, baby);
    });
  }

  // read default board (001)
  Board.readDefault = function(id, callback) {
    if (!id) return board.findOne({}).exec(callback);
    return this.findById(id).exec(callback);
  }

  // read full board
  Board.read = function(id, callback) {
    board.findById(id).populate('threads').populate('bz').exec(callback);
  }

  // list all boards' name
  Board.lsName = function(callback) {
    board.find({}).select('name url').exec(callback);
  }

  // list all boards
  Board.ls = function(callback) {
    board.find({}).populate('bz').populate('threads').exec(callback);
  }

  // fetch board by query
  Board.fetch = function(page, limit, query, callback) {
    board.findOne(query).populate('bz').exec(function(err, target) {
      if (!target) return callback(null, null);
      var q = {}
      q.board = target._id;
      var cursor = Thread.page(page, limit, q);
      return cursor.count.exec(function(err, count) {
        if (err) return callback(err);
        cursor.pager.max = Math.round((count + limit - 1) / limit);
        cursor.query
          .populate('lz').populate('board')
          .sort('-pined').sort('-pubdate')
          .exec(function(err, threads) {
            var result = {}
            result.board = target;
            result.threads = threads;
            result.page = cursor.pager;
            return callback(err, result);
          });
      });
    });
  }

  Board.newbies = function(date, callback) {
    var query = {};
    query.$lte = date || new Date;
    return board.count(query).exec(callback);
  }

  return Board;

}