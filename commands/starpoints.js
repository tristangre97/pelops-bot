const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    name: 'starpoints',
    category: 'Tools',
    description: 'See how many starpoints are required to get to a certain level',
    slash: "both",
    testOnly: false,


    run: async ({ message, interaction, channel, client, args, guild }) => {

        const starpoints = [95, 102, 109, 119, 129, 139, 150, 162, 175, 189, 205, 221, 258, 279, 301, 325, 351, 379]
        var level = 1;
        var starpointsTotal = 0;
        
        var starpointsFinal = []
        
        for(data of starpoints) {
            starpointsTotal += data
            starpointsFinal.push(`**Level ${level}**  \`${data}\` <:starpoints:992512783100948592> (${starpointsTotal.toLocaleString()} Total)`)
            level++
        }

        const embed = new MessageEmbed()
        embed.setTitle('Starpoints')
        embed.setColor('#ffb33c');
        embed.setDescription(starpointsFinal.join('\n'))
        await interaction.editReply({
            embeds: [embed]
        });
    }
}

// .addField('__Links__', `[Donate](https://paypal.me/TristanGregory?country.x=US&locale.x=en_US) | [Invite](https://dsc.gg/pelops)`)
