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


exports.push = async function (name, data, expiration) {
  await redis.lpush(name, data)
  if (expiration) {
    await redis.expire(name, expiration)
  }
  return true
}

exports.lrange = async function (name, start, end) {
  if(!start) start = 0
  if(!end) end = -1
  data = await redis.lrange(name, start, end)
  return data
}

exports.tsAdd = async function (name, time, data, expire) {
  if (!expire) expire = 0
  await redis.call('TS.ADD', name, time, data, 'DUPLICATE_POLICY', 'LAST')
  if (expire > 0) {
    await redis.call('EXPIRE', name, expire);
  }
};

exports.tsRange = async function (name, from, to) {
  try {
    data = await redis.call('TS.RANGE', name, from, to)
    return data
  } catch (error) {
    console.log(error);
    return null
  }
};

exports.del = async function (name) {
  await redis.del(name)
  return 'Setting deleted';
}


exports.jsonSet = async function (name, entry, data, expiration) {
  if(!entry) entry = '$'

  if(!await redis.call('JSON.GET', name)) {
    await redis.call('JSON.SET', name, '$', '{}')
  }

  await redis.call('JSON.SET', name, entry, JSON.stringify(data))
}

exports.jsonGet = async function (name, entry) {
  if(!entry) entry = '$'
  data = await redis.call('JSON.GET', name, entry)
  data = JSON.parse(data)
  return data
}

exports.jsonDel = async function (name, entry) {
  if(!entry) entry = '$'
  await redis.call('JSON.DEL', name, entry)
}

exports.jsonKeys = async function (name, entry) {
  if(!entry) entry = '$'
  data = await redis.call('JSON.OBJKEYS', name, entry)
  return data
}


// redis.monitor((err, monitor) => {
//   monitor.on("monitor", (time, args, source, database) => {
//     console.log(`${time} ${args} ${source} ${database}`);
//   });
// });