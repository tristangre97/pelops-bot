const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Events,
  StringSelectMenuBuilder
} = require('discord.js');
const fs = require('node:fs');

const random = require('../utility/random.js');
const imgGen = require('../utility/HTML2IMG.js');
const deckCSS = fs.readFileSync('/home/tristan/Downloads/pelops/data/css/deck.css', 'utf8')

const unitDataFile = require('../data/unitData.json');
// /home/tristan/Downloads/pelops/data/css/deck.css

const unavailiableUnits = [] //No unavailiable units at the moment


const minDeckSize = 8
const maxDeckSize = 12
const maxMultiDeckSize = 10

const leaderUnits = []
const units = []

for (const unit in unitDataFile) {
  unitData = unitDataFile[unit]
  if (unitData.skip) continue

  if (unitData.finalEvolution == false) continue

  if (unitData.leader) {
    leaderUnits.push(unitData)
  }
  units.push(unitData)
}

const defaultOptions = {
  disable_unavailable_units: 'True',
  preferred_leader: null,
  amount: 1
}


exports.get = async function (options, user) {

  let { disable_unavailable_units, amount, deckSize, textOnly } = options

  // Makes sure older buttons still work
  if (!options) options = defaultOptions
  if (!amount || amount < 1 || amount == 'null' || isNaN(amount)) amount = 1
  if (!deckSize || deckSize < minDeckSize) deckSize = minDeckSize
  if (deckSize > maxDeckSize) deckSize = maxDeckSize

  const randomDeckImages = new Array()
  const arrayOfPromises = new Array();
  const components = new Array();


  if (textOnly) {
    amount = 1
    deck = await getDeckList(options)
    let deckkMsg = deck.map(unit => {
      let emojiName = unit.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
      let emojiID = unit.emoji
      let emoji = `<:${emojiName}:${emojiID}>`

      return `${emoji} **${unit.name}**`

    })
    let msg = `${deckkMsg.join('\n')}`
    return {
      msg: msg,

    }
  }

  while (arrayOfPromises.length < amount) {
    arrayOfPromises.push(getDeckList(options))
  }


  async function processParallel(arrayOfPromises) {
    var t = await Promise.all(arrayOfPromises)
    for (item of t) {
      randomDeckImages.push({
        attachment: item.image,
        name: `${item.id}.jpeg`
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
      .setCustomId(`randomDeckBtn ${disable_unavailable_units} ${amount} ${deckSize}`)
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
        .setCustomId(`randomDeckSelectMenu_${deckSize}`)
        .setPlaceholder('Generate multiple decks')
        .addOptions(multiDeckSelect),
    );

  components.push(selectMenu)


  if (amount > 1) {
    var deckMsg = `Generated \`${amount}\` decks in \`${total.toFixed(2)}ms\``
  } else {
    var deckMsg = `Generated deck in \`${total.toFixed(2)}ms\``
  }

  msg = `<@${user}>\n${deckMsg}`

  return {
    msg: msg,
    files: randomDeckImages,
    components: components,
    totalImgGenTime: total,
    decks: arrayOfPromises
  }

}




async function getDeckList(options) {
  let { deckSize, disable_unavailable_units, preferred_leader, textOnly } = options
  if (!deckSize) deckSize = 8
  let deck = new Array()

  // Get leader - Check if preferred leader is available and if not, get a random leader
  const leaderUnit = preferred_leader || leaderUnits[Math.floor(Math.random() * leaderUnits.length)];
  deck.push(leaderUnit)

  // Get random units
  for (i = 0; i < deckSize - 1; i++) {
    let randomUnit = units[Math.floor(Math.random() * units.length)];

    // Check if unit is unavailiable
    if (disable_unavailable_units === 'True') {
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


    deck.push(randomUnit)

  }

  if (textOnly) return deck

  let deckHTML = new Array()
  for (unit of deck) {
    let imageLink = unit.image;
    imageLink = imageLink.replace('.png', '.webp')
    // https://res.cloudinary.com/tristangregory/image/upload/e_trim,h_256/v1689538433/gbl/Mechagodzilla_93.webp
    // After upload/ add e_trim,h_256/ to the link to crop the image
    imageLink = imageLink.replace('https://res.cloudinary.com/tristangregory/image/upload/', 'https://res.cloudinary.com/tristangregory/image/upload/e_trim,h_300/')


    let stars = new Array()
    const rarity = unit.rarity

    while (stars.length < rarity) {
      stars.push('<i class="fa-solid fa-star"></i>')
    }

    if (deckHTML.length < 1) {
      deckHTML.push(`
            <div class="unit-card leader-card">
            <div class="rarity">${stars.join('')}</div>
            <div class="tag leader">LEADER</div>
            <div class="unit-img-cont">
              <img src="${imageLink}">
            </div>
            <div class="unit-name leader">${unit.name}</div>
          </div>
            `)
    } else if (deckHTML.length == 1) {
      deckHTML.push(`
            <div class="unit-card ace-card">
            <div class="rarity">${stars.join('')}</div>
            <div class="tag ace">ACE</div>
            <div class="unit-img-cont">
              <img src="${imageLink}">
            </div>
            <div class="unit-name ace">${unit.name}</div>
          </div>
            `)
    } else {
      deckHTML.push(`
            <div class="unit-card">
            <div class="rarity">${stars.join('')}</div>
            <div class="unit-img-cont">
              <img src="${imageLink}">
            </div>
            <div class="unit-name">${unit.name}</div>
          </div>
            `)
    }

  }


  const finalHTML = `
    <style>${deckCSS}</style>
<div class="deck-card" id="randomDeck">
<img class="credit-img" src="https://res.cloudinary.com/tristangregory/image/upload/e_trim,h_128/v1653341451/gbl/pelops/Pelops_II.webp">
${deckHTML.join('')}
  </div>
</div>        
    </div>
        `

  const img = await imgGen.post({
    html: finalHTML,
    selector: '#randomDeck',
    type: 'jpeg',
    quality: 80
  })


  return {
    id: random.id(8),
    image: img,
    deck: deck
  }

}


