const crypto = require("crypto");
const cache = require("../utility/cache.js");
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Modal
} = require('discord.js');

module.exports = {
    name: 'create_news',
    category: 'Tools',
    description: 'Create a news article',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,

    run: async ({ message, interaction, channel, client, args, guild }) => {

        // if(interaction.user.id != '222781123875307521') {
        //     return interaction.reply({
        //         content: `You can't use this command yet`,
        //         ephemeral: true
        //     })

        // }


        db.add(`stats.uses`)
        db.add(`news.uses`)
        const embed = new MessageEmbed()
        embed.setTitle("Create a news article")
        embed.setDescription(`This command is in beta
Images cannot be uploaded yet, you must have a link to an image

Click the \`Set News Details\` button to begin
`)
//         embed.addField(`__Tips__`, `Use **<br>** to make content break into a new line
// Use **&nbsp;** for spaces or to make a 
//         `)

        var interactionID = crypto.randomBytes(8).toString("hex");

        btns = new MessageActionRow();
        btns.addComponents(
            new MessageButton()
            .setCustomId(`setNewsDetails ${interactionID}`)
            .setLabel(`Set News Details`)
            .setStyle('PRIMARY')
        )

        details = {
            id: interactionID,
            user: interaction.user.id,
            type: 'news',
        }

        db.set(`interactions.${interactionID}`, details)


        await interaction.reply({
            embeds: [embed],
            components: [btns]
        });
    }
}

