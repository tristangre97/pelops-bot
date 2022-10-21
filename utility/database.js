const db = require("quick.db");



exports.set = function (dbName, newValue) {
    db.set(dbName, newValue)
    return 'db updated';
};



exports.get = function (dbName) {
    var value = db.get(dbName)
    return value;
};

exports.add = function (dbName) {
    db.add(dbName, 1)
    return 'db updated';
};
exports.sub = function (dbName) {
    db.subtract(dbName, 1)
    return 'db updated';
};
exports.delete = function (dbName) {
    db.delete(dbName)
    return 'db deleted';
};