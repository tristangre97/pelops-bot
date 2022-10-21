const cache = require('../utility/cache.js')
const db = require('../utility/database.js')
const search = require('../utility/search.js');
const imgGen = require('../utility/HTML2IMG.js');
const userDecks = require('./getUserDeck');
const fs = require('node:fs');

const unitData = JSON.parse(fs.readFileSync('./data/unitData.json'));


const unavailiableUnits = ['Kong', 'Godzilla 21']
const deckSize = 8
var leaderUnits = []
var units = []

for (unit of unitData) {
    if (unit['ISFINALEVOLUTION'] === 'FALSE') continue
    if (unit.LEADER === 'TRUE') {
        leaderUnits.push(unit['Unit Name'])
        units.push(unit['Unit Name'])
    } else {
        units.push(unit['Unit Name'])
    }
}

exports.get = async function (options) {
    // Options do nothing atm :P

    deck = new Array()

    // Get random leader
    var randomLeader = leaderUnits[Math.floor(Math.random() * leaderUnits.length)];
    deck.push(randomLeader)

    // Get random units
    for (i = 0; i < deckSize - 1; i++) {
        var randomUnit = units[Math.floor(Math.random() * units.length)];

        // Check if unit is unavailiable
        if (options.disable_unavailable_units) {
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


    deckHTML = new Array()

    for (unit of deck) {
        unitName = unit.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")

        if(deckHTML.length < 1) {
            deckHTML.push(`
            <div class="unit-card leader-card">
            <div class="leader-tag">LEADER</div>
            <div class="unit-img-cont">
              <img src="http://localhost:8008/gbl/${unitName.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png">
            </div>
          </div>
            `)
        } else {
            deckHTML.push(`
            <div class="unit-card">
            <div class="unit-img-cont">
              <img src="http://localhost:8008/gbl/${unitName.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png">
            </div>
          </div>
            `)
        }

        
    }


    var finalHTML = `

    <style>
    *{font-family:"Poppins",sans-serif}.deck-card{background:linear-gradient(to bottom,rgba(255,162,76,113),rgba(255,185,76));color:#462b00;width:1250px;height:auto;border-radius:25px;display:flex;flex-wrap:wrap;position:relative;padding:25px;row-gap:25px;column-gap:25px;justify-content:space-between;overflow:hidden;position:relative}.unit-card{background:rgba(255,185,76);border:5px solid rgb(255,162,113);width:22%;flex:1 1 22%;height:283.75px;border-radius:15px;position:relative;display:flex;justify-content:center;align-items:center;box-shadow:0 2px 4px rgb(255,162,113)}.leader-card{border-color:rgb(76,146,255)}.leader-tag{background:rgb(76,146,255);color:#fff;font-size:24px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px;text-align:center;position:absolute;top:-20px;left:50%;transform:translatex(-50%);padding-left:15px;padding-right:15px;z-index:9}.unit-img-cont{max-width:300px;max-height:180px;margin:auto;display:flex;justify-content:center;align-items:center}.unit-img-cont img{max-height:190px;max-width:95%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));filter:drop-shadow(0 2px 3px rgba(76,146,255,.4));display:block}.cost{display:none;position:absolute;bottom:10px;right:25px;background:#4c92ff;padding:15px;font-size:20px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;border-radius:5px}.full{width:100%}.half{width:50%}.centered{display:flex;justify-content:center;align-items:center}.title{font-size:34px;font-weight:600;letter-spacing:.25px;color:#003735;margin-top:8px;margin-bottom:0;text-align:center;z-index:100}.small-title{font-size:17px;font-weight:600;letter-spacing:.15px;color:#003735;margin-top:0;margin-bottom:0;text-align:center;z-index:100}.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1));z-index:100}
    </style>
    <div class="deck-card">
    
    <img class="credit-img" src="http://localhost:8008/gbl/pelops/Pelops_II.webp">
    
        ${deckHTML.join('')}
    
    
    
    
    </div>
        
        `
    var imgGenStart = performance.now()
    var img = await imgGen.cluster(finalHTML, '.deck-card')
    var imgGenEnd = performance.now()
    totalImgGenTime = imgGenEnd - imgGenStart


    returnData = {
        deck: deck,
        deckHTML: deckHTML,
        image: img,
        totalImgGenTime: totalImgGenTime

    }


    return returnData

}






exports.getUserDeck = async function (user) {
    if (!user) {
        var deckList = await db.get(`usersDecks`)
    } else {
        var deckList = await db.get(`user.${user}.decks`)
    }


    var deckListArray = []
    for (deck in deckList) {
        deckListArray.push(deck)
    }
    // Get random deck
    var randomDeck = deckListArray[Math.floor(Math.random() * deckListArray.length)];
    deckData = deckList[randomDeck]
    var imgGenStart = performance.now()
    var img = await userDecks.get(deckData)
    var imgGenEnd = performance.now()
    totalImgGenTime = imgGenEnd - imgGenStart
    returnData = {
        image : img,
        totalImgGenTime: totalImgGenTime
    }
    return returnData

}








