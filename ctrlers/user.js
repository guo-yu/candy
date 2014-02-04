var moment = require('moment'),
    Duoshuo = require('duoshuo');

var typeMap = {
    admin: 'administrator',
    editor: 'editor',
    author: 'author',
    normal: 'user'
};

exports = module.exports = function($models, $Ctrler) {

    var User = new $Ctrler($models.user),
        user = $models.user;

    User.checkAdmin = function(uid, callback) {
        if (!(this.checkId(uid))) return callback(new Error('ObjectId is required.'));
        this.read(uid, function(err, user) {
            callback(err, (user && user.type == 'admin'))
        });
    }

    User.read = function(id, callback) {
        user.findById(id).populate('threads').exec(callback);
    }

    User.readByDsId = function(id, callback) {
        user.findOne({
            'duoshuo.user_id': id
        }).exec(callback);
    }

    User.sync = function(config, user, callback) {
        var duoshuo = new Duoshuo(config);
        duoshuo.join({
            access_token: user.duoshuo.access_token
            info: {
                user_key: user._id,
                name: user.nickname,
                role: typeMap[user.type],
                avatar_url: user.avatar,
                url: user.url,
                created_at: moment(user.created).format('YYYY-MM-DD hh:MM:ss')
            }
        }, callback);
    }

    return User;

}