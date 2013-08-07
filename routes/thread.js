var thread = require('../ctrlers/thread');

exports.new = function(req,res,next) {
    res.render('thread/new');
}

exports.read = function(req,res,next) {
    thread.read(req.params.id,function(b){
        res.render('thread/index',{
            thread: b
        })
    });
}

exports.update = function(req,res,next) {
    thread.update(req.params.id,req.body.thread,function(thread){
        res.json({
            stat: thread.stat,
            thread: thread.body
        })
    });
}

exports.create = function(req,res,next) {
    thread.create(req.body.thread,function(baby){
        res.json({
            stat: 'ok',
            thread: baby
        })
    })
}

exports.remove = function(req,res,next) {
    thread.remove(req.params.id,function(thread){
        res.json({
            stat: thread.stat,
            thread: thread.body
        })
    })
}