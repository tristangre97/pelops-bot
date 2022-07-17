const unitEmbedGen = require('../utility/getUnitData.js');
const search = require('../utility/search.js');
const cache = require('../utility/cache.js');
const imgGen = require('../utility/HTML2IMG')
const db = require('../utility/database.js');
const random = require('../utility/random.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent
} = require('discord.js');


module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {

    if (interaction.type != 'MESSAGE_COMPONENT') return;
    if (interaction.isSelectMenu()) return



    const data = interaction.customId.split(' ');
    var btnType = data[0];
    var interactionID = data[1];
    var unitEvo = data[2];

    var interactionData = await db.get(`interactions.${interactionID}`) || db.get(`news.${interactionID}`);
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
      var newsDetails = db.get(`news.${interactionID}`);

      if (!newsDetails) {
        return interaction.reply({
          content: `This interaction has expired, please run the command again.`,
          ephemeral: true
        })
      }

      const waitEmbed = new MessageEmbed()
        .setColor('#ffb33c')
        .setTitle('Generating News...')
        .setDescription(`I am generating your news article. This may take a second.`)
        .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

      await interaction.update({
        embeds: [waitEmbed],
        components: [],
      })

      var HTML = newsDetails.HTML;
      img = await imgGen.makeTest(HTML, '.cont')
      return interaction.editReply({
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

      const modal = new Modal()
        .setCustomId(`newsModal ${interactionID}`)
        .setTitle('Set News Details')

      // const reportTypeText = new TextInputComponent()
      // .setCustomId('reportTypeText')
      // .setLabel("Alert Text")
      // .setStyle('SHORT')

      const newsTitle = new TextInputComponent()
        .setCustomId('newsTitle')
        .setLabel("Title")
        .setStyle('SHORT')


      const imageURL = new TextInputComponent()
        .setCustomId('imageURL')
        .setLabel("Image URL")
        .setStyle('SHORT')
      // .setRequired(true)


      const newsQuote = new TextInputComponent()
        .setCustomId('newsQuote')
        .setLabel("Blockquote")
        .setStyle('SHORT')
      // .setRequired(true)


      const newsArticle = new TextInputComponent()
        .setCustomId('newsArticle')
        .setLabel("Article")
        .setStyle('PARAGRAPH')
      // .setRequired(true)

      // const firstActionRow = new MessageActionRow().addComponents(reportTypeText);
      const secondActionRow = new MessageActionRow().addComponents(newsTitle);
      const thirdActionRow = new MessageActionRow().addComponents(imageURL);
      const fourthActionRow = new MessageActionRow().addComponents(newsQuote);
      const fifthActionRow = new MessageActionRow().addComponents(newsArticle);


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

      var newsDetails = db.get(`news.${interactionID}`);

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

      const modal = new Modal()
        .setCustomId(`newsModal ${interactionID}`)
        .setTitle('Set News Details')

      // const reportTypeText = new TextInputComponent()
      // .setCustomId('reportTypeText')
      // .setLabel("Alert Text")
      // .setStyle('SHORT')
      // .setValue(reportTypeTextCache)

      const newsTitle = new TextInputComponent()
        .setCustomId('newsTitle')
        .setLabel("Title")
        .setStyle('SHORT')
        .setValue(newsTitleCache)

      const imageURL = new TextInputComponent()
        .setCustomId('imageURL')
        .setLabel("Image URL")
        .setStyle('SHORT')
        .setValue(imageURLCache)


      const newsQuote = new TextInputComponent()
        .setCustomId('newsQuote')
        .setLabel("Blockquote")
        .setStyle('SHORT')
        .setValue(newsQuoteCache)


      const newsArticle = new TextInputComponent()
        .setCustomId('newsArticle')
        .setLabel("Article")
        .setStyle('PARAGRAPH')
        .setValue(newsArticleCache)



      // const firstActionRow = new MessageActionRow().addComponents(reportTypeText);
      const secondActionRow = new MessageActionRow().addComponents(newsTitle);
      const thirdActionRow = new MessageActionRow().addComponents(imageURL);
      const fourthActionRow = new MessageActionRow().addComponents(newsQuote);
      const fifthActionRow = new MessageActionRow().addComponents(newsArticle);




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


        interactionData = db.get(`interactions.${interactionID}`)
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
      if (unitRarity == "4") {
        maxLevel = 30;
      } else {
        maxLevel = 40;
      }

      unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level, star_rank, apply_boost);



      row = new MessageActionRow();

      row.addComponents(
        new MessageButton()
          .setCustomId(`levelDownBtn ${interactionID}`)
          .setLabel(`Level ${level - 1}`)
          .setStyle('PRIMARY')
          .setEmoji(`<:downarrow:998267358177153055>`)
          .setDisabled(level == 1)
      )
      row.addComponents(
        new MessageButton()
          .setCustomId(`levelUpBtn ${interactionID}`)
          .setLabel(`Level ${parseInt(level) + 1}`)
          .setStyle('PRIMARY')
          .setEmoji(`<:uparrow:998267359280250890>`)
          .setDisabled(level == maxLevel)
      )



      var unitEvolutions = unit['EVOLUTION'].split(',')
      if (unitEvolutions[0] == "") unitEvolutions = []
      for (const evo of unitEvolutions) {
        evoSearch = await search.unitSearch(evo);
        evoUnit = evoSearch[0].item;
        row.addComponents(
          new MessageButton()
            .setCustomId(`evolveBtn ${interactionID} ${evo.replaceAll(" ", "_")}`)
            .setLabel(`${evo}`)
            .setEmoji(`${evoUnit['EMOJI']}`)
            .setStyle('SUCCESS'),
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