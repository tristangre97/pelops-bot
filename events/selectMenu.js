const random = require('../utility/random.js');
const randomDeck = require('../utility/randomDeck');
const unitEmbedGen = require('../utility/getUnitData.js');
const cache = require('../utility/cache.js');
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

        const data = interaction.customId.split('_');
        const id = data[0];
        const extra = data[1];

        if (id === 'randomDeckSelectMenu') {
            const deckAmount = Number(interaction.values[0])
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
                amount: deckAmount,
                deckSize: extra
            }


            var randomDeckData = await randomDeck.get(options, interaction.user.id)


            return interaction.editReply({
                embeds: [],
                components: randomDeckData.components,
                content: randomDeckData.msg,
                files: randomDeckData.files,
            })

        }


        if (id === 'levelSelectMenu') {
            let options = cache.get(`pelops:interactions:${extra}`) || null

            if (!options) return interaction.reply({
                content: 'This interaction has expired. Please try again.',
                ephemeral: true
            })

            if (options.user !== interaction.user.id) return interaction.reply({
                content: 'This interaction is not for you. Please try again.',
                ephemeral: true
            })

            const level = Number(interaction.values[0])
            options.level = level
            if (!options) return interaction.reply({
                content: 'This interaction has expired. Please try again.',
                ephemeral: true
            })

            const unitData = await unitEmbedGen.get(options)
            return interaction.update({
                embeds: [unitData.embed],
                components: unitData.components
            })
        }



    },
};