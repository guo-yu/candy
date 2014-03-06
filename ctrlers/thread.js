var async = require('async');

exports = module.exports = function($models, $Ctrler) {

    var Thread = new $Ctrler($models.thread),
        thread = $models.thread,
        board = $models.board,
        user = $models.user;

    Thread.lsByBoardId = function(bid, params, callback) {
        thread.find({
            board: bid
        }).skip(params.from).limit(params.limit).sort('-pubdate').populate('lz').populate('board').exec(callback);
    }

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

    Thread.fetchByPage = function(page, limit, query, callback) {
        var cursor = this.page(page, limit, query);
        cursor.query.populate('lz').populate('board').exec(function(err, threads) {
            callback(err, threads, cursor.pager);
        });
    }

    Thread.checkLz = function(tid, uid, callback) {
        thread.findById(tid).populate('media').exec(function(err, thread) {
            if (err) return callback(err);
            if (!thread) return callback(null, false);
            if (thread.lz == uid) return callback(null, true, thread);
            return user.findById(uid).exec(function(err, u){
                return callback(err, (u && u.type == 'admin'), thread);
            });
        });
    }

    return Thread;

}