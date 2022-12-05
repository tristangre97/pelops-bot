const db = require('./utility/database');
const unitData = require('./data/unitData.json');
const random = require('./utility/random');



return console.log(db.get(`unit.data`))
for (unit of unitData) {


    //    'Unit Name': 'Zetton',
    //    ALIASES: '',
    //    EMOJI: '<:Zetton:1014706265022267423>',
    //    COST: '8',
    //    RARITY: '4',
    //    'IS A UNIT': 'TRUE',
    //    'IS AN EFFECT': 'FALSE',
    //    HP: '1108',
    //    ATK: '21',
    //    'ATK SPD': '1.2',
    //    'HITS PER ATTACK': '1',
    //    'RUSH MULTIPLIER': '0',
    //    AOE: 'FALSE',
    //    'ATK SPD AIR': '0',
    //    'EFFECT RANGE': '0',
    //    REACH: 'Long',
    //    SEARCH: 'Wide',
    //    'EVOLVE TIME': '0',
    //    EVOLUTION: '',
    //    ISFINALEVOLUTION: '',
    //    LEADER: 'FALSE',
    //    'LEADER HP': '0',
    //    'LEADER ATK': '0',
    //    'LEADER ATK SPD': '0',
    //    'LEADER REACH': '0',
    //    'LEADER RANGE': '0',
    //    BUILDING: 'FALSE',
    //    'BUILDING DURATION': '0',
    //    'BUILDING UNIT HP': '0',
    //    'BUILDING UNIT ATK': '0',
    //    'ENERGY GENERATION': '0',
    //    'BURN TIMER': '0',
    //    'RECOVERY AMOUNT': '0',
    //    'SELF RECOVERY': '0',
    //    'ACID DMG': '0',
    //    'SLOW TIME': '0',
    //    'STUN TIME': '0',
    //    'BURN DMG': '0',
    //    'TELEPORT TIME': '0',
    //    'SPD DECREASE': '0',
    //    'DIGGING DMG': '0',
    //    INFO: '',
    //    NOTICE: ''
    
    unitID = random.id(8)

    data = {
        id: unitID,
        name: unit['Unit Name'],
        aliases: unit['ALIASES'].split(", "),
        emoji: unit['EMOJI'],
        rarity: Number(unit['RARITY']),
        unit: {
            health: Number(unit['HP']),
            attack: Number(unit['ATK']),
            attackSpeed: Number(unit['ATK SPD']),
            hitsPerAttack: Number(unit['HITS PER ATTACK']),
            rushMultiplier: Number(unit['RUSH MULTIPLIER']),
            aoe: unit['AOE'],
            attackSpeedAir: Number(unit['ATK SPD AIR']),
            reach: unit['REACH'],
            search: unit['SEARCH'],
        },
    }

    if (unit['LEADER'] == 'TRUE') {
        data.leader = {
            health: Number(unit['LEADER HP']),
            attack: Number(unit['LEADER ATK']),
            attackSpeed: Number(unit['LEADER ATK SPD']),
            reach: unit['LEADER REACH'],
            range: unit['LEADER RANGE'],
        }
    }


    if (unit['EVOLUTION'] != '') {
        data.evolutions = {
            evolveTime: Number(unit['EVOLVE TIME']),
            evolutions: unit['EVOLUTION'],
            isFinalEvolution: unit['ISFINALEVOLUTION'],
        }
    }


if (unit['BUILDING'] == 'TRUE') {
    data.building = {
        duration: Number(unit['BUILDING DURATION']),
        unit: {
            health: Number(unit['BUILDING UNIT HP']),
            attack: Number(unit['BUILDING UNIT ATK']),
        }
    }
}


console.log(data)
db.set(`unit.data.${unitID}`, data)

}