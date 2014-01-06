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
        },
        page: function(req, res, next) {
            if (!req.params.page) return next(new Error('404'));
            if (!isNaN(parseInt(req.params.page))) return next(new Error('404'));
            var page = parseInt(req.params.page, 10);
            thread.fetchByPage(page, 20, {}, function(err, threads, pager) {
                if (err) return next(err);
                if (!threads) return next(new Error('404'));
                if (threads.length === 0) return next(new Error('404'));
                res.render('index', {
                    threads: threads,
                    pager: pager
                });
            });
        }
    }

}