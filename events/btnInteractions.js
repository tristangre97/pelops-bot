const unitEmbedGen = require('../utility/getUnitData.js');
const search = require('../utility/search.js');
const cache = require('../utility/cache.js');
const imgGen = require('../utility/HTML2IMG')
const db = require('../utility/database.js');
const random = require('../utility/random.js');
const randomDeck = require('../utility/randomDeck');

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

    if (interaction.type != InteractionType.MessageComponent || interaction.isStringSelectMenu()) return;




    const data = interaction.customId.split(' ');
    var btnType = data[0];
    var interactionID = data[1];
    var unitEvo = data[2];

    if (btnType == 'kong2') {
      img = `http://localhost:8008/gbl/Kong_2.png`
      return interaction.reply({
        content: `<@${interaction.user.id}> 🍌🐒`,
        files: [img],
        components: []
      })
    }

    if(btnType == 'reportBtn') {
      // Get user by ID 222781123875307521
      interactionData = await db.get(`interactions.${interactionID}`)

      const user = await interaction.client.users.fetch('222781123875307521');
      unitName = interactionData.unit
      await user.send(`${unitName} was reported incorrect by ${interaction.user.username}`)
      return interaction.reply({
        content: `Thank you for reporting ${unitName} as incorrect. The developer has been notified.`,
        ephemeral: true
      })
    }



    if (btnType == 'randomDeckBtn') {
      const embed = new EmbedBuilder()
      embed.setColor('#ffb33c')
      embed.setTitle('Generating Deck...')
      if (!isNaN(data[1])) {
        embed.setDescription(`I am generating ${data[1]} random decks for you. This may take a second.`)
      } else {
        embed.setDescription(`I am generating a random deck for you. This may take a second.`)
      }
      embed.setImage('https://res.cloudinary.com/tristangregory/image/upload/v1664223401/gbl/pelops/random.gif')

      await interaction.reply({
        embeds: [embed],
      });


      options = {
        disable_unavailable_units: null,
        preferred_leader: null,
        amount: data[1] || 1
      }


      var randomDeckData = await randomDeck.get(options, interaction.user.id)


      return interaction.editReply({
        embeds: [],
        components: randomDeckData.components,
        content: randomDeckData.msg,
        files: randomDeckData.files,
      })
    }


    var interactionData = await db.get(`interactions.${interactionID}`) || await db.get(`news.${interactionID}`);
    if (!interactionData) {
      return interaction.reply({
        content: 'Interaction not found.',
        ephemeral: true
      });
    }

    var originalUser = interactionData.user;



    if (btnType == 'generateNews') {
      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `You must run this command yourself to edit `,
          ephemeral: true
        })
      }
      var newsDetails = await db.get(`news.${interactionID}`);

      if (!newsDetails) {
        return interaction.reply({
          content: `This interaction has expired, please run the command again.`,
          ephemeral: true
        })
      }

      const waitEmbed = new EmbedBuilder()
        .setColor('#ffb33c')
        .setTitle('Generating News...')
        .setDescription(`I am generating your news article. This may take a second.`)
        .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')
      db.add(`news.uses`)

      await interaction.update({
        content: `Created interaction ${interactionID}`,
        embeds: [waitEmbed],
        components: [],
      })

      var HTML = newsDetails.HTML;
      img = await imgGen.cluster(HTML, '.cont', 'png')
      return interaction.editReply({
        content: `Created interaction ${interactionID}`,
        embeds: [],
        components: [],
        files: [{
          attachment: img,
          name: `news.png`
        }],
      })
    }


    if (btnType == 'setNewsDetails') {

      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `You must run this command yourself to edit `,
          ephemeral: true
        })
      }
      var newsDetails = await db.get(`interactions.${interactionID}`)

      const modal = new ModalBuilder()
        .setCustomId(`newsModal ${interactionID}`)
        .setTitle('Set News Details')



      const newsTitle = new TextInputBuilder()
        .setCustomId('newsTitle')
        .setLabel("Title")
        .setStyle('Short')


      const imageURL = new TextInputBuilder()
        .setCustomId('imageURL')
        .setLabel("Image URL")
        .setStyle('Short')
      if (newsDetails.image) {
        imageURL.setValue(newsDetails.image)
      }
      // .setRequired(true)


      const newsQuote = new TextInputBuilder()
        .setCustomId('newsQuote')
        .setLabel("Blockquote")
        .setStyle('Short')
      // .setRequired(true)


      const newsArticle = new TextInputBuilder()
        .setCustomId('newsArticle')
        .setLabel("Article")
        .setStyle('Paragraph')
      // .setRequired(true)

      // const firstActionRow = new ActionRowBuilder().addComponents(reportTypeText);
      const secondActionRow = new ActionRowBuilder().addComponents(newsTitle);
      const thirdActionRow = new ActionRowBuilder().addComponents(imageURL);
      const fourthActionRow = new ActionRowBuilder().addComponents(newsQuote);
      const fifthActionRow = new ActionRowBuilder().addComponents(newsArticle);


      modal.addComponents(secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

      return interaction.showModal(modal);
    }

    if (btnType == 'editNewsModal') {

      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `You must run this command yourself to edit `,
          ephemeral: true
        })
      }

      var newsDetails = await db.get(`news.${interactionID}`);

      if (!newsDetails) {
        return interaction.reply({
          content: `This interaction has expired, please run the command again.`,
          ephemeral: true
        })
      }
      var reportTypeTextCache = newsDetails.reportType;
      var newsTitleCache = newsDetails.title;
      var imageURLCache = newsDetails.image;
      var newsQuoteCache = newsDetails.quote;
      var newsArticleCache = newsDetails.article;

      const modal = new ModalBuilder()
        .setCustomId(`newsModal ${interactionID}`)
        .setTitle('Set News Details')


      const newsTitle = new TextInputBuilder()
        .setCustomId('newsTitle')
        .setLabel("Title")
        .setStyle('Short')
        .setValue(newsTitleCache)

      const imageURL = new TextInputBuilder()
        .setCustomId('imageURL')
        .setLabel("Image URL")
        .setStyle('Short')
        .setValue(imageURLCache)


      const newsQuote = new TextInputBuilder()
        .setCustomId('newsQuote')
        .setLabel("Blockquote")
        .setStyle('Short')
        .setValue(newsQuoteCache)


      const newsArticle = new TextInputBuilder()
        .setCustomId('newsArticle')
        .setLabel("Article")
        .setStyle('Paragraph')
        .setValue(newsArticleCache)



      // const firstActionRow = new ActionRowBuilder().addComponents(reportTypeText);
      const secondActionRow = new ActionRowBuilder().addComponents(newsTitle);
      const thirdActionRow = new ActionRowBuilder().addComponents(imageURL);
      const fourthActionRow = new ActionRowBuilder().addComponents(newsQuote);
      const fifthActionRow = new ActionRowBuilder().addComponents(newsArticle);




      modal.addComponents(secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

      return interaction.showModal(modal);


    }


    const unitBtns = ['levelDownBtn', 'levelUpBtn', 'evolveBtn']

    if (unitBtns.includes(btnType)) {

      if (originalUser != interaction.user.id) {
        interactionID = random.bytes(16)
        await db.set(`interactions.${interactionID}`, interactionData)
        await db.set(`interactions.${interactionID}.temp`, true)
        await db.set(`interactions.${interactionID}.newUser`, interaction.user.id)


        interactionData = await db.get(`interactions.${interactionID}`)
      }

      var unitName = interactionData.unit;
      var level = interactionData.level;
      var star_rank = interactionData.starRank;
      var apply_boost = interactionData.boosts;
      var evolutions = interactionData.evolutions;


      if (btnType == 'levelDownBtn') interactionData.level--;
      if (btnType == 'levelUpBtn') interactionData.level++;
      if (btnType == 'evolveBtn') interactionData.unit = unitEvo.replaceAll('_', ' ');

      unitName = interactionData.unit;
      level = interactionData.level;

      await db.set(`interactions.${interactionID}`, interactionData)


      const searchResults = await search.unitSearch(unitName);

      unit = searchResults[0].item;


      unitRarity = unit.RARITY;

      const maxLevel = (unitRarity < 4) ? 50 : 40;


      unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level, star_rank, apply_boost);



      row = new ActionRowBuilder();

      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`levelDownBtn ${interactionID}`)
          .setLabel(`Level ${level - 1}`)
          .setStyle('Primary')
          .setEmoji(`<:downarrow:998267358177153055>`)
          .setDisabled(level == 1)
      )
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`levelUpBtn ${interactionID}`)
          .setLabel(`Level ${parseInt(level) + 1}`)
          .setStyle('Primary')
          .setEmoji(`<:uparrow:998267359280250890>`)
          .setDisabled(level == maxLevel)
      )



      var unitEvolutions = unit['EVOLUTION'].split(',')
      if (unitEvolutions[0] == "") unitEvolutions = []
      for (const evo of unitEvolutions) {
        evoSearch = await search.unitSearch(evo);
        evoUnit = evoSearch[0].item;
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`evolveBtn ${interactionID} ${evo.replaceAll(" ", "_")}`)
            .setLabel(`${evo}`)
            .setEmoji(`${evoUnit['EMOJI']}`)
            .setStyle('Success'),
        );

      }

      if (originalUser != interaction.user.id) {
        return interaction.reply({
          embeds: [unitEmbed.embed],
          ephemeral: true
        })
      }

      interaction.update({
        embeds: [unitEmbed.embed],
        components: [row]
      });

    }




  },
};