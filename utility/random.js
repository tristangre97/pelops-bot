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
  const numBytes = Math.ceil(length / 2);
  const randomBytes = crypto.randomBytes(numBytes);
  const hexString = randomBytes.toString('hex').slice(0, length);

  const timestamp = Date.now().toString();

  const hash = crypto.createHash('sha256');
  hash.update(hexString + timestamp);
  const hashDigest = hash.digest('hex');

  const result = hashDigest.slice(0, length);

  return result;
}