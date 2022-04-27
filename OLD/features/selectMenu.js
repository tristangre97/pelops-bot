const unitEmbedGen = require('../utility/getUnitData.js');
const search = require('../utility/search.js');
const cache = require('../utility/cache.js');

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = (client, instance) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return;

        // console.log(interaction.customId);
        const data = interaction.customId.split(' ');
        // console.log(data);
        var unitsName = interaction.values[0];
        var level = data[2];
        var originalUser = data[3] || '222781123875307521';
        if (originalUser != interaction.user.id) {
          const errorEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Error')
            .setDescription('You have to run the command yourself to use the buttons.')
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/h_175/v1644991341/gbl/pelops/pelops_angry.png')
          return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true
          })
        }
        
        
        row = new MessageActionRow();
   
        row.addComponents(
          new MessageButton()
          .setCustomId(`levelDownBtn ${unitsName.replaceAll(" ", "_")} ${level - 1} ${originalUser}`)
          .setLabel(`Level ${level - 1}`)
          .setStyle('PRIMARY')
          .setDisabled(level == 1)
        )
        row.addComponents(
          new MessageButton()
          .setCustomId(`levelUpBtn ${unitsName.replaceAll(" ", "_")} ${parseInt(level) + 1} ${originalUser}`)
          .setLabel(`Level ${parseInt(level) + 1}`)
          .setStyle('PRIMARY')
          .setDisabled(level == maxLevel)
        )


        searchResults = await search.unitSearch(unitsName);
        unit = searchResults[0].item;
        unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level)
        interaction.update({
            embeds: [unitEmbed],
            components: [row]
          });
    })
}

module.exports.config = {

    displayName: 'SelectMenu',

    // The name the database will use to set if it is enabled or not.
    // This should NEVER be changed once set, and users cannot see it.
    dbName: 'isSelectMenu',
}