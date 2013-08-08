var model = require('../model'),
	board = model.board;

// list board
exports.ls = function(cb){
	board.find({}).populate('bz').exec(function(err,boards){
		if (!err) {
			cb(boards)
		} else {
			cb('error');
		}
	});
}

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