module.exports = function(collection,params,cb) {
    collection.count(params.filter).exec(function(err, count) {
        if (!err) {
            var page = parseInt(params.page);
            cb(null,{
                current: page ? page : 1,
                limit: params.limit,
                from: (page && page > 1) ? ((page - 1) * params.limit) : 0,
                max: Math.round(count / params.limit)
            })
        } else {
            cb(err);
        }
    })
}