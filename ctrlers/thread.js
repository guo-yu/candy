var model = require('../model'),
	thread = model.thread;

exports.read = function(id,cb){
	thread.findById(id).populate('lz').populate('board').exec(function(err,thread){
		if (!err) {
			cb(thread)
		} else {
			cb('error')
		}
	});
}

exports.create = function(baby,cb) {
	var baby = new thread(baby);
	baby.save(function(err){
		if (!err) {
			cb(baby);
		} else {
			console.log(err)
		}
	})
}

exports.update = function(id,body,cb) {
	thread.findByIdAndUpdate(id,body,function(err){
		if (!err) {
			cb(body);
		}
	})
}

// 删除之后要删除在相应board的索引？
exports.remove = function(id) {
	thread.findById(id).exec(function(err,t){
		if (!err) {
			t.remove();
			t.save();
		}
	})
}