var model = require('../model'),
	board = model.board,
	thread = require('./thread'),
	pager = require('./pager');

// list board
exports.ls = function(cb){
	board.find({}).populate('bz').populate('threads').exec(function(err,boards){
		if (!err) {
			cb(boards)
		} else {
			cb('error');
		}
	});
}

// list board
exports.lsId = function(params,cb){
	board.find({}).select('_id').limit(params.limit).exec(function(err,boards){
		if (!err) {
			cb(boards)
		} else {
			cb('error');
		}
	});
}

// read by url and list pager
exports.readByUrl = function(url,page,cb){
	var limit = 10;
	board.findOne({
		url: url
	}).populate('bz').exec(function(err,board){
		if (!err && board) {
			pager(model.thread,{
				filter: {
					board: board._id
				},
				limit: limit,
				page: page
			},function(page){
				thread.lsByBoardId(board._id,{
					limit: page.limit,
					from: page.from
				},function(ts){
					cb({
						board: board,
						threads: ts,
						page: page
					});
				})
			})
		} else {
			console.log(err)
			cb('error')
		}
	});
}

// read default
exports.readDefault = function(cb){
	board.findOne({}).exec(function(err,board){
		if (!err) {
			cb(board)
		} else {
			cb('error')
		}
	});
}

// read breif
exports.brief = function(id,cb){
	board.findById(id).exec(function(err,board){
		if (!err) {
			cb(board)
		} else {
			console.log(err)
			cb('error')
		}
	});
}

// read by id
exports.read = function(id,cb){
	board.findById(id).populate('threads').populate('bz').exec(function(err,board){
		if (!err) {
			cb(board)
		} else {
			console.log(err)
			cb('error')
		}
	});
}

exports.create = function(bzid,baby,cb) {
	var baby = new board(baby);
	baby.bz.push(bzid);
	baby.save(function(err){
		if (!err) {
			cb({
				stat: 'ok',
				body: baby
			});
		} else {
			cb({
				stat: 'error',
				error: err
			})
		}
	})
}

exports.update = function(id,body,cb) {
	// 这里可以直接使用update
	board.findByIdAndUpdate(id,body,function(err){
		if (!err) {
			cb({
				stat: 'ok',
				body: body
			});
		} else {
			console.log(err)
			cb({
				stat: 'err'
			})
		}
	})
}

exports.remove = function(id,cb) {
	board.findById(id).exec(function(err,b){
		if (!err) {
			b.remove();
			b.save();
			cb({
				stat: 'ok',
				body: b
			});
		} else {
			console.log(err)
			cb({
				stat: 'err'
			})
		}
	})
}