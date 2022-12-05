const cache = require("./cache.js");
const fetch = require("node-fetch");
const humanizeDuration = require("humanize-duration");

dataFiles = [
  {
    name: "unitData",
    fullName: "Unit Data",
    url: "https://sheetsu.com/apis/v1.0su/bfb7ac95068b",
  },
  {
    name: "mapLogs",
    fullName: "Map Logs",
    url: "https://sheetsu.com/apis/v1.0bu/9acebc3f7c89",
  },
  {
    name: "seasonData",
    fullName: "Season List Data",
    url: "https://sheetsu.com/apis/v1.0bu/b5f4fd1de48b",
  },
  {
    name: "leaderData",
    fullName: "Unit Leader Data",
    url: "https://sheetsu.com/apis/v1.0su/9c52e24e16f7",
  },
  {
    name: "starRankRewards",
    fullName: "Star Rank Rewards",
    url: "https://sheetsu.com/apis/v1.0bu/6069e15a0d0e",
  }
]

// turn dataFiles into a map
var dataMap = new Map();
dataFiles.forEach((data) => {
  dataMap.set(data.name, data);
});

console.log(dataMap);

exports.update = function (name) {

  

};