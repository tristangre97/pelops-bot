const crypto = require("node:crypto");

const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const userDecks = require('../utility/getUserDeck');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
// {
//     type: 1,
//     name: "test",
//     description: "Get a prefilled deck",

// },
module.exports = {
    name: 'user_deck',
    category: 'Tools',
    description: 'View or create a deck',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,
    options: [
        
        {
            type: 1,
            name: "view",
            description: "View another user's deck",
            options: [
                {
                    name: 'deck_name',
                    description: 'Name of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true,
                },
            ],
        },
        {
            type: 1,
            name: "create",
            description: "Create a deck",
            options: [
                {
                    name: 'leader',
                    description: 'The leader of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
                {
                    name: 'unit_1',
                    description: 'The first unit of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
                {
                    name: 'unit_2',
                    description: 'The second unit of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
                {
                    name: 'unit_3',
                    description: 'The third unit of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
                {
                    name: 'unit_4',
                    description: 'The fourth unit of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
                {
                    name: 'unit_5',
                    description: 'The fifth unit of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
                {
                    name: 'unit_6',
                    description: 'The sixth unit of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
                {
                    name: 'unit_7',
                    description: 'The seventh unit of the deck',
                    required: true,
                    type: 3,
                    autocomplete: true
                },
            ],
        },
    ],

    run: async ({ message, interaction, channel, client, args, guild }) => {

        type = interaction.options.data[0].name



        if (type === 'view') {
            deckID = interaction.options.data[0].options[0].value
            deckData = await db.get(`usersDecks.${deckID}`)
            if (!deckData) return interaction.reply('That deck does not exist')
            const embed = new EmbedBuilder()
            embed.setTitle(`User Deck`)
            embed.setColor('#ffb33c')
            embed.setDescription(`
**Deck Name**: ${deckData.details.name}
**Creator**: ${deckData.user.name}
**Deck ID**: ${deckData.id || deckID}
\`\`\`${deckData.details.description}\`\`\`
Create your own deck with </user_deck create:1023654598470283268>!
            `)

            img = await userDecks.get(deckData)
            embed.setImage(`attachment://${deckID}.png`)
            deckLikes = await db.get(`deckStats.${deckID}.likes`)
            deckDislikes = await db.get(`deckStats.${deckID}.dislikes`)
            btns = new ActionRowBuilder();
            btns.addComponents(
                new ButtonBuilder()
                    .setCustomId(`deckLike ${deckID}`)
                    .setLabel(`${deckLikes || 0}`)
                    .setEmoji('👍')
                    .setStyle('Primary')
            )
            btns.addComponents(
                new ButtonBuilder()
                    .setCustomId(`deckDislike ${deckID}`)
                    .setLabel(`${deckDislikes || 0}`)
                    .setEmoji('👎')
                    .setStyle('Danger')
            )
            return interaction.reply({
                embeds: [embed],
                components: [btns],
                files: [{
                    attachment: img,
                    name: `${deckID}.png`
                }]
            });
        }

        if (type === 'create' || type === 'test') {
            sentComponents = []
            sentEmbed = []
            // var interactionID = crypto.randomBytes(8).toString("hex");
            var interactionID = makeid(6)

            const embed = new EmbedBuilder()

            if (type === 'create') {
                leader = interaction.options.data[0].options[0].value
                unit_1 = interaction.options.data[0].options[1].value
                unit_2 = interaction.options.data[0].options[2].value
                unit_3 = interaction.options.data[0].options[3].value
                unit_4 = interaction.options.data[0].options[4].value
                unit_5 = interaction.options.data[0].options[5].value
                unit_6 = interaction.options.data[0].options[6].value
                unit_7 = interaction.options.data[0].options[7].value
            } else {

                leader = 'Battra Imago'
                unit_1 = 'Air Base'
                unit_2 = 'Anguirus'
                unit_3 = 'B-2 Bomber'
                unit_4 = 'Burning Godzilla'
                unit_5 = 'Desghidorah'
                unit_6 = 'Destoroyah Larva'
                unit_7 = 'Biollante Plant Beast'
            }

            unitArray = [leader, unit_1, unit_2, unit_3, unit_4, unit_5, unit_6, unit_7]

            // Check if any of the units are duplicates
            for (let i = 0; i < unitArray.length; i++) {
                for (let j = i + 1; j < unitArray.length; j++) {
                    if (unitArray[i] === unitArray[j]) {
                        return interaction.reply({
                            content: `You can't have duplicate units in your deck!`,
                            ephemeral: true
                        })
                    }
                }
            }


            embed.setTitle('User Deck Creator')
            embed.setDescription(`
**Name**:
**Description**:
${unitArray.join('\n')}
`)

            sentEmbed.push(embed)
            btns = new ActionRowBuilder();
            btns.addComponents(
                new ButtonBuilder()
                    .setCustomId(`setUserDeckDetails ${interactionID}`)
                    .setLabel(`Set Deck Details`)
                    .setStyle('Primary')
            )


            deckData = {
                id: interactionID,
                user: {
                    id: interaction.user.id,
                    name: interaction.user.username,
                },
                creationDate: Date.now(),
                units: unitArray,
                details: {
                    name: '',
                    description: '',
                }
            }
            btns.addComponents(
                new ButtonBuilder()
                    .setCustomId(`submitUserDeck ${interactionID}`)
                    .setLabel(`Save Deck`)
                    .setStyle('Primary')
                    .setDisabled(deckData.details.name == '')
            )



            sentComponents.push(btns)


            cache.set(`userDeckCreator_${interactionID}`, deckData)
            await interaction.reply({
                embeds: sentEmbed,
                components: sentComponents,
            });
        }





    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
