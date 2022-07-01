const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const search = require('../utility/search.js');

module.exports = {
    name: 'leader_ability',
    category: 'Tools',
    description: "Shows the leader ability of a unit",
    slash: "both",
    testOnly: false,
    expectedArgs: '<item> <amount>',
    options: [{
        name: 'unit_name', // Must be lower case
        description: 'The name of the unit.',
        required: true,
        type: 3,
        autocomplete: true,
    }
    ],


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {

        var {
            unit_name,
        } = args;



        var [unit_name] = args;

        db.add(`stats.uses`)


        leaderData = await search.leaderSearch(unit_name)
        if (leaderData.length == 0) {
            const embed = new MessageEmbed()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_name}\` not found`)
                .setFooter(`Either the unit does not exist or the unit cannot be a leader`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/pelops/pelops_error.png')
                return interaction.editReply({
                embeds: [embed],

            });
            
        }
        db.add(`unitLeaderStats.${leaderData['UNIT']}`)


        entries = []
        Object.keys(leaderData).forEach(key => {
            if (leaderData[key] != '' && key != 'UNIT') {
                entries.push(`**${toTitleCase(key)}** \`${leaderData[key]}\``)
            }

        })

        const unitEmbed = new MessageEmbed();
        unitEmbed.setTitle(`Leader Ability`);
        unitEmbed.setColor('#ffb33c');
        unitEmbed.setDescription(`**Unit** \`${leaderData['UNIT']}\``);
        unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/e_sharpen,h_300,w_300,c_fit,c_pad,b_rgb:ffb33c/v1654043653/gbl/${leaderData['UNIT'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}`)

        unitEmbed.addField(`__Ability Details__`, `
    ${entries.join('\n')}
        `);



        await interaction.editReply({
            embeds: [unitEmbed],
        })

    }
}


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}