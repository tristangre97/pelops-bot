const { QuickDB } = require("quick.db");
const db = new QuickDB(); 



exports.set = async function (dbName, newValue) {
    await db.set(dbName, newValue)
    return 'db updated';
};



exports.get = async function (dbName) {
    data = await db.get(dbName)
    return data;
};

exports.add = async function (dbName) {
    await db.add(dbName, 1)
    return 'db updated';
};
exports.sub = async function (dbName) {
    await db.subtract(dbName, 1)
    return 'db updated';
};
exports.delete = async function (dbName) {
    await db.delete(dbName)
    return 'db deleted';
};