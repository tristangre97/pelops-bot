const db = require('../utility/database.js');
const random = require('../utility/random.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const search = require('../utility/search.js');
const unitEmbedGen = require('../utility/getUnitData.js');
const unitEmbedGenV2 = require('../utility/getUnitDataV2.js');
const unitBoosts = require('../data/unitBoosts.js');
const boostOptions = []
const developer = require('../developer.json');

for (item in unitBoosts) {
    boostOptions.push({
        name: item,
        value: item,
    })
}
module.exports = {
    name: 'unit',
    category: 'Tools',
    description: "Shows the stats and cost of the selected unit",
    slash: "both",
    testOnly: false,
    expectedArgs: '<item> <amount>',
    dm: true,
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
    {
        name: 'star_rank', // Must be lower case
        description: 'The star rank of the unit.',
        required: false,
        type: 10,
    },
    {
        name: 'apply_boost', // Must be lower case
        description: 'Prevent unavailable units from appearing in the deck',
        required: false,
        type: 3,
        choices: [{ name: 'In Water', value: 'In Water' },
        { name: 'Battra', value: 'Battra' },
        { name: 'Jet Jaguar 73', value: 'Jet Jaguar 73' },
        { name: 'Spacegodzilla Crystals', value: 'Spacegodzilla Crystals' },
        { name: 'Below 33% HP', value: 'Below 33% HP' }]
    }
    ],


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {


        //    args = {unit_name, unit_level, star_rank, apply_boost};
        var { unit_name, unit_level, star_rank, apply_boost } = args;

        interactionID = random.id(8);

        // var unit_name = args['unit_name'];
        // var unit_level = args['unit_level'];
        // var star_rank = args['star_rank'] || 1;
        // var apply_boost = args['apply_boost'] || 0;






        if (developer.test === true && developer.testers.includes(interaction.user.id)) {
            data = {
                id: interactionID,
                user: interaction.user.id,
                time: Date.now(),
                guild: interaction.guild.id,
                unit: {
                    name: unit_name,
                    level: unit_level,
                    star_rank: star_rank,
                    apply_boost: apply_boost,
                }
            }

            const unitData = await unitEmbedGenV2.get(data);


            return interaction.reply({
                embeds: [unitData.embed],

            });

        }


        if (apply_boost) apply_boost = apply_boost.replaceAll(" ", "_");










        var embedComponents = [];

        startTime = performance.now();
        var selectedUnit = unit_name;
        var level = Math.abs(unit_level);
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




        unit = searchResults[0].item;
        unitRarity = Number(unit.RARITY);
        const maxLevel = (unitRarity < 4) ? 50 : 40;

        if (level < 1) level = 1
        if (level - 1 > maxLevel) {
            level = maxLevel
        }



        previousEvolution = unit['Unit Name']
        evolutions = unit['EVOLUTION'].split(", ")
        if (evolutions[0] == "") evolutions = []
        // console.log(evolutions)
        unitsName = unit['Unit Name'].replaceAll(" ", "_")
        originalUser = interaction.user.id


        const interactionData = {
            id: interactionID,
            timestamp: Date.now(),
            user: interaction.user.id,
            unit: unit['Unit Name'],
            level: level,
            starRank: star_rank,
            boosts: apply_boost,
            evolutions: evolutions,
        }

        await db.set(`interactions.${interactionID}`, interactionData)


        actionBtns = new ActionRowBuilder();
        actionBtns.addComponents(
            new ButtonBuilder()
                .setCustomId(`levelDownBtn ${interactionID}`)
                .setLabel(`Level ${level - 1}`)
                .setStyle('Primary')
                .setEmoji(`<:downarrow:998267358177153055>`)
                .setDisabled(level == 1)
        )
        actionBtns.addComponents(
            new ButtonBuilder()
                .setCustomId(`levelUpBtn ${interactionID}`)
                .setLabel(`Level ${parseInt(level) + 1}`)
                .setStyle('Primary')
                .setEmoji(`<:uparrow:998267359280250890>`)
                .setDisabled(level == maxLevel)
        )


        for (const evo of evolutions) {
            evoSearch = await search.unitSearch(evo);
            evoUnit = evoSearch[0].item;
            actionBtns.addComponents(
                new ButtonBuilder()
                    .setCustomId(`evolveBtn ${interactionID} ${evo.replaceAll(" ", "_")}`)
                    .setLabel(`${evo}`)
                    .setEmoji(`${evoUnit['EMOJI']}`)
                    .setStyle('Success'),
            );

        }



        embedComponents.push(actionBtns);



        if (interaction.user.id == `222781123875307521`) {
            estimatedTimeMS = unit_level * 0.3;
            if (estimatedTimeMS > 4900) {
                await interaction.reply({
                    content: `To calculate a level ${unit_level} ${unit_name} it will take an estimated **${(estimatedTimeMS / 1000).toFixed(2)}** seconds.
Discord only gives me 5 seconds to respond so I will send you a DM with the results.
`,
                })


                embed = await unitEmbedGen.getUnitEmbed(unit, unit_level, star_rank, apply_boost, true);

                return interaction.user.send({
                    embeds: [embed.embed],
                })

            } else {
                embed = await unitEmbedGen.getUnitEmbed(unit, unit_level, star_rank, apply_boost, true);
            }


        } else {
            embed = await unitEmbedGen.getUnitEmbed(unit, unit_level, star_rank, apply_boost);
        }


        await interaction.reply({
            embeds: [embed.embed],
            components: embedComponents,
        }).then(async msg => {
            const SECONDS_TO_REPLY = 60;
            const MESSAGES_TO_COLLECT = 99
            const filter = (m) => m.author.id == interaction.user.id
            const collector = interaction.channel.createMessageCollector({ filter, time: SECONDS_TO_REPLY * 1000, max: MESSAGES_TO_COLLECT })

            collector.on('collect', async collected => {

                message = collected.content.split(" ")

                if (message[0].toLowerCase() == 'level' || message[0].toLowerCase() == 'l') {
                    level = Number(message[1])
                    if (isNaN(level)) return
                    embed = await unitEmbedGen.getUnitEmbed(unit, level)
                    await interaction.followUp({
                        embeds: [embed.embed]
                    });

                }

            })


        })

    }
}