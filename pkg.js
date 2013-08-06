var fs = require('fs');

exports.fetch = function(file) {
    return JSON.parse(fs.readFileSync(__dirname + file))
}

exports.set = function(file, obj) {
    if (obj && typeof(obj) == 'object') {
        fs.writeFileSync(__dirname + file, JSON.stringify(obj));
        return obj;
    } else {
        return false;
    }
}