var matcher = function(id) {
    return (id && id.match(/^[0-9a-fA-F]{24}$/));
}

var Ctrler = function(model) {
    this.model = model ? model : null;
}

Ctrler.prototype.checkId = matcher;

Ctrler.prototype.create = function(baby, callback) {
    this.model.create(baby, callback);
}

Ctrler.prototype.findById = function(id, callback) {    
    if (matcher(id)) this.model.findById(id).exec(callback);
}

Ctrler.prototype.update = function(id, update, callback) {
    if (matcher(id)) this.model.findByIdAndUpdate(id, update, callback);
}

Ctrler.prototype.updates = function(params, update, callback) {
    if (matcher(id)) this.model.update(params, update, callback);
}

Ctrler.prototype.updateOne = function(id, update, callback) {
    if (matcher(id)) this.model.findOneAndUpdate(id, update, callback);
}

Ctrler.prototype.remove = function(id, callback) {
    if (matcher(id)) this.model.findByIdAndRemove(id, callback);
}

Ctrler.prototype.removes = function(params, callback) {
    if (matcher(id)) this.model.remove(params, callback);
}

Ctrler.prototype.removeOne = function(id, callback) {
    if (matcher(id)) this.model.findOneAndRemove(id, callback);
}

Ctrler.prototype.populate = function(doc, params, callback) {
    this.model.populate(doc, params, callback);
}

Ctrler.prototype.count = function(params, callback) {
    var cb = (!callback && typeof(params) === 'function') ? params : callback,
        query = (params && typeof(params) === 'object') ? params : {};
    this.model.count(query, cb);
}

Ctrler.prototype.list = function(params, callback) {
    var cb = (!callback && typeof(params) === 'function') ? params : callback,
        query = (params && typeof(params) === 'object') ? params : {};
    this.model.find(query).exec(cb);
}

Ctrler.prototype.page = function(page, limit, params, callback) {
    var self = this,
        from = (page && page > 1) ? ((page - 1) * limit) : 0;
    self.model.count(params).exec(function(err, count) {
        if (!err) {
            self.model.find(params).skip(from).limit(limit).exec(function(err, results) {
                callback(err, results, {
                    limit: limit,
                    current: page ? page : 1,
                    max: Math.round(count / limit)
                });
            });
        } else {
            callback(err);
        }
    });
}

module.exports = Ctrler;