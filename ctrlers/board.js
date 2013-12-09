var async = require('async');

exports = module.exports = function($models, $Ctrler) {

    var Board = new $Ctrler($models.board),
        Thread = new $Ctrler($models.thread),
        board = $models.board,
        thread = $models.thread

    // create board
    Board.create = function(bzid, baby, cb) {
        var baby = new board(baby);
        baby.bz.push(bzid);
        baby.save(function(err) {
            cb(err, baby);
        });
    }

    // read default board (001)
    Board.readDefault = function(callback) {
        board.findOne({}).exec(callback);
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

    // List board IDs
    Board.lsId = function(params, callback) {
        board.find({}).select('_id').limit(params.limit).exec(callback);
    }

    // fetch board by url
    Board.readByUrl = function(url, page, cb) {
        var limit = 10;
        async.waterfall([
            function(callback) {
                board.findOne({
                    url: url
                }).populate('bz').exec(callback);
            },
            function(b, callback) {
                Thread.page(page, limit, {
                    board: b._id
                }, function(err, threads, pager){
                    callback(err, b, threads, pager)
                });
            }
        ], function(err, result) {
            if (!err) {
                console.log(result);
                cb(null, {
                    board: result.b,
                    threads: result.threads,
                    page: result.pager
                });
            } else {
                cb(err);
            }
        });
    }

    return Board;

}