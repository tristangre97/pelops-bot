const search = require('../utility/search.js');
const unitEmbedGen = require('../utility/getUnitData.js');

const db = require('../utility/database.js');
const cache = require('../utility/cache.js');

const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu
} = require('discord.js');
module.exports = {
  category: "Tools",
  description: "Shows the stats and cost of the selected unit", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  testOnly: false, // Only register a slash command for the testing guilds
  expectedArgs: '<item> <amount>',
  options: [{
      name: 'unit_name', // Must be lower case
      description: 'The name of the unit.',
      required: true,
      type: 3,
      autocomplete: true,
    },
    {
      name: 'unit_level', // Must be lower case
      description: 'The level of the unit.',
      required: true,
      type: 10,
    },
  ],
  minArgs: 2,
  maxArgs: 2,
  callback: async ({
    message,
    interaction,
    channel,
    client,
    args
  }) => {
    var updateStatus = await cache.get("pelops_update_status");
    // console.log(updateStatus);
    var embedComponents = [];
    if(updateStatus != "finished") return 'Please wait for the update to finish.';
    startTime = performance.now();
    await interaction.deferReply();

    var [unit_name, unit_level] = args;
    var selectedUnit = unit_name;
    var level = Math.abs(unit_level);
    searchResults = await search.unitSearch(selectedUnit);
    // console.log(searchResults);
    if (searchResults.length == 0) {
      const embed = new MessageEmbed()
        .setColor('#ff6a56')
        .setTitle('Unit not found')
        .setDescription(`Unit \`${unit_name}\` not found`)
        .setFooter(`Check your spelling and try again.`)
        .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1651506970/gbl/pelops/pelops_error.png')
      reply = await interaction.editReply({
        embeds: [embed],
          
      });
      return
    }

    var maxResults = 15;
    var otherResults = []
    var cutResults = searchResults.slice(0, maxResults);

    cutResults.forEach(result => {
      var data = {
        label: `${result.item['Unit Name']}`,
        value: `${result.item['Unit Name']}`,
      }
      otherResults.push(data);
    });

    
    unit = searchResults[0].item;
    db.add(`unit.${unit['Unit Name']}.uses`)
    unitRarity = Number(unit.RARITY);
    if (unitRarity == "4") {
      maxLevel = 30;
    } else {
      maxLevel = 40;
    }
    if (level < 1) level = 1
    if (level - 1 > maxLevel) {
      level = maxLevel
    }



    previousEvolution = unit['Unit Name']
    evolvedUnit = unit['EVOLUTION']
    unitsName = unit['Unit Name'].replaceAll(" ", "_")
    originalUser = interaction.user.id

    var row3;
    if (otherResults.length > 1) {
      row3 = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
          .setCustomId(`selectMenu ${unitsName} ${parseInt(level) + 1} ${originalUser}`)
          .setPlaceholder(`Select a unit`)
          .addOptions(otherResults),
        );
        embedComponents.push(row3);
    }



    row = new MessageActionRow();
   
    row.addComponents(
      new MessageButton()
      .setCustomId(`levelDownBtn ${unitsName} ${level - 1} ${originalUser}`)
      .setLabel(`Level ${level - 1}`)
      .setStyle('PRIMARY')
      .setDisabled(level == 1)
    )
    row.addComponents(
      new MessageButton()
      .setCustomId(`levelUpBtn ${unitsName} ${parseInt(level) + 1} ${originalUser}`)
      .setLabel(`Level ${parseInt(level) + 1}`)
      .setStyle('PRIMARY')
      .setDisabled(level == maxLevel)
    )
      embedComponents.push(row);

    if (unit['EVOLUTION'] != 0) {

      row.addComponents(
        new MessageButton()
        .setCustomId(`evolveBtn ${evolvedUnit.replaceAll(" ","_")} ${level} ${originalUser}`)
        .setLabel(`${evolvedUnit}`)
        .setStyle('SECONDARY'),
      );
      unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level)
      reply = await interaction.editReply({
        embeds: [unitEmbed],
        components: embedComponents,
      })
    } else {
      unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level)

      endTime = performance.now();
      // console.log(`${unit['Unit Name']} took ${endTime - startTime} milliseconds`)
      reply = await interaction.editReply({
        embeds: [unitEmbed],
        components: embedComponents
      });

    }


  },

};