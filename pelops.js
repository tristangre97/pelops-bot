const port = 1954

const config = require("./auth.json");
const unitEmbedGen = require('./utility/getUnitData.js');

const fs = require("node:fs");
const path = require("node:path");
const unitData = require("./data/unitData.json");
const battleMemories = require("./data/battleMemories.json");
const commandArgs = process.argv.slice(2);
const updateEmojis = commandArgs[0] === "true" ? true : false;
const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const recursiveRouting = require("recursive-routing");
const app = express()


app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
recursiveRouting(app, {
  rootDir: "./website/src/routes",
  replaceSpacesWith: "_",
});
// app.get('/api', async (req, res) => {
//   const unitName = req.query.unit;
//   const unitData = await unitEmbedGen.getAll(unitName);
//   res.header("Content-Type", "application/json");
//   return res.send(JSON.stringify(unitData, null, 4));
// })

// app.post('/update', async (req, res) => {
//   const newData = req.body;

//   // Read existing data
//   let oldData = {};
//   try {
//     const existingContent = fs.readFileSync('./data/unitData.json', 'utf8');
//     oldData = JSON.parse(existingContent);
//   } catch (error) {
//     console.log('No existing data file found, treating all units as new');
//   }

//   const timestamp = new Date().toISOString();
//   const changes = {
//     added: [],
//     updated: [],
//     unchanged: 0
//   };

//   // Process each unit in the new data
//   for (const unitName in newData) {
//     const newUnit = newData[unitName];
//     const oldUnit = oldData[unitName];

//     if (!oldUnit) {
//       // New unit - add "added" timestamp
//       newUnit.added = timestamp;
//       changes.added.push(unitName);
//     } else {
//       // Existing unit - check if data changed
//       // Create copies without timestamp fields for comparison
//       const oldUnitCopy = { ...oldUnit };
//       const newUnitCopy = { ...newUnit };
//       delete oldUnitCopy.added;
//       delete oldUnitCopy.lastUpdate;
//       delete newUnitCopy.added;
//       delete newUnitCopy.lastUpdate;

//       const hasChanged = JSON.stringify(oldUnitCopy) !== JSON.stringify(newUnitCopy);

//       if (hasChanged) {
//         // Unit was modified - update "lastUpdate" timestamp
//         // Preserve original "added" timestamp if it exists
//         if (oldUnit.added) {
//           newUnit.added = oldUnit.added;
//         }
//         newUnit.lastUpdate = timestamp;
//         changes.updated.push(unitName);
//       } else {
//         // No changes - preserve existing timestamps
//         if (oldUnit.added) {
//           newUnit.added = oldUnit.added;
//         }
//         if (oldUnit.lastUpdate) {
//           newUnit.lastUpdate = oldUnit.lastUpdate;
//         }
//         changes.unchanged++;
//       }
//     }
//     newData[unitName].id = unitName;
//   }

//   // Write updated data
//   fs.writeFileSync('./data/unitData.json', JSON.stringify(newData, null, 2));

//   res.header("Content-Type", "application/json");
//   return res.send(JSON.stringify({
//     status: "success",
//     message: "Data saved successfully!",
//     changes: changes,
//     timestamp: timestamp
//   }, null, 4));
// })

app.listen(port, () => {
  console.log(`Pelops site listening on port ${port}`)
})

// Watch for changes to unitData.json and reload
const unitDataPath = path.join(__dirname, 'data', 'unitData.json');
let fileWatchTimeout;

fs.watch(unitDataPath, (eventType, filename) => {
  if (eventType === 'change') {
    // Debounce file changes to avoid multiple rapid reloads
    clearTimeout(fileWatchTimeout);
    fileWatchTimeout = setTimeout(() => {
      console.log('Unit data file changed, reloading...');
      unitEmbedGen.reloadUnitData();
    }, 100);
  }
});

// Watch for changes to battleMemories.json and reload
const battleMemoriesPath = path.join(__dirname, 'data', 'battleMemories.json');
let battleMemoriesWatchTimeout;

fs.watch(battleMemoriesPath, (eventType, filename) => {
  if (eventType === 'change') {
    // Debounce file changes to avoid multiple rapid reloads
    clearTimeout(battleMemoriesWatchTimeout);
    battleMemoriesWatchTimeout = setTimeout(() => {
      console.log('Battle memories file changed, clearing cache...');
      delete require.cache[require.resolve('./data/battleMemories.json')];
    }, 100);
  }
});
const {

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
    GatewayIntentBits.GuildMessageReactions
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

client.on("clientReady", async () => {
  console.log("Pelops is ready!");

  setBotPresence(client);

  setInterval(() => {
    setBotPresence(client);
  }, 1000 * 60 * 60);

  const unitDataNew = {}
  if (updateEmojis) {
    console.log("Updating emojis...");
    for (unit in unitData) {
      const ud = unitData[unit];
      if (ud.emoji) {
        unitDataNew[ud.name] = ud;
        continue
      }
      let emojiName = ud.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
      const imageLink = ud.image.replace('upload/', 'upload/e_trim/').replace('.png', '.webp');

      let emojiID
      try {
        const emojiData = await client.application.emojis.create({
          attachment: imageLink,
          name: emojiName,
        });
        emojiID = emojiData.id
        console.log(`Created new emoji with name ${emojiName}!`);
      } catch (e) {
        console.log(e);
        emojiID = null
        console.log(`Failed to create emoji for ${ud.name}`);
      }

      unitDataNew[ud.name] = ud;
      unitDataNew[ud.name].emoji = emojiID;

    }
    fs.writeFileSync('./data/unitDataNew.json', JSON.stringify(unitDataNew, null, 2));
  }

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

    const commandData = {
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

function setBotPresence(client) {

  const activitys = [
    {
      type: ActivityType.Playing,
      name: "Godzilla Battle Line",
    },
    {
      type: ActivityType.Watching,
      name: "Sir Melee",
    }
  ]


  const activity = activitys[Math.floor(Math.random() * activitys.length)];

  client.user.setPresence({
    activities: [activity],
    status: "online",
  });

}




// application.emojis.create({ attachment: 'https://i.imgur.com/w3duR07.png', name: 'rip' })
//   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
//   .catch(console.error);

client.login(config.token);
