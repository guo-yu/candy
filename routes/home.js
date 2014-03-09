exports = module.exports = function(ctrlers, theme) {

    var thread = ctrlers.thread;

    return function(req, res, next) {
        thread.fetch(1, 20, {}, function(err, threads, pager) {
            if (err) return next(err);
            console.log(threads.length)
            console.log(pager);
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