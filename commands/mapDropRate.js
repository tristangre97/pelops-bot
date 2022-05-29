const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
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
        const embed = new MessageEmbed()
        .setColor('#ffb33c')
        .setTitle('Map Drop Rates')
       .setDescription(`5% Legendary exp
17% Mysterious
23% Rare
18% Monster
37% Normal
       `)
        await interaction.editReply({
            embeds: [embed]
        });
    }
}

// .addField('__Links__', `[Donate](https://paypal.me/TristanGregory?country.x=US&locale.x=en_US) | [Invite](https://dsc.gg/pelops)`)
