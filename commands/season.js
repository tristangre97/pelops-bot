const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
var seasonOptions = []

i = 0;

while(i < 14) {
    var data = {
        name: `${i}`,
        description: `${i}`,
        value: `${i}`,
    }
    seasonOptions.push(data)
    i++
}
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
    },
],


    run: async ({ message, interaction, channel, client, args, guild }) => {
        var [season] = args;
        const seasonData = JSON.parse(cache.get('seasonList'))[season];


        embed = new MessageEmbed()
        embed.setTitle(`Season ${season} Details`)
        embed.setColor('#ffb33c');


        Object.entries(seasonData).forEach(entry => {
            const [key, value] = entry;
            // console.log(key, value);
            if(value === "N/A" || value === null || value === '' || key === 'Number') {
                return
            }
            embed.addField(`__${key}__`, `${value}`)
          });

        return interaction.editReply({
            embeds: [embed]
        })

    }
}

