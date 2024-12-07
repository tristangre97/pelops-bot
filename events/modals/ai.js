const ai = require('../../ai/ai');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ai",
    requiresID: false,
    originalUserOnly: false,
    run: async ({ interaction, interactionID, buttonData }) => {

        const message = interaction.fields.getTextInputValue('question');
        // https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg
        const reply = await interaction.reply({
            content: `Thinking...`,
            files: [
                `https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg`
            ],
        });

        const test = await ai.run({
            message: message,
        })

        const embed = new EmbedBuilder()
            .setTitle('AI')
            .setDescription(test)
            .setColor('#ffb33c')
            .addFields(
                {
                    name: 'Question',
                    value: `\`\`\`${message}\`\`\``,
                }
            )

        return reply.edit({
            content: '',
            embeds: [embed],
            files: [],
        });

    },
};
