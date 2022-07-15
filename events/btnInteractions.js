const unitEmbedGen = require('../utility/getUnitData.js');
const search = require('../utility/search.js');
const cache = require('../utility/cache.js');
const imgGen = require('../utility/HTML2IMG')

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
    var unitName = data[1].replaceAll(" ", "_");
    var level = data[2];
    var star_rank = data[3];
    var originalUser = data[4] || '222781123875307521';
    var interactionID = data[5] || null;

    if(btnType == 'generateNews') {
      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `You must run this command yourself to edit `,
          ephemeral: true
        })
      }
      var newsDetails = cache.get(`news.${interactionID}`);

      if(!newsDetails) {
        return interaction.reply({
          content: `This interaction has expired, please run the command again.`,
          ephemeral: true
        })
      }

      const waitEmbed = new MessageEmbed()
      .setColor('#ffb33c')
      .setTitle('Generating Deck...')
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
    
    
    if(btnType == 'setNewsDetails') {

      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `You must run this command yourself to edit `,
          ephemeral: true
        })
      }

      const modal = new Modal()
			.setCustomId(`newsModal ${interactionID} ${originalUser}`)
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

    if(btnType == 'editNewsModal') {

      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `You must run this command yourself to edit `,
          ephemeral: true
        })
      }

      var newsDetails = cache.get(`news.${interactionID}`);

      if(!newsDetails) {
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
			.setCustomId(`newsModal ${interactionID} ${originalUser}`)
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


    searchResults = await search.unitSearch(unitName);
    unit = searchResults[0].item;
    unitRarity = unit.RARITY;
    if (unitRarity == "4") {
      maxLevel = 30;
    } else {
      maxLevel = 40;
    }


    row = new MessageActionRow();
    unitsName = unit['Unit Name'].replaceAll(" ", "_")

    row.addComponents(
      new MessageButton()
      .setCustomId(`levelDownBtn ${unitsName} ${level - 1} ${star_rank} ${originalUser}`)
      .setLabel(`Level ${level - 1}`)
      .setStyle('PRIMARY')
      .setEmoji(`<:caretdownsolid:982871764575076383>`)
      .setDisabled(level == 1)
    )
    row.addComponents(
      new MessageButton()
      .setCustomId(`levelUpBtn ${unitsName} ${parseInt(level) + 1} ${star_rank} ${originalUser}`)
      .setLabel(`Level ${parseInt(level) + 1}`)
      .setStyle('PRIMARY')
      .setEmoji(`<:caretupsolid:982871763899789312>`)
      .setDisabled(level == maxLevel)
    )

    // console.log(unit, level)
    unitEmbed = await unitEmbedGen.getUnitEmbed(unit, level, star_rank);

    evolutions = unit['EVOLUTION'].split(", ")
    if(evolutions[0] == '0') evolutions = []

    // console.log(evolutions)
    for(const evo of evolutions) {
      evoSearch = await search.unitSearch(evo);
      evoUnit = evoSearch[0].item;
      row.addComponents(
          new MessageButton()
          .setCustomId(`evolveBtn ${evo.replaceAll(" ","_")} ${level} ${originalUser}`)
          .setLabel(`${evo}`)
          .setEmoji(`${evoUnit['EMOJI']}`)
          .setStyle('SUCCESS'),
      );

  }
   




      if (originalUser != interaction.user.id) {
        return interaction.reply({
          content: `Run the command yourself to get more information.`,
          embeds: [unitEmbed.embed],
          ephemeral: true
        })
      }

      interaction.update({
        embeds: [unitEmbed.embed],
        components: [row]
      });





  },
};