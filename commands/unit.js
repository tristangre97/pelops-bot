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
    name: 'unit',
    category: 'Tools',
    description: "Shows the stats and cost of the selected unit",
    slash: "both",
    testOnly: false,
    expectedArgs: '<item> <amount>',
    options: [{
            name: 'unit_name', // Must be lower case
            description: 'The name of the unit.',
            required: true,
            type: 3,
            autocomplete: true,
        },
        {
            name: 'unit_level', // Must be lower case
            description: 'The level of the unit.',
            required: true,
            type: 10,
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

        console.log('starting command');
        var {
            unit_name,
            unit_level
        } = args;

        var updateStatus = await cache.get("pelops_update_status");

        var [unit_name, unit_level] = args;

        var embedComponents = [];
        if (updateStatus != "finished") return 'Please wait for the update to finish.';
        startTime = performance.now();

        var selectedUnit = unit_name;
        var level = Math.abs(unit_level);
        searchResults = await search.unitSearch(selectedUnit);

        if (searchResults.length == 0) {
            const embed = new MessageEmbed()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_name}\` not found`)
                .setFooter(`Check your spelling and try again.`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1644991354/gbl/pelops/pelops_error.png')
                return interaction.editReply({
                embeds: [embed],

            });
            
        }




        unit = searchResults[0].item;
        db.add(`unit.${unit['Unit Name']}.uses`)
        unitRarity = Number(unit.RARITY);
        if (unitRarity == "4") {
            maxLevel = 30;
        } else {
            maxLevel = 40;
        }
        if (level < 1) level = 1
        if (level - 1 > maxLevel) {
            level = maxLevel
        }



        previousEvolution = unit['Unit Name']
        evolvedUnit = unit['EVOLUTION']
        unitsName = unit['Unit Name'].replaceAll(" ", "_")
        originalUser = interaction.user.id



        actionBtns = new MessageActionRow();

        actionBtns.addComponents(
            new MessageButton()
            .setCustomId(`levelDownBtn ${unitsName} ${level - 1} ${originalUser}`)
            .setLabel(`Level ${level - 1}`)
            .setStyle('PRIMARY')
            .setDisabled(level == 1)
        )
        actionBtns.addComponents(
            new MessageButton()
            .setCustomId(`levelUpBtn ${unitsName} ${parseInt(level) + 1} ${originalUser}`)
            .setLabel(`Level ${parseInt(level) + 1}`)
            .setStyle('PRIMARY')
            .setDisabled(level == maxLevel)
        )
        

        if (unit['EVOLUTION'] != 0) {
            actionBtns.addComponents(
                new MessageButton()
                .setCustomId(`evolveBtn ${evolvedUnit.replaceAll(" ","_")} ${level} ${originalUser}`)
                .setLabel(`${evolvedUnit}`)
                .setStyle('SECONDARY'),
            );
            // embedComponents.push(evolveBtn);
        }
        embedComponents.push(actionBtns);

        embed = await unitEmbedGen.getUnitEmbed(unit, level)

        reply = await interaction.editReply({
            embeds: [embed],
            components: embedComponents,
        })

    }
}