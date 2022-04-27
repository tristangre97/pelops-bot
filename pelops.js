const DiscordJS = require("discord.js");
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
const {
  Handler
} = require('discord-slash-command-handler');


const eventFiles = fs
  .readdirSync("./events/")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


client.on('ready', () => {
  // replace src/commands to the path with your commands folder.
  // if your commands folder contain files then use commandType: "file". otherwise commandType: "folder"
  const handler = new Handler(client, {
    commandFolder: "/commands",
    commandType: "file",
    slashGuilds: ["682387138763161630"],
    allSlash: true,
    owners: ["222781123875307521"],
    handleSlash: true,
    handleNormal: false,
    prefix: ",", // Bot's prefix
    timeout: false, // If you want to add timeouts in commands
    permissionReply: "You don't have enough permissions to use this command",
    timeoutMessage: "You are on a timeout",
    errorReply: "Unable to run this command due to errors",
    notOwnerReply: "Only bot owners can use this command",
  });
  cache.set('unitData', fs.readFileSync('/home/tristan/Downloads/pelops/data/unitData.json', 'utf8'), 0);
  cache.set('mapLogs', fs.readFileSync('/home/tristan/Downloads/pelops/data/mapLogs.json', 'utf8'), 0);
  cache.set("pelops_update_status", "finished", 0);
  console.log("bot is up!");
});

client.login(config.token);