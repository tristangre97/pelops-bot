const cache = require('../../utility/cache.js');
const db = require('../../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
    name: 'info',
    category: 'Tools',
    description: 'Get basic bot info', // Required for slash commands

    slash: 'both', // Create both a slash and legacy command
    testOnly: false, // Only register a slash command for the testing guilds

    run: async ({
        message,
        interaction,
        channel,
        client
    }) => {
        const cacheStats = cache.getCacheStats();
        var botUses = db.get(`stats.uses`)
        const embed = new MessageEmbed()
            .setColor('#ffb33c')
            .setTitle('Bot Info')
            .addField('__Cache__', `
**Size** \`${cacheStats.size.toLocaleString()}\` bytes
**Items** \`${cacheStats.keys.length}\` 
`)
            .addField(`__Stats__ *Since 2/20*`, `
**Servers** \`${client.guilds.cache.size}\`
**Members** \`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`
**Uses** \`${botUses}\`
**Uptime** \`${prettyMilliseconds(client.uptime)}\`
**Version** \`${require('../../package.json').version}\`
        `)
            .addField('__Developer__', `Tristangre97#2936`)
            .addField('__Links__', `[Donate](https://paypal.me/TristanGregory?country.x=US&locale.x=en_US) | [Invite](https://dsc.gg/pelops)`)
            .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1644991354/gbl/pelops/pelops_reading.png')
        return embed
    },
}

