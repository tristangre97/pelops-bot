const cache = require("../../utility/cache");
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: "report",
    requiresID: false,
    originalUserOnly: false,
    run: async ({ interaction, interactionID, buttonData }) => {


        const interactionInfo = await cache.get(`pelops:interactions:${interactionID}`);


        const modal = new ModalBuilder()
            .setCustomId(`reportModal ${interactionID}`)
            .setTitle('Report Issue');

        const unit = new TextInputBuilder()
            .setCustomId('unit')
            .setLabel("Which unit is this issue related to?")
            .setStyle(TextInputStyle.Short);
            if(interactionInfo.name) unit.setValue(interactionInfo.name);



        const level = new TextInputBuilder()
            .setCustomId('level')
            .setLabel("Unit Level")
            .setStyle(TextInputStyle.Short);
            if(interactionInfo.level) level.setValue(JSON.stringify(interactionInfo.level));

        const issue = new TextInputBuilder()
            .setCustomId('issue')
            .setLabel("What is the issue?")
            .setStyle(TextInputStyle.Paragraph);


        // const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        const firstActionRow = new ActionRowBuilder().addComponents(unit);
        const secondActionRow = new ActionRowBuilder().addComponents(level);
        const thirdActionRow = new ActionRowBuilder().addComponents(issue);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);


        // Show the modal to the user
        await interaction.showModal(modal);

    },
};
