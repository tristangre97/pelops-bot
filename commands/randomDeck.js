const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const randomDeck = require('../utility/randomDeck.js');


module.exports = {
    name: 'random_deck',
    category: 'Tools',
    description: 'Get a random deck',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,
    options: [
        {
            name: 'deck_size',
            description: 'How many units in the deck (8-12)',
            required: false,
            type: 4,
            choices: [
                {
                    name: '8',
                    value: 8,
                },
                {
                    name: '9',
                    value: 9,
                },
                {
                    name: '10',
                    value: 10,
                },
                {
                    name: '11',
                    value: 11,
                },
                {
                    name: '12',
                    value: 12,
                }
            ]
        },
        {
            name: 'amount',
            description: 'Amount of decks to get - 10 Max',
            required: false,
            type: 10,
            choices: [
                {
                    name: '1',
                    value: 1,
                },
                {
                    name: '2',
                    value: 2,
                },
                {
                    name: '3',
                    value: 3,
                },
                {
                    name: '4',
                    value: 4,
                },
                {
                    name: '5',
                    value: 5,
                },
                {
                    name: '6',
                    value: 6,
                },
                {
                    name: '7',
                    value: 7,
                },
                {
                    name: '8',
                    value: 8,
                },
                {
                    name: '9',
                    value: 9,
                },
                {
                    name: '10',
                    value: 10,
                }
            ]
        },
        {
            name: 'disable_unavailable_units',
            description: 'Prevent unavailable units from appearing in the deck',
            required: false,
            type: 3,
            choices: [{
                name: 'True',
                value: 'True',
            }
            ]
        },
        {
            name: 'preferred_leader',
            description: 'Set your preferred leader',
            required: false,
            type: 3,
            autocomplete: true,
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
        let { disable_unavailable_units, preferred_leader, amount, deck_size } = args;
        if (!disable_unavailable_units) disable_unavailable_units = 'False';

        amount = Math.min(Math.max(amount || 1, 1), 10);

        const embed = new EmbedBuilder()
        embed.setColor('#ffb33c')
        embed.setTitle('Generating Deck...')
        if (amount > 1) {
            embed.setDescription(`I am generating ${amount} random decks for you. This may take a second.`)
        } else {
            embed.setDescription(`I am generating a random deck for you. This may take a second.`)
        }
        embed.setImage('https://res.cloudinary.com/tristangregory/image/upload/v1664223401/gbl/pelops/random.gif')

        await interaction.reply({
            embeds: [embed],
        });


        const options = {
            disable_unavailable_units: disable_unavailable_units,
            preferred_leader: preferred_leader,
            amount: amount,
            deckSize: deck_size
        }

        const data = await randomDeck.get(options, interaction.user.id)

        return interaction.editReply({
            embeds: [],
            components: data.components,
            content: data.msg,
            files: data.files,
        })

    }
}