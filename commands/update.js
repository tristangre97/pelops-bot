const auth = require("../auth.json");
const authorizedUsers = auth.authorizedUsers;
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const cache = require("../utility/cache.js");
const update = require('../utility/update.js');
module.exports = {
    name: 'update',
    category: 'Tools',
    description: 'Updates the data I use',
    slash: "both",
    testOnly: false,


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {

        if (!authorizedUsers.includes(interaction.user.id)) {
            return interaction.reply({
                content: "You are not authorized to use this command.",
                empheral: true
            })
        }

        cache.set("updateStatus", true)
        cache.flush();

        await interaction.reply({
            content: "Updating...",
        })


        updatedFiles = await update.update(interaction);

        cache.set("updateStatus", false)


        await interaction.editReply({
            content: `Updated ${updatedFiles.successFiles.length} in ${updatedFiles.time}ms
Files Updated
${updatedFiles.successFiles.join(", ")}`,
        })

    }
}