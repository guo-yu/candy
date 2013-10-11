var Ctrler = function(model) {
    this.model = (model) ? model : null;
}

// create model instance
Ctrler.prototype.create = function(baby, cb) {
    var baby = new this.model(baby);
    baby.save(function(err) {
        cb(err, baby);
    });
}

// remove by ObjectID
Ctrler.prototype.remove = function(id, cb) {
    this.model.findByIdAndRemove(id, function(err) {
        cb(err, id);
    });
}

// update by ObjectID
Ctrler.prototype.update = function(id, baby, cb) {
    this.model.findByIdAndUpdate(id, baby, function(err, result) {
        cb(err, result);
    });
}

// read single data by ObjectID
Ctrler.prototype.read = function(id, cb) {
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        this.model.findById(id).exec(function(err, body) {
            cb(err, body);
        });
    }
}

// list all collection
Ctrler.prototype.list = function(cb) {
    this.model.find({}).exec(function(err, body) {
        cb(err, body);
    });
}

// list by page
Ctrler.prototype.page = function(page, limit, params, cb) {
    var self = this,
        from = (page && page > 1) ? ((page - 1) * limit) : 0;
    self.model.count(params).exec(function(err, count) {
        if (!err) {
            self.model.find(params).skip(from).limit(limit).exec(function(err, results) {
                cb(err, results, {
                    limit: limit,
                    current: page ? page : 1,
                    max: Math.round(count / limit)
                });
            });
        } else {
            cb(err);
        }
    });
}

// advanced find
Ctrler.prototype.find = function(params, cb) {
    this.model.find(params).exec(function(err, body) {
        cb(err, body);
    });
}

// advanced findOne
Ctrler.prototype.findOne = function(params, cb) {
    this.model.findOne(params).exec(function(err, body) {
        cb(err, body);
    });
}

// advanced query:
// var demo = user.query('findOne',{name: 'demo'});
// demo.select('sth'); demo.exec(function(err,result){});
Ctrler.prototype.query = function(type, params) {
    return this.model[type](params);
}

module.exports = Ctrler;