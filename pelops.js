// To-do
// Fix spawn unit stats
// Add fuse search as module
// Add unit search cache
// Add leader button (leader stats not finished)





const DiscordJS = require("discord.js");
const WOKCommands = require("wokcommands");
const path = require("path");
const {
  Intents
} = DiscordJS;
const mongoose = require("mongoose");
const config = require("./auth.json");
const cache = require('./utility/cache.js');
const fs = require("fs");
const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});


client.on("ready", () => {
  
  new WOKCommands(client, {
      commandsDir: path.join(__dirname, "commands"),
      featuresDir: path.join(__dirname, 'features'),
      testServers: ['682387138763161630'],
      botOwners: ['222781123875307521', '216368047110225920', '521823544724684851'],
      debug: true,
      typeScript: false,
      mongoUri: config.mongoUri,
    })
    .setDefaultPrefix("?")
    .setColor('#448AFF')
    .setCategorySettings([{
        name: 'Tools',
        emoji: '🔧',
      },

    ])
  cache.set('unitData', fs.readFileSync('/home/tristan/Downloads/pelops/data/unitData.json', 'utf8'), 0);
  cache.set('mapLogs', fs.readFileSync('/home/tristan/Downloads/pelops/data/mapLogs.json', 'utf8'), 0);
  cache.set("pelops_update_status", "finished", 0);
});

client.login(config.token);