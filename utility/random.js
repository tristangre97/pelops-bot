const crypto = require("node:crypto");


exports.number = function (min, max) {
    number = crypto.randomInt(min, max);
    return number;
};

exports.bytes = function (length) {
    string = crypto.randomBytes(length).toString("hex");
    return string;
}















// next = exports.number(0, 255);
