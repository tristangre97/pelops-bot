const crypto = require("crypto");
const cache = require("../utility/cache.js");
const db = require('../utility/database.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Modal
} = require('discord.js');

module.exports = {
    name: 'create_news',
    category: 'Tools',
    description: 'Create a news article',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,
    options: [{
        name: "image",
        description: "Upload an image",
        required: false,
        type: 11,
    },
    ],
    run: async ({ message, interaction, channel, client, args, guild }) => {

        const image = interaction.options.get('image') ? interaction.options.get('image').attachment.attachment : null;


        db.add(`stats.uses`)
        const embed = new EmbedBuilder()
        embed.setTitle("Create a news article")
        embed.setDescription(`This command is in beta
Images cannot be uploaded yet, you must have a link to an image

Click the \`Set News Details\` button to begin
`)

        var interactionID = crypto.randomBytes(8).toString("hex");

        btns = new ActionRowBuilder();
        btns.addComponents(
            new ButtonBuilder()
                .setCustomId(`setNewsDetails ${interactionID}`)
                .setLabel(`Set News Details`)
                .setStyle('Primary')
        )

        details = {
            id: interactionID,
            user: interaction.user.id,
            type: 'news',
            image: image
        }

        db.set(`interactions.${interactionID}`, details)
        
        await interaction.reply({
            content: `Created interaction ${interactionID}`,
            embeds: [embed],
            components: [btns]
        });
    }
}

