const search = require('../utility/search.js');

const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu
} = require('discord.js');
const Fuse = require("fuse.js");
module.exports = {
  category: "Tools",
  description: "Shows the base stats of the selected unit", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  testOnly: false, // Only register a slash command for the testing guilds
  expectedArgs: '<unit>',
  options: [{
    name: 'unit_name', // Must be lower case
    description: 'The name of the unit.',
    required: true,
    type: 3,
  }, ],
  minArgs: 1,
  maxArgs: 1,
  callback: async ({
    message,
    interaction,
    channel,
    client,
    args
  }) => {
    var [unit_name] = args;
    var selectedUnit = unit_name;
    await interaction.deferReply();
    searchResults = await search.unitSearch(selectedUnit);
    if (!searchResults[0]) {
      const embed = new MessageEmbed()
        .setColor('#ff6a56')
        .setTitle('Unit not found')
        .setDescription(`Unit \`${unit_name}\` not found`)
        .setFooter(`Check your spelling and try again.`)
        .setThumbnail('https://www.tristan.games/e/image/img/error.png')
      return embed
    }

    unit = searchResults[0].item;

    const unitEmbed = new MessageEmbed();
    unitEmbed.setTitle(`Base Stats for ${unit['Unit Name']}`)
    unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/e_sharpen,h_300,w_300,c_fit,c_pad,b_rgb:ffb33c/v1644991354/gbl/${unit['Unit Name'].replaceAll(" ","_")}.webp`)
    unitEmbed.setColor('#ffb33c');

    Object.keys(unit).forEach(key => {

      if (unit[key] == 0 || unit[key] == 'FALSE') {

      } else {
        unitEmbed.addField(`${key}`, `${unit[key]}`);

      }

    });
    var maxResults = 15;

    var otherResults = []
    t = 1;

    var cutResults = searchResults.slice(1, maxResults);

    cutResults.forEach(result => {
      var data = {
        label: `${result.item['Unit Name']}`,
        value: `${result.item['Unit Name']}`,
      }
      otherResults.push(data);
    });


    var maxLevel = 40;

    i = 0;
    levelOptions = [];
    // while (i < maxLevel) {
    //   var data = {
    //     label: `Level ${i+1}`,
    //     value: `${i+1}`,
    //   }
    //   levelOptions.push(data);
    //   i++
    // }



    var maxSelection = 20;

    var level = 2;
    var maxLevel = 30;

    var levelUp = level;
    var levelDown = level;

    


    var i = 0;
    var selectOptions = [];
    while (i < maxSelection) {
      // console.log(levelUp, levelDown, i)

      if (levelUp < maxLevel) {
        levelUp++
        selectOptions.push(levelUp)
        i++
      }
      if (levelDown > 1) {
        levelDown--
        selectOptions.push(levelDown)
        i++
      }



    }

    var selectOptions = selectOptions.sort((a, b) => a - b);

    selectOptions.forEach(option => {
      var data = {
        label: `Level ${option}`,
        value: `${option}`,
      }
      levelOptions.push(data);
    })

    const levelsRow = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
        .setCustomId('levelsRow')
        .setPlaceholder(`Level ${level}`)
        .addOptions(levelOptions),
      );



    if (otherResults.length > 0) {
      const row3 = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
          .setCustomId('select3')
          .setPlaceholder(`${unit['Unit Name']}`)
          .addOptions(otherResults),
        );

      if (interaction.user.id === '222781123875307521') {
        reply = await interaction.editReply({
          embeds: [unitEmbed],
          components: [levelsRow, row3]
        });
      } else {
        reply = await interaction.editReply({
          embeds: [unitEmbed],

        });
      }

    } else {
      if (interaction.user.id === '222781123875307521') {
        reply = await interaction.editReply({
          embeds: [unitEmbed],
          components: [levelsRow]
        });
      } else {
        reply = await interaction.editReply({
          embeds: [unitEmbed],

        });
      }
    }





  },
};