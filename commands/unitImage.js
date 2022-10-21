const db = require('../utility/database.js');
const random = require('../utility/random.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const search = require('../utility/search.js');
const unitEmbedGen = require('../utility/getUnitData.js');
const unitBoosts = require('../data/unitBoosts.js');
const boostOptions = []

for (item in unitBoosts) {
    boostOptions.push({
        name: item,
        value: item,
    })
}
module.exports = {
    name: 'unit_image',
    category: 'Tools',
    description: "Shows unit image",
    slash: "both",
    testOnly: false,
    expectedArgs: '<item> <amount>',
    dm: true,
    options: [
        {
            name: 'unit_name', // Must be lower case
            description: 'The name of the unit.',
            required: true,
            type: 3,
            autocomplete: true,
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

        var unit_name = args['unit_name'];

        var selectedUnit = unit_name;
        searchResults = await search.unitSearch(selectedUnit);

        if (searchResults.length == 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_name}\` not found`)
                .setFooter(`Check your spelling and try again.`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/pelops/pelops_error.png')
                return interaction.reply({
                embeds: [embed],

            });
            
        }

        // https://res.cloudinary.com/tristangregory/image/upload/v1664809740/gbl/Godzilla_04.png


        unit = searchResults[0].item;
        unitName = unit['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")
        img = `https://res.cloudinary.com/tristangregory/image/upload/v1664809740/gbl/${unitName}.png`
        await interaction.reply({
            files: [img],
        }).then(async msg => {
             
        })

    }
}