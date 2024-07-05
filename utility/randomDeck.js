const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Events,
    StringSelectMenuBuilder
} = require('discord.js');

const random = require('../utility/random.js');
const imgGen = require('../utility/HTML2IMG.js');

const unitDataFile = require('../data/unitData.json');



const unavailiableUnits = [] //No unavailiable units at the moment


const deckSize = 8
const maxMultiDeckSize = 10

const leaderUnits = []
const units = []

for (const unit in unitDataFile) {
    // console.log(unitDataFile[unit].name)
    unitData = unitDataFile[unit]

    if(unitData.finalEvolution == false) continue

    if (unitData.leader) {
        leaderUnits.push(unitData.name)
    }
    units.push(unitData.name)
}

defaultOptions = {
    disable_unavailable_units: 'True',
    preferred_leader: null,
    amount: 1
}


exports.get = async function (options, user) {


    // Makes sure older buttons still work
    if (!options) options = defaultOptions
    if (!options.amount || options.amount < 1 || options.amount == 'null' || isNaN(options.amount)) options.amount = 1

    const randomDeckImages = new Array()
    const arrayOfPromises = new Array();
    const components = new Array();

    while (arrayOfPromises.length < options.amount) {
        arrayOfPromises.push(getDeckList(options))
    }


    async function processParallel(arrayOfPromises) {
        var t = await Promise.all(arrayOfPromises)
        for (item of t) {
            randomDeckImages.push({
                attachment: item.image,
                name: `${item.id}.jpg`
            })
        }
        return;
    }
    start = performance.now()
    await processParallel(arrayOfPromises)
    end = performance.now()
    total = end - start

    buttons = new ActionRowBuilder();

    buttons.addComponents(
        new ButtonBuilder()
            .setCustomId(`randomDeckBtn ${options.disable_unavailable_units} ${options.amount} ${options.amount}`)
            .setLabel(`Get Random Deck`)
            .setStyle('Primary')
    )


    // components.push(buttons)

    multiDeckSelect = []
    i = 1

    while (i <= maxMultiDeckSize) {
        multiDeckSelect.push({
            label: `Generate ${i} Decks`,
            value: i.toString(),
        })
        i++
    }


    const selectMenu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('randomDeckSelectMenu')
                .setPlaceholder('Generate multiple decks')
                .addOptions(multiDeckSelect),
        );

    components.push(selectMenu)


    if (options.amount > 1) {
        var deckMsg = `Generated \`${options.amount}\` decks in \`${total.toFixed(2)}ms\``
    } else {
        var deckMsg = `Generated deck in \`${total.toFixed(2)}ms\``
    }

    msg = `<@${user}>\n${deckMsg}`


    return {
        msg: msg,
        files: randomDeckImages,
        components: components,
        totalImgGenTime: total
    }

}




async function getDeckList(options) {
    deck = new Array()

    // Get leader - Check if preferred leader is available and if not, get a random leader
    var leaderUnit = options.preferred_leader || leaderUnits[Math.floor(Math.random() * leaderUnits.length)];
    deck.push(leaderUnit)

    // Get random units
    for (i = 0; i < deckSize - 1; i++) {
        var randomUnit = units[Math.floor(Math.random() * units.length)];

        // Check if unit is unavailiable
        if (options.disable_unavailable_units === 'True') {
            if (unavailiableUnits.includes(randomUnit)) {
                i--
                continue
            }

        }

        // Check if unit is already in deck
        if (deck.includes(randomUnit)) {
            i--
            continue
        }

        if (randomUnit.includes('Gyaos')) {
            randomUnit = 'Gyaos'
        }

        deck.push(randomUnit)

    }


    deckHTML = new Array()
    const imageHost = 'https://res.cloudinary.com/tristangregory/image/upload/e_trim/v1689538433/gbl'
    for (unit of deck) {
        var unitName = unit.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")
        var imageLink = `${imageHost}/${unitName}.webp`
        if (deckHTML.length < 1) {
            deckHTML.push(`
            <div class="unit-card leader-card">
            <div class="leader-tag">LEADER</div>
            <div class="unit-img-cont">
              <img src="${imageLink}">
            </div>
          </div>
            `)
        } else {
            deckHTML.push(`
            <div class="unit-card">
            <div class="unit-img-cont">
              <img src="${imageLink}">
            </div>
          </div>
            `)
        }

    }


    var finalHTML = `
    <style>
    *{font-family:"Poppins",sans-serif}.deck-card{background:linear-gradient(to bottom,rgba(255,162,76,113),rgba(255,185,76));color:#462b00;width:1250px;height:auto;border-radius:0px;display:flex;flex-wrap:wrap;position:relative;padding:25px;row-gap:25px;column-gap:25px;justify-content:space-between;overflow:hidden;position:relative}.unit-card{background:rgba(255,185,76);border:5px solid rgb(255,162,113);width:22%;flex:1 1 22%;height:283.75px;border-radius:15px;position:relative;display:flex;justify-content:center;align-items:center;box-shadow:0 2px 4px rgb(255,162,113)}.leader-card{border-color:rgb(76,146,255)}.leader-tag{background:rgb(76,146,255);color:#fff;font-size:24px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px;text-align:center;position:absolute;top:-20px;left:50%;transform:translatex(-50%);padding-left:15px;padding-right:15px;z-index:9}.unit-img-cont{max-width:300px;max-height:180px;margin:auto;display:flex;justify-content:center;align-items:center}.unit-img-cont img{max-height:190px;max-width:95%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));filter:drop-shadow(0 2px 3px rgba(76,146,255,.4));display:block}.cost{display:none;position:absolute;bottom:10px;right:25px;background:#4c92ff;padding:15px;font-size:20px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px}.full{width:100%}.half{width:50%}.centered{display:flex;justify-content:center;align-items:center}.title{font-size:34px;font-weight:600;letter-spacing:.25px;color:#003735;margin-top:8px;margin-bottom:0;text-align:center;z-index:100}.small-title{font-size:17px;font-weight:600;letter-spacing:.15px;color:#003735;margin-top:0;margin-bottom:0;text-align:center;z-index:100}.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1));z-index:100}
    </style>
    <div class="deck-card">
    <img class="credit-img" src="${imageHost}/pelops/Pelops_II.webp">    
        ${deckHTML.join('')}
    </div>
        `


    // var img = await imgGen.cluster(finalHTML, '.deck-card')
    var img = await imgGen.post({
        html: finalHTML,
        selector: '.deck-card',
        type: 'jpeg',
        quality: 100
    })


    return {
        id: random.id(8),
        image: img,
        deck: deck
    }

}


