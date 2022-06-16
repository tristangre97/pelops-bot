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

        var {
            unit_name,
            unit_level
        } = args;
        
        

        var [unit_name, unit_level] = args;

        var embedComponents = [];
        
        startTime = performance.now();

        var selectedUnit = unit_name;
        var level = Math.abs(unit_level.replace(/\D/g, ''));
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
        db.add(`stats.uses`)
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
        evolutions = unit['EVOLUTION'].split(", ")
        if(evolutions[0] == '0') evolutions = []
        // console.log(evolutions)
        unitsName = unit['Unit Name'].replaceAll(" ", "_")
        originalUser = interaction.user.id



        actionBtns = new MessageActionRow();

        actionBtns.addComponents(
            new MessageButton()
            .setCustomId(`levelDownBtn ${unitsName} ${level - 1} ${originalUser}`)
            .setLabel(`Level ${level - 1}`)
            .setStyle('PRIMARY')
            .setEmoji(`<:caretdownsolid:982871764575076383>`)
            .setDisabled(level == 1)
        )
        actionBtns.addComponents(
            new MessageButton()
            .setCustomId(`levelUpBtn ${unitsName} ${parseInt(level) + 1} ${originalUser}`)
            .setLabel(`Level ${parseInt(level) + 1}`)
            .setStyle('PRIMARY')
            .setEmoji(`<:caretupsolid:982871763899789312>`)
            .setDisabled(level == maxLevel)
        )
        

        for(const evo of evolutions) {
            evoSearch = await search.unitSearch(evo);
            evoUnit = evoSearch[0].item;
            actionBtns.addComponents(
                new MessageButton()
                .setCustomId(`evolveBtn ${evo.replaceAll(" ","_")} ${level} ${originalUser}`)
                .setLabel(`${evo}`)
                .setEmoji(`${evoUnit['EMOJI']}`)
                .setStyle('SUCCESS'),
            );

        }



        embedComponents.push(actionBtns);

        embed = await unitEmbedGen.getUnitEmbed(unit, level)

        await interaction.editReply({
            embeds: [embed.embed],
            components: embedComponents,
        }).then(async msg => {
              const SECONDS_TO_REPLY = 15 
            const MESSAGES_TO_COLLECT = 99
            const filter = (m) => m.author.id == interaction.user.id
            const collector = interaction.channel.createMessageCollector({ filter, time: SECONDS_TO_REPLY * 1000, max: MESSAGES_TO_COLLECT })

            collector.on('collect', async collected => {

                message = collected.content.split(" ")
                
                if (message[0].toLowerCase() == 'level' || message[0].toLowerCase() == 'l') {
                    level = Number(message[1])
                    if(isNaN(level)) return 
                    embed = await unitEmbedGen.getUnitEmbed(unit, level)
                    await interaction.followUp({
                        embeds: [embed.embed]
                    });

                }

            })

            
        })

    }
}