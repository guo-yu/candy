module.exports = function(collection,params,cb) {
    collection.count(params.filter).exec(function(err, count) {
        cb({
            current: params.page ? params.page : 1,
            limit: params.limit,
            from: (params.page && params.page > 1) ? ((params.page - 1) * params.limit + 1) : 0,
            max: Math.round(count / params.limit)
        })
    })
}