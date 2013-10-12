var Ctrler = function(model) {
    this.model = (model) ? model : null;
}

Ctrler.prototype.create = function(baby, callback) {
    var baby = new this.model(baby);
    baby.save(function(err) {
        callback(err, baby);
    });
}

Ctrler.prototype.read = function(id, callback) {
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        this.model.findById(id).exec(callback);
    }
}

Ctrler.prototype.update = function(id, baby, callback) {
    this.model.findByIdAndUpdate(id, baby, callback);
}

Ctrler.prototype.remove = function(id, callback) {
    this.model.findByIdAndRemove(id, callback);
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

// advanced find
Ctrler.prototype.find = function(params, callback) {
    this.model.find(params).exec(callback);
}

// advanced findOne
Ctrler.prototype.findOne = function(params, callback) {
    this.model.findOne(params).exec(callback);
}

// advanced query:
// var demo = user.query('findOne',{name: 'demo'});
// demo.select('sth'); demo.exec(function(err,result){});
Ctrler.prototype.query = function(type, params) {
    return this.model[type](params);
}

module.exports = Ctrler;