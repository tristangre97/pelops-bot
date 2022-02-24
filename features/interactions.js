const unitEmbedGen = require('../utility/getUnitData.js');
const search = require('../utility/search.js');
const cache = require('../utility/cache.js');

const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');

module.exports = (client, instance) => {
  client.on('interactionCreate', async button => {
    if (button.type != 'MESSAGE_COMPONENT') return;




    const data = button.customId.split(' ');

    var unitName = data[1].replaceAll(" ", "_");
    var level = data[2];
    var originalUser = data[3] || '222781123875307521';
    if (originalUser != button.user.id) {
      const errorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error')
        .setDescription('You have to run the command yourself to use the buttons.')
        .setImage('https://res.cloudinary.com/tristangregory/image/upload/h_175/v1644991341/gbl/pelops/pelops_angry.png')
      return button.reply({
        embeds: [errorEmbed],
        ephemeral: true
      })
    }

    searchResults = await search.unitSearch(unitName);
    unit = searchResults[0].item;
    unitRarity = unit.RARITY;
    if (unitRarity == "4") {
      maxLevel = 30;
    } else {
      maxLevel = 40;
    }


    row = new MessageActionRow();
    unitsName = unit['Unit Name'].replaceAll(" ", "_")

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


    unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level)

    if (button.customId.includes('level')) {

      if (unit['EVOLUTION'] != 0) {
        previousEvolution = unit['EVOLUTION']
        row.addComponents(
          new MessageButton()
          .setCustomId(`evolveBtn ${previousEvolution.replaceAll(" ", "_")} ${level} ${originalUser}`)
          .setLabel(`${previousEvolution}`)
          .setStyle('SECONDARY'),
        )
      }

      button.update({
        embeds: [unitEmbed],
        components: [row]
      });
    } else {


      previousEvolution = unit['EVOLUTION']

      row.addComponents(
        new MessageButton()
        .setCustomId(`evolveBtn ${previousEvolution.replaceAll(" ", "_")} ${level} ${originalUser}`)
        .setLabel(`${previousEvolution}`)
        .setStyle('SECONDARY'),
      )


      button.update({
        embeds: [unitEmbed],
        components: [row]
      });

    }

  })
}

module.exports.config = {

  displayName: 'Button',

  // The name the database will use to set if it is enabled or not.
  // This should NEVER be changed once set, and users cannot see it.
  dbName: 'ButtonClicked',
}