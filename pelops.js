const config = require("./auth.json");
const cache = require('./utility/cache.js');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./utility/database.js');
const {
  Intents,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  WebhookClient,
  permissions,
  Client,
  GatewayIntentBits,
  Partials,
  Collection
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}


// Get events
const eventFiles = fs
  .readdirSync("events")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


client.on('ready', async () => {
  await cache.set('unitData', fs.readFileSync('./data/unitData.json', 'utf8'), 0);
  console.log(`Unit data cached`);
  await cache.set('mapLogs', fs.readFileSync('./data/mapLogs.json', 'utf8'), 0);
  console.log(`Map logs cached`);
  await cache.set('seasonData', fs.readFileSync('./data/seasonData.json', 'utf8'), 0);
  console.log(`Season data cached`);
  await cache.set('leaderData', fs.readFileSync('./data/leaderData.json', 'utf8'), 0);
  console.log(`Leader data cached`);
  cache.set("pelops_update_status", "finished", 0);

  console.log("Pelops is ready!");

});




client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    guild = interaction.guild;
    args = {};
    for (const arg of interaction.options.data) {
      args[arg.name] = arg.value || args[arg.name];
    }


    commandData = {
      message: interaction.message,
      interaction: interaction,
      channel: interaction.channel,
      client: client,
      args: args,
      guild: guild,
      member: interaction.member,
    }

    commandStart = performance.now();
    await command.run(commandData);
    commandEnd = performance.now();
    console.log(`Command ${command.name} executed by ${interaction.user.username} in ${interaction.guild.name} in ${commandEnd - commandStart}ms`);
    db.add(`stats.uses`)

  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: `There was an error while executing this command!\n${error}}`,
      embeds: [],
      components: [],
      ephemeral: true
    });
  }

});



client.login(config.token);

