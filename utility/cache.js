const NodeCache = require("node-cache");
const botCache = new NodeCache();

exports.set = function (cacheName, cacheValue, cacheTime) {
  botCache.set(cacheName, cacheValue, cacheTime);
  return botCache.get(cacheName);
};

exports.get = function (cacheName) {
  return botCache.get(cacheName);
};

exports.getCacheStats = function () {
  var stats = {
    keys: botCache.keys(),
    size: botCache.getStats().vsize
  }
  return stats;
};




botCache.on( "set", function( key, value ){
  console.log(`Set ${key} - Cache is now ${botCache.getStats().vsize} bytes`);
});

botCache.on( "expired", function( key, value ){
  console.log(`${key} expired - Cache is now ${botCache.getStats().vsize} bytes`);
});
botCache.on( "deleted", function( key, value ){
  console.log(`${key} deleted - Cache is now ${botCache.getStats().vsize} bytes`);
});