const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const { unit } = require('mathjs');
const mapDrop = require('../utility/mapDrop');




module.exports = {
    name: 'expedition_simulator',
    category: 'Tools',
    description: 'Simulate opening expedition map without spending any G-Stones',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,
    options: [
        {
            name: 'map_type',
            description: 'Choose the type of map you want to simulate',
            required: true,
            type: 3,
            choices: [{
                name: 'Normal',
                value: 'Normal',
            },
            {
                name: 'Rare',
                value: 'Rare',
            },
            {
                name: 'Mysterious',
                value: 'Mysterious',
            },
            {
                name: 'Legendary',
                value: 'Legendary',
            },
            {
                name: 'Magonote Island',
                value: 'Magonote Island',
            },
            ]
        },
    ],

    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {
        
        var { map_type } = args;
        
        data = mapDrop.mapDrop(map_type)

        const embed = new EmbedBuilder()
        embed.setColor('#ffb33c')
        embed.setTitle(`Expedition Simulator - ${map_type}`)
        embed.setDescription(`${data.units.join('\n')}`)
        embed.addFields({
            name: 'Drop Rates',
            value: `1 Star ${data.dropData.dropRates['1']}%\n2 Star ${data.dropData.dropRates['2']}%\n3 Star ${data.dropData.dropRates['3']}%\n4 Star ${data.dropData.dropRates['4']}%`,
        })

        return interaction.reply({
            embeds: [embed],
        });


    }
}



const delay = ms => new Promise(res => setTimeout(res, ms));
