const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
    name: 'map_drop_rates',
    category: 'Tools',
    description: 'Get basic bot info',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,


    run: async ({ message, interaction, channel, client, args, guild }) => {
        const embed = new EmbedBuilder()
        .setColor('#ffb33c')
        .setTitle('Map Drop Rates')
       .setDescription(`5% Legendary
17% Mysterious
23% Rare
18% Monster
37% Normal
       `)
        await interaction.reply({
            embeds: [embed]
        });
    }
}

