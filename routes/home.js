exports = module.exports = function($ctrlers) {

    var thread = $ctrlers.thread;

    return {
        index: function(req, res, next) {
            thread.fetchByPage(1, 20, {}, function(err, threads, pager) {
                if (err) return next(err);
                res.render('index', {
                    threads: threads,
                    pager: pager
                });
            });
        }
    }

}