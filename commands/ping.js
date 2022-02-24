const Discord = require('discord.js')


module.exports = {
    category: 'Tools',
    description: 'Replies with pong', // Required for slash commands
    
    slash: 'both', // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds
    
    callback: async ({ message, interaction, channel, client }) => {
      return `Pong! Latency is ${Math.round(client.ws.ping)}ms.`
 
    },
  }