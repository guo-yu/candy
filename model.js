/**
 * db models
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('./database'),
    db = mongoose.createConnection('localhost', config.name);

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
        default: Date.now
    }
});

// users
var userModel = new Schema({
    nickname: String,
    email: String,
    avatar: String,
    password: String,
    phone: String,
    url: String,
    created: {
        type: Date,
        default: Date.now
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

// boards
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

// threads
var threadModel = new Schema({
    name: String,
    content: String,
    views: {
        type: Number,
        default: 0
    },
    pubdate: {
        type: Date,
        default: Date.now
    },
    lz: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'board'
    },
    media: [{
        type: Schema.Types.ObjectId,
        ref: 'media'
    }]
});

// media
var mediaModel = new Schema({
    name: String,
    src: String,
    url: String,
    cdn: String,
    type: String,
    meta: {
        size: Number,
        lastModifiedDate: Date
    },
    count: {
        download: {
            type: Number,
            default: 0
        },
        share: {
            type: Number,
            default: 0
        }
    },
    stat: {
        type: String,
        default: 'public'
    },
    pubdate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

exports.config = db.model('config', configModel);
exports.user = db.model('user', userModel);
exports.board = db.model('board', boardModel);
exports.thread = db.model('thread', threadModel);
exports.media = db.model('media', mediaModel);