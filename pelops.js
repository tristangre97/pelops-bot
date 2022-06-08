const DiscordJS = require("discord.js");
const path = require("path");
const {
  Intents
} = DiscordJS;
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');
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
  .readdirSync("./events")
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
    handleSlash: 'both',
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
  cache.set('seasonData', fs.readFileSync('/home/tristan/Downloads/pelops/data/seasonData.json', 'utf8'), 0);
  cache.set("pelops_update_status", "finished", 0);
  updateUnitNameList()
  console.log("bot is up!");





  handler.on('slashCommand', async (command, command_data) => {

    if (command.adminOnly === true) {
      if (!command_data.member.permissions.has("ADMINISTRATOR")) {
        command_data.message.editReply("You must be an admin to use this command!");
        return
      }
    }

    var updateStatus = await cache.get("pelops_update_status");
        if (updateStatus != "finished") {
          var updateStart = cache.get("pelops_update_start")
          const embed = new MessageEmbed()
                .setColor('#ffb33c')
                .setTitle('Currently updating')
                .setDescription(`I am currently updating all of my data. Please try again in a few seconds.
Started update ${Date.now() - updateStart}ms ago
                `)
                .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646260264/gbl/pelops/pelops_wait.png')
          return command_data.message.editReply({
            embeds:[embed]
          });
        }

    try {
      start = performance.now();
      await command.run(command_data);
      end = performance.now();
      var date = new Date(Date.now());
      console.log(`${command_data.user.username} used ${command.name} in ${command_data.guild.name} (${date.toLocaleString()}) - Took ${end - start}ms`);

    } catch (e) {
      console.error(e);
      errorMessageEmbed = new MessageEmbed()
      errorMessageEmbed.setColor('#ba1b1b');
      errorMessageEmbed.setTitle(`Error`);
      errorMessageEmbed.setDescription(`An error occured while running the command: \`${command.name}\`\n\n**Error Message**: \`${e.message}\``);
       row = new MessageActionRow();
      // originalUser = interaction.user.id;
      row.addComponents(
        new MessageButton()
        .setLabel(`Support Server`)
        .setStyle('LINK')
        .setURL(`https://dsc.gg/tristangames`)
      )

      command_data.message.editReply({
        embeds: [errorMessageEmbed],
        components: [row]
      });

    }
  })






});

client.login(config.token);


function updateUnitNameList() {
  unitNames = []
  unitData = JSON.parse(fs.readFileSync(`/home/tristan/Downloads/pelops/data/unitData.json`, 'utf8'));
  unitData.forEach(unit => {
      var data = {
          name: unit['Unit Name'],
          aliases: unit['ALIASES'],
      }
      unitNames.push(data)
  })
  // console.log(unitNames)
  cache.set("unitNames", unitNames, 0);
}

