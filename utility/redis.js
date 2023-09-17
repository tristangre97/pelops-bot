const auth = require("../auth.json");

const Redis = require("ioredis");

const redis = new Redis({
  port: 6379,
  host: auth.redisIP,
  username: "default",
  password: auth.redisPassword,
  db: 0,
  enableAutoPipelining: true
});
const pipeline = redis.pipeline();

exports.set = async function (name, data, expiration) {
  await redis.set(name, JSON.stringify(data))
  if (expiration) {
    await redis.expire(name, expiration)
  }
  return 'Setting updated';
};

exports.add = async function (name, data, expiration) {

  current = await redis.incrby(name, data)
  if (expiration) {
    await redis.expire(name, expiration)
  }
  return current;
};

exports.get = async function (name) {
  data = await redis.get(name)
  return JSON.parse(data);
};

exports.getAll = async function (name) {
  name = name + ':*'
  dataMap = new Map();
  list = await redis.keys(name)
  for (i = 0; i < list.length; i++) {
    dataMap.set(list[i].replace(name, ''), await redis.get(list[i]))
  }
  return dataMap;
};

exports.keys = async function (name) {
  data = await redis.keys(name)
  return data
};

exports.getAllOf = async function (name) {
  data = await redis.hgetall(name)
  return data;
};


exports.push = async function (name, data) {
  await redis.lpush(name, data)
  return 'Setting updated';
}

exports.pipelineSet = async function (name, data) {
  await pipeline.set(name, JSON.stringify(data));
  return 'Setting updated';
};

exports.pipelineAdd = async function (name, data) {
  current = await redis.get(name) || 0
  await pipeline.set(name, parseInt(Number(current) + data))
  return 'Setting updated';
};

exports.pipelinePush = async function (name, data) {
  await pipeline.rpush(name, data);
  return 'Setting updated';
};

exports.pipelineExec = async function () {
  await pipeline.exec((err, results) => {
    // console.log(results);
  });

  return 'Setting updated';
};