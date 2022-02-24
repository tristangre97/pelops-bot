const db = require("quick.db");



exports.set = function (dbName, newValue) {
    db.set(`pelops.${dbName}`, newValue)
    return 'db updated';
};



exports.get = function (dbName) {
    var value = db.get(`pelops.${dbName}`)
    return value;
};

exports.add = function (dbName,) {
    db.add(`pelops.${dbName}`, 1)
    return 'db updated';
};