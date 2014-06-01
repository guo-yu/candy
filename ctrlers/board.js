module.exports = function(models, Ctrler) {

  var Board = new Ctrler(models.board);
  var Thread = new Ctrler(models.thread);
  var board = models.board;
  var thread = models.thread;

  // Create a baby board
  Board.create = function(bzid, baby, cb) {
    var baby = new board(baby);
    baby.bz.push(bzid);
    baby.save(function(err) {
      cb(err, baby);
    });
  }

  // Read a selected board or default board
  Board.read = function(id, callback) {
    if (!id) return board.findOne({}).exec(callback);
    if (!this.checkId(id)) return callback(new Error('404'));
    board.findById(id).populate('threads').populate('bz').exec(callback);
  }

  // List all boards or list selected params board.
  Board.list = function(selects, callback) {
    if (!selects || selects === 'all') {
      return board.find({}).populate('bz').populate('threads').exec(callback);
    }
    return board.find({}).select(selects).exec(callback);
  }

  // Fetch board by query
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

  // Fetch a group of newbie board.
  Board.newbies = function(date, callback) {
    var query = {};
    query.$lte = date || new Date;
    return board.count(query).exec(callback);
  }

  return Board;

}