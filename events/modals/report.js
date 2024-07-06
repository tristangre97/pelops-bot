const cache = require("../../utility/cache");
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: "reportModal",
    requiresID: false,
    originalUserOnly: false,
    run: async ({ interaction, interactionID, buttonData }) => {

        const unit = interaction.fields.getTextInputValue('unit');
        const level = interaction.fields.getTextInputValue('level');
        const issue = interaction.fields.getTextInputValue('issue');

        // Get user 222781123875307521 

        const user = await interaction.client.users.fetch('222781123875307521');

        // Send the report to the user
        await user.send({
            content: `Report from ${interaction.user.username}#${interaction.user.discriminator}`,
            embeds: [
                {
                    title: 'Report',
                    fields: [
                        {
                            name: 'Unit',
                            value: unit,
                        },
                        {
                            name: 'Level',
                            value: level,
                        },
                        {
                            name: 'Issue',
                            value: issue,
                        },
                    ],
                },
            ],
        });


        return interaction.reply({
            content: 'Reported 👍',
            ephemeral: true,
        });

    },
};
