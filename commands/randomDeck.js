const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const randomDeck = require('../utility/randomDeck.js');
const developer = require('../developer.json');


module.exports = {
    name: 'random_deck',
    category: 'Tools',
    description: 'Get a random deck',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,
    options: [
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
        },
        {
            name: 'amount',
            description: 'Amount of decks to get - 10 Max',
            required: false,
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
        var extraMsg = []
        var { disable_unavailable_units, preferred_leader, amount } = args;
        if (!disable_unavailable_units) disable_unavailable_units = 'False';
        if (preferred_leader) extraMsg.push(`Preferred Leader: ${preferred_leader}`);

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



        // Mess with TS Dragun by giving him Battra as a leader for 3 seconds
        if(interaction.user.id === '212101930531553281' || interaction.user.id === '222781123875307521') {
            options = {
                disable_unavailable_units: disable_unavailable_units,
                preferred_leader: 'Battra Imago',
                amount: amount
            }

            var data = await randomDeck.get(options, interaction.user.id)

            await interaction.editReply({
                embeds: [],
                components: data.components,
                content: `😈`,
                files: data.files,
            })
            await delay(3000);
            await interaction.editReply({
                embeds: [],
                components: [],
                content: `Your real deck will generated in a moment.`,
            })
            await delay(2000);
        }

        options = {
            disable_unavailable_units: disable_unavailable_units,
            preferred_leader: preferred_leader,
            amount: amount
        }


        var data = await randomDeck.get(options, interaction.user.id)

        


        return interaction.editReply({
            embeds: [],
            components: data.components,
            content: data.msg,
            files: data.files,
        })

    }
}



const delay = ms => new Promise(res => setTimeout(res, ms));
