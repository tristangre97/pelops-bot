const config = require("./auth.json");
const fs = require("node:fs");
const path = require("node:path");

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
  ActivityType
} = require("discord.js");

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
  client.user.setPresence({
    activities: [
      {
        name: `Godzilla Battle Line`,
        type: ActivityType.Playing,
      },
    ],
    status: "online",
  });
});

client.on("interactionCreate", async (interaction) => {
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
    };

    commandStart = performance.now();
    await command.run(commandData);
    commandEnd = performance.now();
    console.log(
      `Command ${command.name} executed by ${interaction.user.username} in ${interaction.guild.name
      } in ${commandEnd - commandStart}ms`
    );
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
