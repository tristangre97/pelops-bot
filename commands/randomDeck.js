const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const crypto = require("crypto");

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const search = require('../utility/search.js');
const imgGen = require('../utility/HTML2IMG.js');

var unavailiableUnits = ['Kong', 'Godzilla 21']



module.exports = {
    name: 'random_deck',
    category: 'Tools',
    description: 'Get a random deck',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,
    options: [{
        name: 'disable_unavailable_units', // Must be lower case
        description: 'Prevent unavailable units from appearing in the deck',
        required: false,
        type: 3,
        choices: [{
            name: 'True',
            value: 'True',
        }
        ]
    },],

    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {
        var [disable_unavailable_units] = args;
        if(!disable_unavailable_units) disable_unavailable_units = false;
        db.add(`stats.uses`)
        var unitData = JSON.parse(cache.get('unitData'));
        var interactionID = crypto.randomBytes(16).toString("hex");

        const waitEmbed = new MessageEmbed()
            .setColor('#ffb33c')
            .setTitle('Generating Deck...')
            .setDescription(`I am generating a random deck for you. This may take a second.`)
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

        reply = await interaction.editReply({
            embeds: [waitEmbed],
        });

        var leaderUnits = []
        var units = []

        var randomDeck = []


        for (unit of unitData) {
            if (unit.LEADER === 'TRUE') {
                leaderUnits.push(unit)
                units.push(unit)
            } else {
                units.push(unit)
            }
        }

        function getRandomLeader() {
            unit = leaderUnits[Math.floor(Math.random() * leaderUnits.length)]
            if (unavailiableCheck(unit['Unit Name'])) {
                getRandomLeader()
            }
            return unit
        }

        function getRandomUnit() {
            return units[Math.floor(Math.random() * units.length)]
        }

        function getRandomDeck() {

            var maxDeckSize = 8;
            var leader = getRandomLeader();

            randomDeck.push(leader['Unit Name'])

            while (randomDeck.length < maxDeckSize) {
                var unit = getRandomUnit()
                if (randomDeck.indexOf(unit['Unit Name']) === -1) {
                    if (unit['ISFINALEVOLUTION'] === 'FALSE' || unavailiableCheck(unit['Unit Name'])) {
                        continue
                    } else {
                        randomDeck.push(unit['Unit Name'])
                    }

                } else {
                    continue
                }
            }
            cache.set(`randomDeck_${interactionID}`, randomDeck)
        }

        getRandomDeck()

        randomDeckFinal = []
        var deckHTML = []

        var randomDeck = cache.get(`randomDeck_${interactionID}`)

        for (unit of randomDeck) {
            var unitData = search.unitSearch(unit)
            unitName = unitData[0].item['Unit Name'];
            randomDeckFinal.push(`${unitData[0].item['EMOJI']}  **${unitData[0].item['Unit Name']}**`)
            cache.set(`randomDeckFinal_${interactionID}`, randomDeckFinal)
            if (deckHTML.length < 1) {
                deckHTML.push(`
                <div class="unit-card leader-card">
                <div class="leader-tag">LEADER</div>
                <div class="unit-img-cont">
                  <img src="https://res.cloudinary.com/tristangregory/image/upload/h_300,c_limit/v1654633586/gbl/${unitName.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}">
                </div>
              </div>
                `)
            } else {

                if (unitName === 'Minilla') {
                    var random = Math.floor(Math.random() * 100) + 1;
                    if (random <= 50) {
                        unitName = 'sir_minillee'
                    }
                }
                deckHTML.push(`
                <div class="unit-card">
                <div class="unit-img-cont">
                  <img src="https://res.cloudinary.com/tristangregory/image/upload/h_300,c_limit/v1654633586/gbl/${unitName.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}">
                </div>
              </div>
                `)
            }
        }

        var finalHTML = `
        <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;500;700;800&display=swap" rel="stylesheet">
<style>
*{font-family:"Poppins",sans-serif}.deck-card{background:#ffb94c;color:#462b00;width:1250px;height:auto;border-radius:25px;display:flex;flex-wrap:wrap;position:relative;padding:25px;row-gap:25px;column-gap:25px;justify-content:space-between}.unit-card{width:22%;flex:1 1 22%;height:283.75px;background:rgba(70,43,0,.12);border-radius:25px;position:relative;border:5px solid rgba(70,43,0,.12);display:flex;justify-content:center;align-items:center}.leader-card{border-color:#4c92ff}.leader-tag{background:#4c92ff;color:#fff;font-size:24px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:8px;text-align:center;position:absolute;top:-17px;left:50%;transform:translatex(-50%);padding-left:15px;padding-right:15px;z-index:9}.unit-img-cont{max-width:300px;max-height:180px;margin:auto;display:flex;justify-content:center;align-items:center}.unit-img-cont img{max-height:190px;max-width:95%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));display:block}.cost{display:none;position:absolute;bottom:10px;right:25px;background:#4c92ff;padding:15px;font-size:20px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px}.full{width:100%}.half{width:50%}.centered{display:flex;justify-content:center;align-items:center}.title{font-size:34px;font-weight:400;letter-spacing:.25px;color:#003735;margin-top:8px;margin-bottom:8px;text-align:center}.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1))}
</style>
<div class="deck-card">
<img class="credit-img" src="https://res.cloudinary.com/tristangregory/image/upload/v1644991351/gbl/pelops/Pelops_II.webp">
  
        ${deckHTML.join('')}
  
  


</div>
        
        `
        var img = await imgGen.makeTest(finalHTML, '.deck-card')


        const embed = new MessageEmbed()
        embed.setColor('#ffb33c')
        embed.setTitle('Random Deck')
        embed.setDescription(`${cache.get(`randomDeckFinal_${interactionID}`).join(', ')}`)
        embed.setImage(`attachment://${interactionID}.png`)

        if (interaction.user.id === '222781123875307521') {
            embed.setFooter({ text: `Deck ID - ${interactionID}` })
        }


        var reply = await interaction.editReply({
            embeds: [embed],
            files: [{
                attachment: img,
                name: `${interactionID}.png`
            }]
        }).then(async msg => {
            // msg.react('👍')
            // msg.react('👎')

            const SECONDS_TO_REPLY = 15 // replace 60 with how long to wait for message(in seconds).
            const MESSAGES_TO_COLLECT = 5
            const filter = (m) => m.author.id == interaction.user.id
            const collector = interaction.channel.createMessageCollector({ filter, time: SECONDS_TO_REPLY * 1000, max: MESSAGES_TO_COLLECT })
            collector.on('collect', async collected => {
                collected.content = collected.content.toLowerCase()
                if (collected.content.includes('deck sucks') || collected.content.includes('is bad') || collected.content.includes('is terrible') || collected.content.includes('are terrible') || collected.content.includes('terrible') || collected.content.includes('ass')) {
                    await interaction.followUp({
                        content: `<@${interaction.user.id}> skill issue.`,
                        files: [{
                            attachment: 'https://res.cloudinary.com/tristangregory/image/upload/v1655007370/gbl/pelops/pelops_em.png',
                            name: 'yeet.png'
                        }]
                    });

                }

            })


        })


        function unavailiableCheck(unit) {
            if (!disable_unavailable_units) return false
            if (unavailiableUnits.includes(unit)) {
                return true
            } else {
                return false
            }
        }

    }
}



