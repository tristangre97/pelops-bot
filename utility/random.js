const crypto = require("node:crypto");


exports.number = function (min, max) {
    number = crypto.randomInt(min, max);
    return number;
};

exports.bytes = function (length) {
    string = crypto.randomBytes(length).toString("hex");
    return string;
}


exports.id = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

