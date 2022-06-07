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
module.exports = {
    name: 'random_deck',
    category: 'Tools',
    description: 'Get a random deck',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {
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
            return leaderUnits[Math.floor(Math.random() * leaderUnits.length)]
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
                    if (unit['ISFINALEVOLUTION'] === 'FALSE') {
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
            randomDeckFinal.push(`${unitData[0].item['EMOJI']}  **${unitData[0].item['Unit Name']}**`)
            cache.set(`randomDeckFinal_${interactionID}`, randomDeckFinal)
            if(deckHTML.length < 1){
                deckHTML.push(`
                <div class="unit-card">
                <div class="leader-tag">LEADER</div>
                <div class="unit-img-cont">
                  <img src="https://res.cloudinary.com/tristangregory/image/upload/e_trim/v1644991354/gbl/${unitData[0].item['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}">
                </div>
              </div>
                `)
            } else {
                deckHTML.push(`
                <div class="unit-card">
                <div class="unit-img-cont">
                  <img src="https://res.cloudinary.com/tristangregory/image/upload/e_trim/v1644991354/gbl/${unitData[0].item['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}">
                </div>
              </div>
                `)
            }
        }

        var finalHTML = `
        <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;500;700;800&display=swap" rel="stylesheet">
        <style>*{font-family:"Poppins",sans-serif;box-sizing:border-box}.deck-card{background:#ffb94c;color:#462b00;width:1250px;height:auto;border-radius:25px;display:flex;flex-wrap:wrap;position:relative;padding:25px;row-gap:25px;column-gap:25px}.unit-card{width: 25%;flex:1 0 21%;background:rgba(70,43,0,.12);border-radius:25px;padding:15px;position:relative;border:5px solid transparent;padding-top:15px;padding-bottom:15px}body>div>div:nth-child(2){border-color:#4c92ff}.leader-tag{background:#4c92ff;color:#fff;font-size:20px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px;text-align:center;position:absolute;top:-15px;left:50%;transform:translatex(-50%);padding-left:15px;padding-right:15px;z-index:9}.unit-img-cont{max-width:300px;max-height:180px;margin:auto;display:flex;justify-content:center;align-items:center}.unit-img-cont img{max-width:300px;min-height:180px;max-height:180px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));display:block}.cost{display:none;position:absolute;bottom:10px;right:25px;background:#4c92ff;padding:15px;font-size:20px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px}.full{width:100%}.half{width:50%}.centered{display:flex;justify-content:center;align-items:center}.title{font-size:34px;font-weight:400;letter-spacing:.25px;color:#003735;margin-top:8px;margin-bottom:8px;text-align:center;display:none}.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1))}</style>
        <div class="deck-card">
<img class="credit-img" src="https://res.cloudinary.com/tristangregory/image/upload/v1644991351/gbl/pelops/Pelops_II.webp">
  
        ${deckHTML.join('')}
  
  


</div>
        
        `
        var img = await imgGen.makeTest(finalHTML, '.deck-card')


        const embed = new MessageEmbed()
        embed.setColor('#ffb33c')
            embed.setTitle('Random Deck')
            embed.setDescription(`${cache.get(`randomDeckFinal_${interactionID}`).join('\n')}`)
            embed.setImage('attachment://image.png')

        if(interaction.user.id ==='222781123875307521') {
            embed.setFooter({ text:`Deck ID - ${interactionID}` })
        }


        await interaction.editReply({
            embeds: [embed],
            files: [{
                attachment: img,
                name:'image.png'
              }]
        });
    }
}