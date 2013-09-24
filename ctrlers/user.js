var model = require('../model'),
	user = model.user,
	moment = require('moment'),
	Duoshuo = require('duoshuo');

// list users
exports.ls = function(cb) {
	user.find({}).exec(function(err, us) {
		cb(err, us);
	});
}

// count users
exports.count = function(cb) {
	user.count({}, function(err, count) {
		cb(err, count);
	});
}

// check admin
exports.checkAdmin = function(uid,cb) {
	exports.queryById(uid,function(err,user){
		if (!err) {
			cb(null,(user.type == 'admin'));
		} else {
			cb(err)
		}
	})
}

// 读取一个用户
exports.read = function(id, cb) {
	// 这里没有做分页
	user.findById(id).populate('threads').exec(function(err, user) {
		cb(err, user);
	});
}

// queryById
exports.queryById = function(id, cb) {
	user.findById(id).exec(function(err, user) {
		cb(err, user);
	});
}

// 读取一个用户by user_id
exports.readByDsId = function(id, cb) {
	user.findOne({
		'duoshuo.user_id': id
	}).exec(function(err, user) {
		cb(err, user);
	});
}

// 创建用户
exports.create = function(baby, cb) {
	var baby = new user(baby);
	baby.save(function(err) {
		cb(err, baby);
	})
}

// 同步一个用户到多说
exports.sync = function(config, user, cb) {
	var duoshuo = new Duoshuo(config);
	var typeMap = {
		admin: 'administrator',
		editor: 'editor',
		author: 'author',
		normal: 'user'
	};
	var u = {
		user_key: user._id,
		name: user.nickname,
		role: typeMap[user.type],
		avatar_url: user.avatar,
		url: user.url,
		created_at: moment(user.created).format('YYYY-MM-DD hh:MM:ss')
	};
	// sync user info
	duoshuo.join({
		info: u,
		access_token: user.duoshuo.access_token
	}, function(err,result) {
		cb(err,result);
	});
}

// 更新用户
exports.update = function(id, body, cb) {
	user.findByIdAndUpdate(id, body, function(err) {
		cb(err, body);
	})
}

// 删除用户
exports.remove = function(id) {
	user.findByIdAndRemove(id, function(err) {
		cb(err, id);
	})
}