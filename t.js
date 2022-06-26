const db = require('./utility/database');
const cache = require('./utility/cache');
const fs = require("fs");
const search = require('./utility/search.js');

cache.set('unitData', fs.readFileSync('/home/tristan/Downloads/pelops/data/unitData.json', 'utf8'), 0);


var unitData = JSON.parse(cache.get('unitData'));
var leaderUnits = []
var units = []

var randomDeck = []


for(unit of unitData) {
    if(unit.LEADER === 'TRUE') {
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
var godzillaAmount = 0;
function getRandomDeck() {

    var maxDeckSize = 8;
    var leader = getRandomLeader();
    randomDeck.push(leader['Unit Name'])

    while(randomDeck.length < maxDeckSize) {
        var unit = getRandomUnit()

        if(randomDeck.indexOf(unit['Unit Name']) === -1) {
            if(unit['ISFINALEVOLUTION'] === 'FALSE' || !unit['Unit Name'].includes('Godzilla')) {
                continue
            } else {
                randomDeck.push(unit['Unit Name'])
                if(unit['Unit Name'].includes('Godzilla')) {
                    godzillaAmount++;
                }
            }
            
        } else {
            continue
        }
    }

    }

    getRandomDeck()

    randomDeckFinal = []
    for(unit of randomDeck) {
        var unitData = search.unitSearch(unit)

        // randomDeckFinal.push(`${unitData[0].item['EMOJI']} ${unitData[0].item['Unit Name']}`)
    }

console.log(randomDeck)
console.log(`Godzilla Amount: ${godzillaAmount}`)