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


        options = {
            disable_unavailable_units: disable_unavailable_units,
            preferredLeader: preferred_leader,
        }


        const randomDeckImages = new Array();
        const arrayOfPromises = new Array();

        madeDecks = 0;
        while (madeDecks < amount) {
            arrayOfPromises.push(randomDeck.get(options));
            madeDecks++;
        }

        async function processParallel(arrayOfPromises) {
            var t = await Promise.all(arrayOfPromises)
            for (item of t) {
                randomDeckImages.push({
                    attachment: item.image,
                    name: `${item.id}.png`
                })
            }
            return;
        }



        startImageGen = performance.now();
        await processParallel(arrayOfPromises)
        endImageGen = performance.now();
        totalImgGenTime = endImageGen - startImageGen;



        buttons = new ActionRowBuilder();

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId(`randomDeckBtn`)
                .setLabel(`Get Random Deck`)
                .setStyle('Primary')
        )

        if (amount > 1) {
            buttons.addComponents(
                new ButtonBuilder()
                    .setCustomId(`randomDeckMultiBtn ${amount}`)
                    .setLabel(`Get ${amount} Random Decks`)
                    .setStyle('Primary')
            )
        }

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId(`randomDeckBtn User`)
                .setLabel(`Get Random User Deck`)
                .setStyle('Success')
        )


        await interaction.editReply({
            content: `<@${interaction.user.id}> 
Made \`${amount}\` random decks in \`${totalImgGenTime.toFixed(2)}ms\`
${extraMsg}
`,
            embeds: [],
            components: [buttons],
            files: randomDeckImages
        })



    }
}



