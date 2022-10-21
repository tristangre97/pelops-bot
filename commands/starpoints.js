const db = require('../utility/database.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

module.exports = {
    name: 'starpoints',
    category: 'Tools',
    description: 'See how many starpoints are required to get to a certain level',
    slash: "both",
    testOnly: false,


    run: async ({ message, interaction, channel, client, args, guild }) => {

        const starpoints =[95, 102, 109, 119, 129, 139, 150, 162, 175, 189, 205,221, 258,279,301,325,351,379, 409, 442, 478, 516, 557, 602,650, 702, 758, 819]
        var level = 2;
        var starpointsTotal = 0;
        
        var starpointsFinal = []
        
        for(data of starpoints) {
            starpointsTotal += data
            starpointsFinal.push(`**Level ${level}**  \`${data}\` <:starpoints:992512783100948592> (${starpointsTotal.toLocaleString()} Total)`)
            level++
        }

        const embed = new EmbedBuilder()
        embed.setTitle('Starpoints')
        embed.setColor('#ffb33c');
        embed.setDescription(starpointsFinal.join('\n'))
        await interaction.reply({
            embeds: [embed]
        });
    }
}

