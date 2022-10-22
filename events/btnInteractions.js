const unitEmbedGen = require('../utility/getUnitData.js');
const search = require('../utility/search.js');
const cache = require('../utility/cache.js');
const imgGen = require('../utility/HTML2IMG')
const db = require('../utility/database.js');
const random = require('../utility/random.js');
const randomDeck = require('../utility/randomDeck');
const crypto = require("node:crypto");
const userDecks = require('../utility/getUserDeck');

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

    if (interaction.type != InteractionType.MessageComponent) return;




    const data = interaction.customId.split(' ');
    var btnType = data[0];
    var interactionID = data[1];
    var unitEvo = data[2];



    if (btnType == 'deckLike') {
      var deckID = interactionID


      if (db.get(`userLikes.${interaction.user.id}.${deckID}`)) return interaction.reply({ content: 'You already liked this deck!', ephemeral: true })
      if (db.get(`userDislikes.${interaction.user.id}.${deckID}`)) {
        db.delete(`userDislikes.${interaction.user.id}.${deckID}`)
        await db.sub(`deckStats.${deckID}.dislikes`, 1)
      }

      await db.add(`deckStats.${deckID}.likes`, 1)
      await db.set(`userLikes.${interaction.user.id}.${deckID}`, true)

      deckLikes = await db.get(`deckStats.${deckID}.likes`)
      deckDislikes = await db.get(`deckStats.${deckID}.dislikes`)

      btns = new ActionRowBuilder();
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`deckLike ${deckID}`)
          .setLabel(`${deckLikes || 0}`)
          .setEmoji('👍')
          .setStyle('Primary')
      )
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`deckDislike ${deckID}`)
          .setLabel(`${deckDislikes || 0}`)
          .setEmoji('👎')
          .setStyle('Danger')
      )

      await interaction.update({
        components: [btns]
      })


      return interaction.followUp({ content: 'Liked!', ephemeral: true })
    }

    if (btnType == 'deckDislike') {
      var deckID = interactionID
      if (db.get(`userDislikes.${interaction.user.id}.${deckID}`)) return interaction.reply({ content: 'You already disliked this deck!', ephemeral: true })
      if (db.get(`userLikes.${interaction.user.id}.${deckID}`)) {
        await db.delete(`userLikes.${interaction.user.id}.${deckID}`)
        await db.sub(`deckStats.${deckID}.likes`, 1)
      }
      await db.add(`deckStats.${deckID}.dislikes`, 1)

      await db.set(`userDislikes.${interaction.user.id}.${deckID}`, true)

      deckLikes = await db.get(`deckStats.${deckID}.likes`)
      deckDislikes = await db.get(`deckStats.${deckID}.dislikes`)
      btns = new ActionRowBuilder();
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`deckLike ${deckID}`)
          .setLabel(`${deckLikes || 0}`)
          .setEmoji('👍')
          .setStyle('Primary')
      )
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`deckDislike ${deckID}`)
          .setLabel(`${deckDislikes || 0}`)
          .setEmoji('👎')
          .setStyle('Danger')
      )

      await interaction.update({
        components: [btns]
      })


      return interaction.followUp({ content: 'Disliked!', ephemeral: true })
    }




    if (btnType == 'submitUserDeck') {
      deckData = await cache.get(`userDeckCreator_${interactionID}`)
      if (!deckData) return interaction.reply({ content: `This deck has expired.`, ephemeral: true })

      if (deckData.user.id != interaction.user.id) return interaction.reply({ content: `You can't submit someone else's deck.`, ephemeral: true })

      var img = await userDecks.get(deckData)

      db.set(`usersDecks.${interactionID}`, deckData)
      db.set(`user.${interaction.user.id}.decks.${interactionID}`, deckData)

      var embed = new EmbedBuilder()
      embed.setTitle(`Deck Saved!`)
      embed.setDescription(`
**ID:** ${interactionID}
**Name**: 
${deckData.details.name}
**Description**:
${deckData.details.description}
`)
      embed.setImage(`attachment://${interactionID}.png`)
      embed.setFooter({
        text: `Deck ID: ${interactionID} - Share this ID to let others use your deck!`
      })
      deckLikes = await db.get(`deckStats.${interactionID}.likes`) || 0
      deckDislikes = await db.get(`deckStats.${interactionID}.dislikes`) || 0
      btns = new ActionRowBuilder();
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`deckLike ${interactionID}`)
          .setLabel(`${deckLikes}`)
          .setEmoji('👍')
          .setStyle('Primary')
      )
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`deckDislike ${interactionID}`)
          .setLabel(`${deckDislikes}`)
          .setEmoji('👎')
          .setStyle('Danger')
      )

      return interaction.update({
        embeds: [embed],
        components: [btns],
        files: [{
          attachment: img,
          name: `${interactionID}.png`
        }]
      })
    }


    if (btnType == 'setUserDeckDetails') {
      deckData = await cache.get(`userDeckCreator_${interactionID}`)

      if (!deckData) return interaction.reply({
        content: 'This deck has expired',
        ephemeral: true
      })
      if (deckData.user.id != interaction.user.id) return interaction.reply({ content: `You can't edit someone else's deck.`, ephemeral: true })

      const modal = new ModalBuilder()
        .setCustomId(`userDeckModal ${interactionID}`)
        .setTitle('Set News Details')


      const newsTitle = new TextInputBuilder()
        .setCustomId('deckName')
        .setLabel("Deck Name")
        .setStyle('Short')
        .setMaxLength(100)
      if (deckData.details.name) {
        newsTitle.setValue(deckData.details.name)
      }

      const imageURL = new TextInputBuilder()
        .setCustomId('deckDescription')
        .setLabel("Deck Description")
        .setStyle('Paragraph')
        .setMaxLength(1000)
      if (deckData.details.description) {
        imageURL.setValue(deckData.details.description)
      }

      const secondActionRow = new ActionRowBuilder().addComponents(newsTitle);
      const thirdActionRow = new ActionRowBuilder().addComponents(imageURL);


      modal.addComponents(secondActionRow, thirdActionRow);

      return interaction.showModal(modal);



    }





    if (btnType == 'randomDeckMultiBtn') {
      extraMsg = []
      amount = interactionID
      const embed = new EmbedBuilder()
      embed.setColor('#ffb33c')
      embed.setTitle('Generating Deck...')
      if (amount > 1) {
          embed.setDescription(`I am generating ${amount} random decks for you. This may take a second.`)
      } else {
          embed.setDescription(`I am generating a random deck for you. This may take a second.`)
      }
      embed.setImage('https://res.cloudinary.com/tristangregory/image/upload/v1664223401/gbl/pelops/random.gif')

      await interaction.reply({
          embeds: [embed],
      });



      const randomDeckImages = new Array();
        const arrayOfPromises = new Array();

        madeDecks = 0;
        while (madeDecks < amount) {
            arrayOfPromises.push(randomDeck.get());
            madeDecks++;
        }

        async function processParallel(arrayOfPromises) {
            var t = await Promise.all(arrayOfPromises)
            for (item of t) {
                randomDeckImages.push({
                    attachment: item.image,
                    name: `${item.id}.png`
                })
            }
            return;
        }



        startImageGen = performance.now();
        await processParallel(arrayOfPromises)
        endImageGen = performance.now();
        totalImgGenTime = endImageGen - startImageGen;


        buttons = new ActionRowBuilder();

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId(`randomDeckBtn`)
                .setLabel(`Get Random Deck`)
                .setStyle('Primary')
        )

        if (amount > 1) {
            buttons.addComponents(
                new ButtonBuilder()
                    .setCustomId(`randomDeckMultiBtn ${amount}`)
                    .setLabel(`Get ${amount} Random Decks`)
                    .setStyle('Primary')
            )
        }

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId(`randomDeckBtn User`)
                .setLabel(`Get Random User Deck`)
                .setStyle('Success')
        )


        await interaction.editReply({
            content: `<@${interaction.user.id}> 
Made \`${amount}\` random decks in \`${totalImgGenTime.toFixed(2)}ms\`
${extraMsg}
`,
            embeds: [],
            components: [buttons],
            files: randomDeckImages
        })

      return interaction.editReply({
        embeds: [],
        components: [buttons],
        files: randomDeckImages
      })
    }


    if (btnType == 'randomDeckBtn') {

      const waitEmbed = new EmbedBuilder()
        .setColor('#ffb33c')
        .setTitle('Generating Deck...')
        .setDescription(`I am generating a random deck for you. This may take a second.`)
        .setImage(`https://res.cloudinary.com/tristangregory/image/upload/v1664223401/gbl/pelops/random.gif`)

      reply = await interaction.reply({
        embeds: [waitEmbed],
      });

      unitEvo = 'True'
      extraMessage = ''
      if(interactionID == 'User') {
        randomDeckData = await randomDeck.getUserDeck();
        extraMessage = `Create your own deck with </user_deck create:1023654598470283268>!`
      } else {
        randomDeckData = await randomDeck.get();
      }

      actionBtns = new ActionRowBuilder();
      actionBtns.addComponents(
        new ButtonBuilder()
          .setCustomId(`randomDeckBtn`)
          .setLabel(`Get Random Deck`)
          .setStyle('Primary')
      )
      actionBtns.addComponents(
        new ButtonBuilder()
        .setCustomId(`randomDeckBtn User`)
        .setLabel(`Get Random User Deck`)
        .setStyle('Success')
    )

      return interaction.editReply({
        embeds: [],
        content: `<@${interaction.user.id}>
Made in \`${randomDeckData.totalImgGenTime.toFixed(2)}ms\`
${extraMessage}`,
        components: [actionBtns],
        files: [{
          attachment: randomDeckData.image,
          name: `${randomDeckData.id}.png`
        }]
      })
    }


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
      img = await imgGen.cluster(HTML, '.cont')
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