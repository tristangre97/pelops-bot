const random = require('../utility/random.js');
const randomDeck = require('../utility/randomDeck');
const userDecks = require('../utility/getUserDeck');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ModalBuilder,
    TextInputBuilder,
    InteractionType
} = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'randomDeckSelectMenu') {
            deckAmount = Number(interaction.values[0])

            const embed = new EmbedBuilder()
            embed.setColor('#ffb33c')
            embed.setTitle('Generating Deck...')
            embed.setDescription(`I am generating ${deckAmount} random decks for you. This may take a second.`)
            embed.setImage('https://res.cloudinary.com/tristangregory/image/upload/v1664223401/gbl/pelops/random.gif')

            await interaction.reply({
                embeds: [embed],
            });

            options = {
                disable_unavailable_units: null,
                preferred_leader: null,
                amount: deckAmount
            }


            var randomDeckData = await randomDeck.get(options, interaction.user.id)


            return interaction.editReply({
                embeds: [],
                components: randomDeckData.components,
                content: randomDeckData.msg,
                files: randomDeckData.files,
            })

        }



    },
};