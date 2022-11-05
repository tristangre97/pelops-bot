const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const si = require('systeminformation');
const convert = require('../utility/convert.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

module.exports = {
    name: 'bot_info',
    category: 'Tools',
    description: 'Get information about the bot and server',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,


    run: async ({ message, interaction, channel, client, args, guild }) => {
        const cacheStats = cache.getCacheStats();
        var botUses = db.get(`stats.uses`)
        const cpu = await si.cpu();
        const gpu = await si.graphics();
        const cpuName = `${cpu.manufacturer} ${cpu.brand}`
        const cpuSpeeds = await si.cpuCurrentSpeed()
        const cpuTemps = await si.cpuTemperature()
        const gpuName = gpu.controllers[0].model;
        const memory = await si.mem()
        const memoryUsageActive = (memory.active / 1024 / 1024 / 1024).toFixed(2)
        const memoryUsageTotal = (memory.total / 1024 / 1024 / 1024).toFixed(2)
        const memoryUsagePercent = `${(memory.active / memory.total * 100).toFixed(2)}%`
        const embed = new EmbedBuilder()
        embed.setColor('#ffb33c')
        embed.setTitle('Bot/Server Info')


        embed.addFields([
            {
                name: '__Stats__ *Since 2/20*',
                value: `
**Servers** \`${client.guilds.cache.size}\`
**Members** \`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`
**Uses** \`${botUses.toLocaleString()}\`
**Uptime** \`${convert.ms(client.uptime)}\`
**Version** \`${require('../package.json').version}\`
`
            },
            {
                name: '__Cache__',
                value: `
**Size** \`${cacheStats.size.toLocaleString()}\` bytes
**Items** \`${cacheStats.keys.length}\`
`
            },
            {
                name: '__Server Info__',
                value: `
**CPU** \`${cpuName}\`
**CPU Speed** \`${cpuSpeeds.avg} GHz/${cpuSpeeds.max} GHz\`
**CPU Temp** \`${cpuTemps.main}°C\`
**RAM** \`${memoryUsageActive} GB/${memoryUsageTotal} GB\` \`${memoryUsagePercent}\`
**GPU** \`${gpuName}\`
`
            },
            {
                name: '__Developer__',
                value: `<@222781123875307521>`,
                inline: false
            }
        ])

        embed.setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1667588389/gbl/pelops/pelops_reading.png')
        await interaction.reply({
            embeds: [embed]
        });
    }
}

