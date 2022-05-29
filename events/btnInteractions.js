const unitEmbedGen = require('../utility/getUnitData.js');
const search = require('../utility/search.js');
const cache = require('../utility/cache.js');

const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');


module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {

    if (interaction.type != 'MESSAGE_COMPONENT') return;
    if (interaction.isSelectMenu()) return



    const data = interaction.customId.split(' ');
    var unitName = data[1].replaceAll(" ", "_");
    var level = data[2];
    var originalUser = data[3] || '222781123875307521';



    // if (originalUser != interaction.user.id) {
    //   const errorEmbed = new MessageEmbed()
    //     .setColor('#ff0000')
    //     .setTitle('Error')
    //     .setDescription('You have to run the command yourself to use the buttons.')
    //     .setImage('https://res.cloudinary.com/tristangregory/image/upload/h_175/v1644991341/gbl/pelops/pelops_angry.png')
    //   return interaction.reply({
    //     embeds: [errorEmbed],
    //     ephemeral: true
    //   })
    // }

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

    // console.log(unit, level)
    unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level)


    if (unit['EVOLUTION'] != 0) {
      previousEvolution = unit['EVOLUTION']
      row.addComponents(
        new MessageButton()
        .setCustomId(`evolveBtn ${previousEvolution.replaceAll(" ", "_")} ${level} ${originalUser}`)
        .setLabel(`${previousEvolution}`)
        .setStyle('SECONDARY'),
      )
    }

   




      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `Run the command yourself to get more information.`,
          embeds: [unitEmbed.embed],
          ephemeral: true
        })
      }

      interaction.update({
        embeds: [unitEmbed.embed],
        components: [row]
      });





  },
};