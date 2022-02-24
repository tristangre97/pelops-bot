const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
    category: 'Tools',
    description: 'Get basic bot info', // Required for slash commands

    slash: 'both', // Create both a slash and legacy command
    testOnly: false, // Only register a slash command for the testing guilds

    callback: async ({
        message,
        interaction,
        channel,
        client
    }) => {
        const cacheStats = cache.getCacheStats();
        const embed = new MessageEmbed()
            .setColor('#ff6a56')
            .setTitle('Bot Info')
            .addField('__Cache__', `
**Size** \`${cacheStats.size.toLocaleString()}\` bytes
**Items** \`${cacheStats.keys.length}\` 
`)
            .addField(`__Stats__ *Since 2/20*`, `
**Servers** \`${client.guilds.cache.size}\`
**Members** \`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`
**Uses** \`${db.get(`pelops_uses`)}\`
**Uptime** \`${prettyMilliseconds(client.uptime)}\`
**Version** \`${require('../package.json').version}\`
        `)
            .addField('__Developer__', `Tristangre97#2936`)
            .addField('__Links__', `[Donate](https://paypal.me/TristanGregory?country.x=US&locale.x=en_US) | [Invite](https://dsc.gg/pelops)`)
            .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1645067870/gbl/pelops/pelops_reading.png')
        return embed
    },
}

