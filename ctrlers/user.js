var moment = require('moment'),
    Duoshuo = require('duoshuo');

exports = module.exports = function($models, $Ctrler) {

    var User = new $Ctrler($models.user),
        user = $models.user;

    User.checkAdmin = function(uid, callback) {
        if (this.checkId(uid)) {
            this.read(uid, function(err, user) {
                callback(err, (user && user.type == 'admin'))
            });
        } else {
            callback(new Error('ObjectId is required.'))
        }
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
        }, callback);
    }

    return User;

}