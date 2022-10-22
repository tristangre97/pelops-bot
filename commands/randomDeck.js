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
            description: 'Amount of decks to get',
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
        if(preferred_leader) extraMsg.push(`Preferred Leader: ${preferred_leader}`);
        if(amount > 10) amount = 10;
        if(amount < 1) amount = 1;
        if(!amount) amount = 1;

        const waitEmbed = new EmbedBuilder()
            .setColor('#ffb33c')
            .setTitle('Generating Deck...')
            .setDescription(`I am generating a random deck for you. This may take a second.`)
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1664223401/gbl/pelops/random.gif')

        await interaction.reply({
            embeds: [waitEmbed],
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
            console.time('Processing Parallel')
            var t = await Promise.all(arrayOfPromises)
            

            for(item of t) {
                randomDeckImages.push({
                    attachment: item.image,
                    name: `${item.id}.png`
                })
            }

            console.timeEnd('Processing Parallel')
            console.log('Processing Parallel Complete  \n')
            return;
        }



        startImageGen = performance.now();
        await processParallel(arrayOfPromises)
        endImageGen = performance.now();
        totalImgGenTime = endImageGen - startImageGen;



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
Made \`${amount}\` random decks in \`${totalImgGenTime.toFixed(2)}ms\`
${extraMsg}
`,
            embeds: [],
            components: [actionBtns],
            files: randomDeckImages
        })



    }
}



