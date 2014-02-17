exports = module.exports = function(ctrlers, theme) {

    var thread = ctrlers.thread;

    return function(req, res, next) {
        thread.fetchByPage(1, 20, {}, function(err, threads, pager) {
            if (err) return next(err);
            theme.render('flat/index', {
                threads: threads,
                pager: pager
            }, function(err, html){
                if (err) return next(err)
                return res.send(html);
            });
        });
    };

}