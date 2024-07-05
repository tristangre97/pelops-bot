const cache = require("../utility/cache");

const fs = require("node:fs");
const path = require("node:path");
const commands = new Map();
// /home/tristan/Downloads/pelops/events/buttons
const buttonsPath = path.join(__dirname, "../events/buttons");
const buttonFiles = fs
  .readdirSync(buttonsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of buttonFiles) {
  const filePath = path.join(buttonsPath, file);
  const command = require(filePath);
  commands.set(command.name, command);
}

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (!interaction.isButton()) return;
    const buttonData = interaction.customId.split(" ");
    const interactionType = buttonData[0];
    const interactionID = buttonData[1] || null;
    const command = commands.get(interactionType);
    console.log(interactionType);
    if (!command) {
      await interaction.reply({
        content: `This button is not yet implemented.`,
        ephemeral: true,
      });
      return console.log(`Button ${interactionType} is not yet implemented.`);
    }

    if (command.requiresID && !interactionID) return;

    const interactionInfo = await cache.get(`pelops:interactions:${interactionID}`);

    const originalUser = interactionInfo?.user || null;

    if (command.requiresID) {
      if (!interactionInfo)
        return interaction.reply({
          content: `This interaction has expired, please run the command again.`,
          ephemeral: true,
        });
    }

    if (command.originalUserOnly && interaction.user.id != originalUser) {
      return interaction.reply({
        content: `You are not the original user of this command.`,
        ephemeral: true,
      });
    }

    interactionData = {
      interaction: interaction,
      interactionID: interactionID,
      buttonData: buttonData,
    };

    start = performance.now();

    try {
      await command.run(interactionData);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `Something went wrong. :(\n\`\`\`${error}\`\`\``,
        ephemeral: true,
      });
    }

    end = performance.now();

    console.log(
      `${interaction.user.tag} triggered ${interactionType} button in ${
        end - start
      }ms`
    );

    return;

  },
};
