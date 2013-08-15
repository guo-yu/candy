var model = require('../model'),
	thread = model.thread,
	board = require('./board'),
	user = require('./user'),
	async = require('async');

// list thread
exports.ls = function(cb) {
	thread.find({}).exec(function(err, threads) {
		if (!err) {
			cb(threads)
		} else {
			cb('error');
		}
	});
}

// list thread by board id
exports.lsByBoardId = function(bid,params,cb) {
	thread.find({
		board: bid
	}).limit(params.limit).populate('lz').populate('board').exec(function(err, threads) {
		if (!err) {
			cb(threads)
		} else {
			cb('error');
		}
	});
}

// 查看当前用户是否是楼主
exports.checkLz = function(tid, uid, cb) {
	thread.findById(tid).exec(function(err, thread) {
		if (!err) {
			if (thread) {
				if (thread.lz == uid) {
					cb(true,thread)
				} else {
					cb(false)
				}
			} else {
				cb(false)
			}
		} else {
			cb('error')
		}
	});
}

exports.read = function(id, cb) {
	thread.findById(id).populate('lz').populate('board').exec(function(err, thread) {
		if (!err) {
			cb(thread)
		} else {
			cb('error')
		}
	});
}

exports.create = function(baby, cb) {
	var baby = new thread(baby);
	// console.log(baby);
	async.waterfall([
		function(callback) {
			baby.save(function(err) {
				if (!err) {
					callback(null, baby);
				} else {
					cb(err);
				}
			});
		},
		function(baby, callback) {
			board.brief(baby.board,function(b){
				b.threads.push(baby._id);
				b.save(function(err){
					if (!err) {
						callback(null, baby)
					} else {
						console.log(err)
						cb(err);
					}
				})
			})
		},
		function(baby, callback) {
			user.queryById(baby.lz,function(u){
				u.threads.push(baby._id);
				u.save(function(err){
					if (!err) {
						cb(null,baby);
					} else {
						console.log(err);
						cb(err);
					}
				})
			})
		}
	]);
}

exports.update = function(id, body, cb) {
	thread.findByIdAndUpdate(id, body, function(err) {
		if (!err) {
			cb(null,body);
		} else {
			cb(err)
		}
	})
}

// 删除之后要删除在相应board的索引？
exports.remove = function(id) {
	thread.findById(id).exec(function(err, t) {
		if (!err) {
			t.remove();
			t.save();
		}
	})
}