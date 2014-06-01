var async = require('async');

module.exports = function(models, Ctrler) {

  var Thread = new Ctrler(models.thread);
  var thread = models.thread;
  var board = models.board;
  var user = models.user;

  Thread.create = function(baby, cb) {
    var baby = new thread(baby);
    async.waterfall([
      function(callback) {
        baby.save(function(err) {
          callback(err, baby);
        });
      },
      function(baby, callback) {
        board.findById(baby.board, function(err, b) {
          if (err) return callback(err);
          b.threads.push(baby._id);
          b.save(function(err) {
            callback(err, baby);
          });
        })
      },
      function(baby, callback) {
        user.findById(baby.lz, function(err, u) {
          if (err) return callback(err);
          u.threads.push(baby._id);
          u.save(function(err) {
            callback(err, baby);
          });
        });
      }
    ], cb);
  }

  Thread.read = function(id, callback) {
    if (!(this.checkId(id))) return callback(new Error('404'));
    return thread.findById(id).populate('lz').populate('board').populate('media').exec(callback);
  }

  Thread.fetch = function(page, limit, query, callback) {
    var cursor = this.page(page, limit, query);
    // 这里有冗余查询逻辑
    cursor.count.exec(function(err, count) {
      if (err) return callback(err);
      cursor.pager.max = Math.ceil(count / limit);
      cursor.query
        .populate('lz').populate('board')
        .sort('-pined').sort('-pubdate')
        .exec(function(err, threads) {
          callback(err, threads, cursor.pager);
        });
    });
  }

  Thread.checkLz = function(tid, uid, callback) {
    thread.findById(tid).populate('media').exec(function(err, thread) {
      if (err) return callback(err);
      if (!thread) return callback(null, false);
      if (thread.lz == uid) return callback(null, true, thread);
      return user.findById(uid).exec(function(err, u) {
        return callback(err, (u && u.type == 'admin'), thread);
      });
    });
  }

  Thread.newbies = function(date, callback) {
    var query = {};
    query.$lte = date || new Date;
    return thread.count(query).exec(callback);
  }

  return Thread;

}
