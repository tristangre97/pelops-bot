// To-do
// Fix spawn unit stats
// Add fuse search as module
// Add unit search cache
// Add leader button (leader stats not finished)





const DiscordJS = require("discord.js");
const WOKCommands = require("wokcommands");
const path = require("path");
const { Intents } = DiscordJS;
const mongoose = require("mongoose");
const config = require("./auth.json");

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});


client.on("ready", () => {
  //cache.setCache("p", p, 60);
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    featuresDir: path.join(__dirname, 'features'),
    testServers: ['682387138763161630'],
    botOwners: ['222781123875307521'],
    debug: true,
    typeScript: false,
    mongoUri: config.mongoUri,
  })
  .setDefaultPrefix("?")
  .setColor('#448AFF')
  .setCategorySettings([
    {
        name: 'Tools',
        emoji: '🔧',
    },
    
  ])
});

client.login(config.token);
