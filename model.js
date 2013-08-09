/**
 * db configs
 */

var mongoose = require('mongoose'),
    db = mongoose.createConnection('localhost', 'candy'),
    Schema = mongoose.Schema;

// configs
var configModel = new Schema({
    name: String,
    desc: String,
    url: String,
    duoshuo: {
        short_name: String,
        secret: String
    },
    created: {
        type: Date,
        default: new Date()
    }
});

// 用户模型
// 如果要同步的话，如何抓取到用户在多说的『我的站点』发布的评论和帖子？实际上帖子是在这里的，评论我是拿不到的。
var userModel = new Schema({
    nickname: String,
    email: String,
    avatar: String,
    password: String,
    phone: String,
    url: String,
    created: {
        type: Date,
        default: new Date()
    },
    type: {
        type: String,
        default: 'normal'
    },
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'thread'
    }],
    duoshuo: {
        user_id: {
            type: String,
            unique: true
        },
        access_token: String
    }
});

// 板块模型
var boardModel = new Schema({
    name: String,
    desc: String,
    banner: String,
    url: {
        type: String,
        unique: true
    },
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'thread'
    }],
    bz: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
})

// 帖子模型
var threadModel = new Schema({
    name: String,
    content: String,
    tid: {
        type: Number,
        unique: true
    },
    views: {
        type: Number,
        default: 0
    },
    pubdate: {
        type: Date,
        default: new Date()
    },
    lz: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'board'
    }
});

exports.config = db.model('config', configModel);
exports.user = db.model('user', userModel);
exports.board = db.model('board', boardModel);
exports.thread = db.model('thread', threadModel);