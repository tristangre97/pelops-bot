const crypto = require("crypto");
const random = require("../utility/random.js");
const db = require('../utility/database.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Modal
} = require('discord.js');
imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

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

        var image = interaction.options.get('image') 

        if(image) {
            if(!imageTypes.includes(image.attachment.contentType)) return interaction.reply({ content: "Please upload a valid image", ephemeral: true })
            image = image.attachment.attachment
        }

        db.add(`stats.uses`)
        const embed = new EmbedBuilder()
        embed.setTitle("Create a news article")
        embed.setDescription(`
Click the \`Set News Details\` button to begin
`)

        var interactionID = random.id(10);

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

