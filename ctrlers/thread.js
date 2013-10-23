var Ctrler = require('./index'),
	model = require('../models/index'),
	thread = model.thread,
	board = require('./board'),
	user = require('./user'),
	async = require('async');

var Thread = new Ctrler(thread);

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
			board.brief(baby.board, function(err, b) {
				if (!err) {
					b.threads.push(baby._id);
					b.save(function(err) {
						callback(err, baby);
					})
				} else {
					callback(err)
				}
			})
		},
		function(baby, callback) {
			user.queryById(baby.lz, function(err, u) {
				if (!err) {
					u.threads.push(baby._id);
					u.save(function(err) {
						callback(err, baby);
					})
				} else {
					callback(err)
				}
			})
		}
	], cb);
}

Thread.read = function(id, callback) {
	if (this.checkId(id)) {
		thread.findById(id).populate('lz').populate('board').populate('media').exec(callback);
	} else {
		cb(new Error('404'));
	}
}

Thread.checkLz = function(tid, uid, cb) {
	thread.findById(tid).populate('media').exec(function(err, thread) {
		if (!err) {
			if (thread) {
				if (thread.lz == uid) {
					cb(null, true, thread)
				} else {
					user.checkAdmin(uid, function(err, result) {
						if (!err) {
							if (result) {
								cb(null, true, thread)
							} else {
								cb(null, false)
							}
						} else {
							cb(err)
						}
					})
				}
			} else {
				cb(null, false)
			}
		} else {
			cb(err)
		}
	});
}
module.exports = Thread;