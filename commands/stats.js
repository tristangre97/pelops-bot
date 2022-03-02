const search = require('../utility/search.js');

const { MessageEmbed } = require('discord.js');
const Fuse = require("fuse.js");
module.exports = {
  category: "Tools",
  description: "Shows the base stats of the selected unit", // Required for slash commands

  slash: true, // Create both a slash and legacy command
  testOnly: false, // Only register a slash command for the testing guilds
  expectedArgs: '<unit>',
  options: [
      {
        name: 'unit_name', // Must be lower case
        description: 'The name of the unit.',
        required: true,
        type: 3, 
      },
    ],
  minArgs: 1,
  maxArgs: 1,
  callback: async ({ message, interaction, channel, client, args }) => {
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

      const unitEmbed = new MessageEmbed();
      unitEmbed.setTitle(`Base Stats for ${unit['Unit Name']}`)
      unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/e_sharpen,h_300,w_300,c_fit,c_pad,b_rgb:ffb33c/v1646168069/gbl/${unit['Unit Name'].replaceAll(" ","_")}.webp`)
      unitEmbed.setColor('#ffb33c');

      Object.keys(unit).forEach(key => {
    
        if(unit[key]==0 || unit[key]=='FALSE') {
          
        } else {
          unitEmbed.addField(`${key}`, `${unit[key]}`);

        }
        
    });

    return unitEmbed



  },
};

