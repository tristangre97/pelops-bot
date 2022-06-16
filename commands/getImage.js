const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const search = require('../utility/search.js');
const unitEmbedGen = require('../utility/getUnitData.js');

module.exports = {
    name: 'get_image',
    category: 'Tools',
    description: "Shows the selected unit's image",
    slash: "both",
    testOnly: false,
    options: [{
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

        var {
            unit_name,
        } = args;
        
        

        var [unit_name] = args;

        
        startTime = performance.now();

        var selectedUnit = unit_name;
        searchResults = await search.unitSearch(selectedUnit);

        if (searchResults.length == 0) {
            const embed = new MessageEmbed()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_name}\` not found`)
                .setFooter(`Check your spelling and try again.`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/pelops/pelops_error.png')
                return interaction.editReply({
                embeds: [embed],

            });
            
        }

        unit = searchResults[0].item;
        unitImage = `https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/${unit['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}`
        fileName = `${unit['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png`;
        db.add(`stats.uses`)
        const embed = new MessageEmbed()
        embed.setColor('#ffb33c')
        embed.setDescription(`\`\`\`${unitImage}\`\`\``)
        embed.setTitle(`${unit['Unit Name']}`)
        embed.setImage(`attachment://${fileName}`)

        // actionBtns = new MessageActionRow();

        // actionBtns.addComponents(
        //     new MessageButton()
        //     .setLabel(`Download`)
        //     .setStyle('LINK')
        //     .setURL(`https://arkbuddy.app/download?file=`)
        // )



        await interaction.editReply({
            embeds: [embed],
            files: [{
                attachment: unitImage,
                name: `${fileName}`
            }],
            // components: [linkBtn]
        })

    }
}