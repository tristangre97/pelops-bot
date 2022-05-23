const search = require('../utility/search.js');

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js');


module.exports = {
    name: 'stats',
    description: "Shows the base stats of the selected unit", // Required for slash commands

    slash: true, // Create both a slash and legacy command
    testOnly: false, // Only register a slash command for the testing guilds
    expectedArgs: '<unit>',
    testOnly: false,
    options: [{
        name: 'unit_name', // Must be lower case
        description: 'The name of the unit.',
        required: true,
        type: 3,
        autocomplete: true,
    }, ],

    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {

        var [unit_name] = args;
        var selectedUnit = unit_name;
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
        unitStatsData = []
        aliases = []
        const unitEmbed = new MessageEmbed();
        unitEmbed.setTitle(`Unit Base Stats`)
        unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/e_sharpen,h_300,w_300,c_fit,c_pad,b_rgb:ffb33c/v1651506970/gbl/${unit['Unit Name'].replaceAll(" ","_")}.webp`)
        unitEmbed.setColor('#ffb33c');

        Object.keys(unit).forEach(key => {

            if (unit[key] == 0 || unit[key] == 'FALSE' )  {

            } else {
                unitStatsData.push(`**${toTitleCase(key)}:** \`${unit[key]}\``)
                // unitEmbed.addField(`__${key}__`, `${unit[key]}`);

            }

        });


        unitEmbed.addField(`__Stats__`, `${unitStatsData.join('\n')}`);
        if(aliases.length > 0) {
            console.log(aliases)
            unitEmbed.addField(`__Aliases__`, `${aliases.join('\n')}`);
        }

        await interaction.editReply({
            embeds: [unitEmbed],

        });



    }
}


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}