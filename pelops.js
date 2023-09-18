const config = require("./auth.json");
const cache = require("./utility/cache.js");
const fs = require("node:fs");
const path = require("node:path");
const db = require("./utility/database.js");

cache.set(
  "unitData",
  fs.readFileSync("./data/unitData.json", "utf8"),
  0
);
console.log(`Unit data cached`);

cache.set(
  "starRankRewards",
  fs.readFileSync("./data/starRankRewards.json", "utf8"),
  0
);
console.log(`Star rank rewards cached`);

cache.set(
  "boosts",
  fs.readFileSync("./data/boosts.json", "utf8"),
  0
);
console.log(`Boosts cached`);


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
  Collection,
} = require("discord.js");
const { update } = require("./utility/update");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
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

client.on("ready", async () => {
  console.log("Pelops is ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  updateStatus = cache.get("updateStatus") || false;

  if(updateStatus == true) {
    return interaction.reply({
      content: "I am currently updating my data. Please try again later.",
      ephemeral: true,
    })
  }

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
    };

    commandStart = performance.now();
    await command.run(commandData);
    commandEnd = performance.now();
    console.log(
      `Command ${command.name} executed by ${interaction.user.username} in ${interaction.guild.name
      } in ${commandEnd - commandStart}ms`
    );
    db.add(`stats.uses`);
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: `There was an error while executing this command!\n${error}}`,
      embeds: [],
      components: [],
      ephemeral: true,
    });
  }
});


client.login(config.token);
