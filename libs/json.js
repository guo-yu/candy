var fs = require('fs');

exports.fetch = function(file) {
    try {
        return JSON.parse(fs.readFileSync(file))
    } catch (err) {
        throw err;
    }
}

exports.save = function(file, obj) {
    if (obj && typeof(obj) == 'object') {
        try {
            fs.writeFileSync(file, JSON.stringify(obj));
            return obj;
        } catch (err) {
            throw err;
        }
    } else {
        return false;
    }
}