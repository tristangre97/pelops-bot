const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const random = require('../utility/random.js')

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
            name: 'disable_unavailable_units', // Must be lower case
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
            name: 'preferred_leader', // Must be lower case
            description: 'Set your preferred leader',
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
        var { disable_unavailable_units, preferred_leader } = args;
        if (!disable_unavailable_units) disable_unavailable_units = 'False';
        db.add(`stats.uses`)


        const waitEmbed = new EmbedBuilder()
            .setColor('#ffb33c')
            .setTitle('Generating Deck...')
            .setDescription(`I am generating a random deck for you. This may take a second.`)
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1664223401/gbl/pelops/random.gif')

        await interaction.reply({
            embeds: [waitEmbed],
        });

        interactionID = random.id(10)

        options = {
            disable_unavailable_units: disable_unavailable_units,
            preferredLeader: preferred_leader,
        }

        randomDeckData = await randomDeck.get(options)

        const embed = new EmbedBuilder()
        embed.setColor('#ffb33c')
        embed.setImage(`attachment://${interactionID}.png`)


        actionBtns = new ActionRowBuilder();
        actionBtns.addComponents(
            new ButtonBuilder()
                .setCustomId(`randomDeckBtn`)
                .setLabel(`Get Random Deck`)
                .setStyle('Primary')
        )

        actionBtns.addComponents(
            new ButtonBuilder()
                .setCustomId(`randomDeckBtn User`)
                .setLabel(`Get Random User Deck`)
                .setStyle('Success')
        )

        await interaction.editReply({
            content: `<@${interaction.user.id}> 
Made in \`${randomDeckData.totalImgGenTime.toFixed(2)}ms\``,
            embeds: [],
            components: [actionBtns],
            files: [{
                attachment: randomDeckData.image,
                name: `${interactionID}.png`
            }]
        })



    }
}



