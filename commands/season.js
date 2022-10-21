const fs = require('node:fs');
const cache = require('../utility/cache.js');
const seasonData = require('../data/seasonData.json');
const db = require('../utility/database.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const search = require('../utility/search.js');

var seasonOptions = []


for(season in seasonData) {

    var data = {
        name: seasonData[season].Name,
        description: seasonData[season].Number,
        value: seasonData[season].Number,
    }
    seasonOptions.push(data)

}


// i = 0;

// while (i < 14) {
//     var data = {
//         name: `${i}`,
//         description: `${i}`,
//         value: `${i}`,
//     }
//     seasonOptions.push(data)
//     i++
// }
module.exports = {
    name: 'season',
    category: 'Tools',
    description: 'Get information about the different seasons of the game',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,
    options: [{
        name: 'season', // Must be lower case
        description: 'Season to get info on',
        required: true,
        type: 3,
        choices: seasonOptions
    },],


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {
        var {season} = args;

        const seasonData = JSON.parse(cache.get('seasonData'))[season];

        embed = new EmbedBuilder()
        embed.setTitle(`Season ${seasonData['Number']} - \`${seasonData['Name']}\``)
        embed.setColor('#ffb33c');


        Object.entries(seasonData).forEach(entry => {
            const [key, value] = entry;
            // console.log(key, value);
            if (value === "N/A" || value === null || value === '' || key === 'Number' || key === 'Name') {
                return
            }
            if (key === 'New Units') {
                var finalArray = []
                unitArray = value.split(', ')
                unitArray.forEach(unit => {
                    var unitData = search.unitSearch(unit)
                    finalArray.push(`${unitData[0].item['EMOJI']}  **${unitData[0].item['Unit Name']}**`)
                })
                embed.setDescription(`__**${key}**__\n${finalArray.join('\n')}`)

            } else if (key === 'All Star Battle Leader') {
                var unitData = search.unitSearch(value)
                embed.addFields({
                    name: `__${key}__`,
                    value: `${unitData[0].item['EMOJI']}  **${unitData[0].item['Unit Name']}**`,
                    inline: false
                })
            } else {
                embed.addFields({
                    name: `__${key}__`,
                    value: `${value}`,
                    inline: false
                })
            }


        });

        return interaction.reply({
            embeds: [embed]
        })

    }
}