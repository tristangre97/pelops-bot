const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const search = require('../utility/search.js');

module.exports = {
    name: 'tier_list',
    category: 'Tools',
    description: 'Get the current tier list or the tier list for a specific unit',
    slash: "both",
    testOnly: false,
    options: [{
            name: 'unit_name', // Must be lower case
            description: 'The name of the unit.',
            required: false,
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
        tierList = cache.get('tierList');

        const {
            unit_name
        } = args;
        const embed = new MessageEmbed()
        embed.setColor('#ffb33c')
        embed.setTitle('Season 12 Tier List')


        if (unit_name) {
            searchResults = await search.unitSearch(unit_name);

            if (searchResults.length == 0) {
                const embed = new MessageEmbed()
                    .setColor('#ff6a56')
                    .setTitle('Unit not found')
                    .setDescription(`Unit \`${unit_name}\` not found`)
                    .setFooter(`Check your spelling and try again.`)
                    .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1651506970/gbl/pelops/pelops_error.png')
                return interaction.editReply({
                    embeds: [embed],

                });

            }
            unit = searchResults[0].item;

            unitTier = unit['TIER'];
            embed.setDescription(`${unit['Unit Name']} is **${unitTier}** tier`)
        } else {
            embed.addField(`S Tier`, `${tierList.S.join(", ")}`)
            embed.addField(`A Tier`, `${tierList.A.join(", ")}`)
            embed.addField(`B Tier`, `${tierList.B.join(", ")}`)
            embed.addField(`C Tier`, `${tierList.C.join(", ")}`)
            embed.addField(`D Tier`, `${tierList.D.join(", ")}`)
        }






        row = new MessageActionRow();

        row.addComponents(
            new MessageButton()
            .setLabel(`Explanation`)
            .setStyle('LINK')
            .setURL('https://www.youtube.com/watch?v=ACSaq6P9bNw&t=2s')
        )

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        });
    }
}