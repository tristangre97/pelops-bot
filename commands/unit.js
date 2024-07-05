const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const random = require('../utility/random.js');
const cache = require('../utility/cache.js');
const unitEmbedGen = require('../utility/getunitData.js');


module.exports = {
    name: 'unit',
    description: "Shows the stats and cost of the selected unit",
    options: [
        {
            type: 1,
            name: "stats",
            description: "See a unit's stats at a given level",
            options: [{
                name: 'unit_name',
                description: 'The name of the unit.',
                required: true,
                type: 3,
                autocomplete: true,
            },
            {
                name: 'unit_level',
                description: 'The level of the unit.',
                required: true,
                type: 10,
            },
            ],
        },
        {
            type: 1,
            name: "image",
            description: "Show all images of a unit.",
            options: [{
                name: 'unit_name',
                description: 'The name of the unit.',
                required: true,
                type: 3,
                autocomplete: true,
            },
            ],
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

        const type = interaction.options.data[0].name
        const unit = interaction?.options?.data[0]?.options[0]?.value

        if (type == 'image') {
            return interaction.reply(
                {
                    files: [{
                        attachment: `https://res.cloudinary.com/tristangregory/image/upload/e_trim/v1689538433/gbl/${unit.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png`,
                        name: `${unit}.png`
                    }]
                }
            )
        }

        level = interaction?.options?.data[0]?.options[1]?.value
        if(level < 1) level = 1


        const id = random.id(12)

        const options = {
            id: id,
            user: interaction.user.id,
            name: unit,
            level: level,
            star_rank: 1,
            apply_boost: false,
        }
        
        cache.set(`pelops:interactions:${id}`, options, 600)

        unitData = await unitEmbedGen.get(options)

        await interaction.reply(
            {
                embeds: [unitData.embed],
                components: unitData.components
            }
        )

    }
}