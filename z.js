const unitDataJSON = require('./data/unitData.json');
const unitDataNew = {}
const fs = require('node:fs');

// "Battra Imago": {
//     "name": "Battra Imago",
//     "rarity": "4",
//     "cost": "5",
//     "aliases": [],
//     "emoji": "<:Battra_Imago:982860055449858098>",
//     "finalEvolution": true,
//     "unit": {
//       "hp": "653",
//       "attacks": [
//         {
//           "name": "Attack",
//           "attack": "173",
//           "attackSpeed": "2.1",
//           "hitsPerAttack": "1"
//         }
//       ]
//     },
//     "leader": { "hp": "5218", "attack": "289", "attackSpeed": "2.3" },
//     "evolutions": ["Battra Larva"]
//   },

// "Chibi Mechagodzilla and Chibi Godzilla": {
//     "name": "Chibi Mechagodzilla and Chibi Godzilla",
//     "type": "Duo",
//     "rarity": "4",
//     "cost": "6",
//     "aliases": [],
//     "emoji": "<:Kiryu_Kai:1038165791851421788>",
//     "units": [
//       {
//         "name": "Chibi Mechagodzilla",
//         "hp": "670",
//         "attacks": [
//           {
//             "name": "Attack",
//             "attack": "85",
//             "attackSpeed": "2.6",
//             "hitsPerAttack": "1",
//             "notes": "Enemy units hit by this attack are inflicted with Stun for 0.6 seconds."
//           }
//         ]
//       },
//       {
//         "name": "Chibi Godzilla",
//         "hp": "572",
//         "attacks": [
//           {
//             "name": "Attack",
//             "attack": "104",
//             "attackSpeed": "2.6",
//             "hitsPerAttack": "1",
//             "notes": "Enemy units hit by this attack are inflicted with Burning for 8 seconds."
//           }
//         ]
//       }
//     ],
//     "evolutions": []
//   },

async function main() {
    for (const unit in unitDataJSON) {

        const unitData = unitDataJSON[unit];
        const imageLink = `https://res.cloudinary.com/tristangregory/image/upload/v1689538433/gbl/${unitData.name.replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", "")}.png`
        const isImageValid = await fetch(imageLink, { method: 'HEAD' })

        if (!isImageValid.ok) {
            unitData.image = 'https://res.cloudinary.com/tristangregory/image/upload/v1645067926/gbl/pelops/pelops_error.png'
        } else {
            unitData.image = imageLink;
        }

        if (unitData.leader) {
            unitData.leader = {
                hp: parseInt(unitData.leader.hp),
                attacks: [
                    {
                        name: "Attack",
                        attack: parseInt(unitData.leader.attack),
                        attackSpeed: parseFloat(unitData.leader.attackSpeed),
                        hitsPerAttack: 1
                    }
                ]
            }
        }


        // Go through each attack and convert to integer
        if (unitData?.unit?.attacks) {
            unitData.unit.attacks = unitData.unit.attacks.map(attack => {
                return {
                    name: attack.name,
                    attack: parseInt(attack.attack),
                    attackSpeed: parseFloat(attack.attackSpeed),
                    hitsPerAttack: parseInt(attack.hitsPerAttack)
                }
            })
        } else {
            console.log(`${unitData.name} has no attacks`)
        }

        unitData.cost = parseInt(unitData.cost)
        unitData.rarity = parseInt(unitData.rarity)


        if (unitData.type != 'Duo') {
            // Convert hp to integer
            unitData.unit.hp = parseInt(unitData.unit.hp)

        } else {
            unitData.units = unitData.units.map(unit => {
                unit.hp = parseInt(unit.hp)
                unit.attacks = unit.attacks.map(attack => {
                    return {
                        name: attack.name,
                        attack: parseInt(attack.attack),
                        attackSpeed: parseFloat(attack.attackSpeed),
                        hitsPerAttack: parseInt(attack.hitsPerAttack)
                    }
                })
                return unit;
            })
        }


        unitDataNew[unit] = unitData
        console.log(unitData)

    }
    fs.writeFileSync('./data/unitDataNew.json', JSON.stringify(unitDataNew, null, 2));
}

main();