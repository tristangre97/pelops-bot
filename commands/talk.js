const ai = require('../ai/ai');
const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    name: 'talk',
    description: 'Talk to me ',
    run: async ({ message, interaction, channel, client, args, guild }) => {
        const modal = new ModalBuilder()
            .setCustomId(`ai`)
            .setTitle('Talk to Pelops');

        const question = new TextInputBuilder()
            .setCustomId('question')
            .setLabel("What can I help you with?")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Ask me anything...')
            .setMaxLength(1500)


            const firstActionRow = new ActionRowBuilder().addComponents(question);
    
            // Add inputs to the modal
            modal.addComponents(firstActionRow);
    
    
            // Show the modal to the user
            return interaction.showModal(modal);


    }
    
}

