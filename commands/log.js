const search = require('../utility/search.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
  category: "Tools",
  description: "Shows the possible units you can recieve from an expedition log", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  testOnly: false, // Only register a slash command for the testing guilds
  expectedArgs: '<log text>',
  options: [
    {
      name: 'expedition_log', // Must be lower case
      description: 'Part of the expedition log text.',
      required: true,
      type: 3,
    },
  ],
  minArgs: 1,
  maxArgs: 1,
  callback: async ({ message, interaction, channel, client, args }) => {
    var startTime = performance.now();
    // console.log(message, interaction, channel, client, args);
    var [expedition_log] = args;
    
// console.log(expedition_log)
    searchResults = await search.logSearch(expedition_log);
    if (!searchResults[0]) {
      const embed = new MessageEmbed()
          .setColor('#ff6a56')
          .setTitle('Expedition log not found')
          .setDescription(`Log \`${expedition_log}\` not found`)
          .setFooter(`Check your spelling and try again.`)
          .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1645067926/gbl/pelops/pelops_error.png')
      return embed
  }
    // console.log(unit);
    results = searchResults[0].item;
    // console.log(results)
  var finishTime = performance.now();
  var time = finishTime - startTime;
    const unitEmbed = new MessageEmbed();
    unitEmbed.setTitle(`Expedition Log`);
    unitEmbed.setColor('#ffb33c');
    unitEmbed.setDescription(`\`${results.Log}\``);
    unitEmbed.addField('Possible Units', `${results.Units.replaceAll(', ', '\n')}`);
    unitEmbed.setFooter(`The more of the log added the better the search results - Found in ${time}ms`);
    return unitEmbed



  },
  error: ({ error, command, message, info }) => {
    const embed = new MessageEmbed()
    .setColor('#ff6a56')
    .setTitle('Error')
    .setDescription(`Error - \`${error}\`\n\`Command\` - \`${command}\`\n\`Message\` - \`${message}\`\n\`Info\` - \`${info}\``)
    .setThumbnail('https://www.tristan.games/e/image/img/error.png')
return embed

  },
};
