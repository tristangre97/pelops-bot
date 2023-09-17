const auth = require("../auth.json");
const authorizedUsers = auth.authorizedUsers;

const cache = require("./cache.js");
const convert = require("./convert");
const fetch = require("node-fetch");
const fs = require("node:fs/promises");

const files = [
  {
    name: "unitData",
    fullName: "Unit Data",
    url: "https://sheetsu.com/apis/v1.0su/bfb7ac95068b",
  },
  {
    name: "mapLogs",
    fullName: "Map Logs",
    url: "https://sheetsu.com/apis/v1.0bu/9acebc3f7c89",
    skip: true,
  },
  {
    name: "seasonData",
    fullName: "Season List Data",
    url: "https://sheetsu.com/apis/v1.0bu/b5f4fd1de48b",
    skip: true,
  },
  {
    name: "leaderData",
    fullName: "Unit Leader Data",
    url: "https://sheetsu.com/apis/v1.0su/9c52e24e16f7",
    skip: true,
  },
  {
    name: "starRankRewards",
    fullName: "Star Rank Rewards",
    url: "https://sheetsu.com/apis/v1.0bu/6069e15a0d0e",
  }
]

const updateFiles = files.filter(file => !file.skip);



exports.update = async function (interaction) {


  await interaction.editReply({
    content: `Updating ${updateFiles.length} files...`,
  })

  const successFiles = [];
  const failedFiles = [];
  start = performance.now();
  for (item of updateFiles) {
    try {
      const response = await fetch(item.url);
      const data = await response.json();
      if (!response.status == 200) return;

      await fs.writeFile(`./data/${item.name}.json`, JSON.stringify(data))

      cache.set(item.name, JSON.stringify(data), 0);
      console.log(`Updated ${item.fullName} [${item.name}]`);
      successFiles.push(item.fullName);
      await interaction.editReply({
        content: `Updated ${successFiles.join(",")}`,
      })
    } catch (error) {
      console.log(`Error updating ${item.fullName}`);
      console.log(error);
      failedFiles.push(item.fullName);
    }
  }
  end = performance.now();

  return {
    successFiles,
    failedFiles,
    time: (end - start).toFixed(2),
  }

};