var model = require('../model'),
	board = model.board,
	thread = require('./thread'),
	pager = require('./pager');

// 这三个可以ctrler可以合并成一个
exports.lsName = function(cb) {
	board.find({}).select('name url').exec(function(err, boards) {
		if (!err) {
			cb(null, boards)
		} else {
			cb(err);
		}
	});
}

exports.ls = function(cb) {
	board.find({}).populate('bz').populate('threads').exec(function(err, boards) {
		if (!err) {
			cb(null, boards)
		} else {
			cb(err);
		}
	});
}

// list board and select id
exports.lsId = function(params, cb) {
	board.find({}).select('_id').limit(params.limit).exec(function(err, boards) {
		if (!err) {
			cb(null, boards)
		} else {
			cb(err);
		}
	});
}

// read by url and list
exports.readByUrl = function(url, page, cb) {
	var limit = 10;
	board.findOne({
		url: url
	}).populate('bz').exec(function(err, board) {
		if (!err) {
			if (board) {
				pager(model.thread, {
					filter: {
						board: board._id
					},
					limit: limit,
					page: page
				}, function(err, page) {
					if (!err) {
						thread.lsByBoardId(board._id, {
							limit: page.limit,
							from: page.from
						}, function(err, ts) {
							if (!err) {
								cb(null, {
									board: board,
									threads: ts,
									page: page
								});
							} else {
								cb(err);
							}
						});
					} else {
						cb(err);
					}
				});
			} else {
				cb(null, null);
			}
		} else {
			cb(err)
		}
	});
}

// read default
exports.readDefault = function(cb) {
	board.findOne({}).exec(function(err, board) {
		if (!err) {
			cb(null, board)
		} else {
			cb(err)
		}
	});
}

// read breif
exports.brief = function(id, cb) {
	board.findById(id).exec(function(err, board) {
		if (!err) {
			cb(null, board)
		} else {
			cb(err)
		}
	});
}

// read by id
exports.read = function(id, cb) {
	board.findById(id).populate('threads').populate('bz').exec(function(err, board) {
		if (!err) {
			cb(null, board)
		} else {
			cb(err)
		}
	});
}

exports.create = function(bzid, baby, cb) {
	var baby = new board(baby);
	baby.bz.push(bzid);
	baby.save(function(err) {
		if (!err) {
			cb(null, baby);
		} else {
			cb(err)
		}
	})
}

exports.update = function(id, body, cb) {
	// 这里可以直接使用update
	board.findByIdAndUpdate(id, body, function(err) {
		if (!err) {
			cb(null, body);
		} else {
			cb(err)
		}
	})
}

exports.remove = function(id, cb) {
	board.findByIdAndRemove(id, function(err) {
		if (!err) {
			cb(null, id)
		} else {
			cb(err)
		}
	})
}