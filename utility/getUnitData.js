const cache = require('./cache.js');
const db = require('./database.js');
const unitBoosts = require('../data/boosts.json').BOOSTS;
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Interaction
} = require('discord.js');
const search = require('./search.js');
const mathjs = require('mathjs')


exports.getUnitEmbed = async function (unit, level, star_rank, unitBoost) {
  db.add(`stats.uses`)
  db.add(`unitStats.${unit['Unit Name']}`)
  startTime = performance.now();
  if (unitBoost) unitBoost = unitBoost.replaceAll("_", " ")
  var unitName = unit['Unit Name']
  var unitHealth = Number(unit.HP);
  var unitAttack = Number(unit.ATK);
  var unitLeaderHealth = Number(unit['LEADER HP']);
  var unitLeaderAttack = Number(unit['LEADER ATK']);
  var unitRarity = Number(unit.RARITY);
  var unitCost = Number(unit.COST);
  var rushMultiplier = Number(unit['RUSH MULTIPLIER']);
  var recoveryAmount = Number(unit['RECOVERY AMOUNT'])
  var attackSpeed = Number(unit['ATK SPD']);
  var leaderAttackSpeed = Number(unit['LEADER ATK SPD']) || 1;
  var transferTime = Number(unit['TELEPORT TIME']);
  var attackSpeedAir = Number(unit['ATK SPD AIR']);
  var acidDamage = Number(unit['ACID DMG']);
  var digDamage = Number(unit['DIGGING DMG']);
  var unitNotice = [];
  var transferTimeDecrease;
  var hitsPerAttack = Number(unit['HITS PER ATTACK']);

  level++;
  var star_rank = Number(star_rank) || 1;
  if (star_rank > 30) star_rank = 30;

  const maxLevel = (unitRarity < 4) ? 50 : 40;

  if (level - 1 >= maxLevel) {
    level = maxLevel + 1;
    levelMsg = `**MAX LEVEL**`
  }
  if (cache.get(`${unit['Unit Name']}_${level}_${star_rank}_${unitBoost}`)) {
    endTime = performance.now();
    console.log(`Level ${level-1} ${unit['Unit Name']} took ${endTime - startTime}ms (cached)`)
    return await cache.get(`${unit['Unit Name']}_${level}_${star_rank}_${unitBoost}`);
  }
  const unitEmbed = new EmbedBuilder();
  unitEmbed.setTitle(`${unit['Unit Name']} - Level __${level - 1}__`);
  unitEmbed.setColor('#ffb33c');

  var appliedBoosts = []
  var appliedBoostList = []
  var totalHPBonus = 0;
  var totalDmgBonus = 0;
  var totalLeaderHPBonus = 0;
  var totalLeaderDmgBonus = 0;
  var totalSpeedBonus = 0;
  const upgradePercent = {
    1: {
      "1-5": "20",
      "5-10": "10",
      "10-15": "15",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
      "41-50": "0.05",
    },
    2: {
      "1-5": "20",
      "5-10": "10",
      "10-15": "15",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
      "41-50": "0.05",
    },
    3: {
      "1-5": "12",
      "5-10": "11",
      "10-15": "11",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
      "41-50": "0.5",
    },

    4: {
      "1-5": "30",
      "5-10": "3",
      "10-15": "1",
      "15-20": "1",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
    },
  };

  const leaderUpgradePercent = {
    3: {
      "1-5": "16",
      "5-10": "5",
      "10-15": "8",
      "15-20": "16",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
      "41-50": "0.50",
    },

    4: {
      "1-5": "2",
      "5-10": "3",
      "10-15": "3",
      "15-20": "3",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
    },
  }

  var kidsUpgradePercent = {
    "1-5": "2",
    "5-10": "2",
    "10-15": "2",
    "15-20": "2",
    "20-25": "2",
    "25-30": "2",
    "31-40": "0.50",

  }

  var burnUpgradePercent = {
    "2": 50,
    "3": 33.33,
    "4": 50,
  }

  var psychicChorusUpgradePercent = {
    "1-5": "10",
    "5-10": "10",
    "10-15": "15",
    "15-20": "11",
    "25-30": "0.5",
    "31-40": "0.5",
  }

  i = 1;
  bl = i;

  var unitStats = []
  var leaderStats = []

  if (unit['DMG INCREASE']) dmgBoost = Math.abs(unit['DMG INCREASE'].replaceAll('%', ''))





  var spawnedUnitAttack
  var spawnedUnitHP
  if (unit.BUILDING === "TRUE") {
    spawnedUnitHP = Number(unit['BUILDING UNIT HP'])
    spawnedUnitAttack = Number(unit['BUILDING UNIT ATK'])
  }
  if (unitRarity == 1) {
    costChart = oneStarCost;
    pieceChart = oneStarPieces;
  }
  if (unitRarity == 2) {
    costChart = twoStarCost;
    pieceChart = twoStarPieces;
  }
  if (unitRarity == 3) {
    costChart = threeStarCost;
    pieceChart = threeStarPieces;
  }
  if (unitRarity == 4) {
    costChart = fourStarCost;
    pieceChart = fourStarPieces;
  }

  // Start stat calculation loop
  while (i < level) {
    // levelCalcStart = performance.now();

    // if (inRange(bl, 0, 1)) {
    //   transferTimeDecrease = 0.16
    // }
    // if (inRange(bl, 2, 4)) {
    //   transferTimeDecrease = 0.15
    // }
    // if (inRange(bl, 5, 9)) {
    //   transferTimeDecrease = 0.14
    // }
    // if (inRange(bl, 10, 14)) {
    //   transferTimeDecrease = 0.13
    // }

    if (inRange(bl, 0, 4)) {
      var percent = upgradePercent[unitRarity]["1-5"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["1-5"] || 0;
      var recoveryPercent = psychicChorusUpgradePercent?.["1-5"] || 0;
    }

    if (inRange(bl, 5, 9)) {
      var percent = upgradePercent[unitRarity]["5-10"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["5-10"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["5-10"] || 0;
    }
    if (inRange(bl, 10, 14)) {
      var percent = upgradePercent[unitRarity]["10-15"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["10-15"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["10-15"] || 0;
    }

    if (inRange(bl, 15, 19)) {
      var percent = upgradePercent[unitRarity]["15-20"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["15-20"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["15-20"] || 0;
    }
    if (inRange(bl, 20, 24)) {
      var percent = upgradePercent[unitRarity]["20-25"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["20-25"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["20-25"] || 0;
    }
    if (inRange(bl, 25, 29)) {
      var percent = upgradePercent[unitRarity]["25-30"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["25-30"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["25-30"] || 0;
    }
    if (inRange(bl, 30, 40)) {
      var percent = upgradePercent[unitRarity]["31-40"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["31-40"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["31-40"] || 0;
    }


    var factor = percent;
    var leaderFactor = leaderPercent;
    var recoveryFactor = recoveryPercent;
    bl++;
    i++;
    if (bl > level - 1) {

    } else {


      unitHealth = Math.ceil(mathjs.evaluate(`${unitHealth} + ${factor}%`));
      unitAttack = Math.ceil(mathjs.evaluate(`${unitAttack} + ${factor}%`));

      unitLeaderHealth = Math.ceil(mathjs.evaluate(`${unitLeaderHealth} + ${leaderFactor}%`));
      unitLeaderAttack = Math.ceil(mathjs.evaluate(`${unitLeaderAttack} + ${leaderFactor}%`));



      transferTime = transferTime - transferTimeDecrease;

      recoveryAmount = Math.ceil(mathjs.evaluate(`${recoveryAmount} + ${recoveryFactor}%`));

      acidDamage = Math.ceil(mathjs.evaluate(`${acidDamage} + ${factor}%`));
      digDamage = Math.round(mathjs.evaluate(`${digDamage} + ${factor}%`));

    }

  }
  // End stat calculation loop

  var unbuffedStats = {
    "HP": unitHealth,
    "ATK": unitAttack,
    "leaderHP": unitLeaderHealth,
    "leaderATK": unitLeaderAttack,
  }




  // Start apply star rank rewards

  if (star_rank > 1) {
    if (unitName.includes("Hedorah")) unitName = 'Hedorah'
    if (unitName.includes("Kamacurus")) unitName = 'Kamacurus + Swarm'
    if (unitName.includes("Shin")) unitName = 'Shin Godzilla'
    if (unitName.includes("Biollante")) unitName = 'Biollante'
    if (unitName.includes("Battra")) unitName = 'Battra'
    if (unitName.includes("Terrestris ")) unitName = 'Godzilla Ultima'

    if (unitName == 'Destoroyah Aggregate Form' || unitName == 'Destoroyah Flying Form' || unitName == 'Destoroyah Perfect Form') unitName = 'Destoroyah'

    var starRankResults = search.starRankSearch(unitName)
    if (starRankResults) {

      results = starRankResults
      // Leader HP
      // Leader Dmg
      i = 1
      for (item in results) {
        bonusType = results[item]
        if (i >= star_rank) {
        } else {
          if (bonusType.startsWith('HP')) {
            totalHPBonus = Math.abs(totalHPBonus + Number(bonusType.split('+')[1].trim().replace('%', '')))
          }
          if (bonusType.startsWith('Dmg')) {
            totalDmgBonus = Math.abs(totalDmgBonus + Number(bonusType.split('+')[1].trim().replace('%', '')))
          }
          if (bonusType.startsWith('Movement Spd')) {
            totalSpeedBonus = Math.abs(totalSpeedBonus + Number(bonusType.split('+')[1].trim().replace('%', '')))
          }
          if (bonusType.startsWith('Leader HP')) {
            totalLeaderHPBonus = Math.abs(totalLeaderHPBonus + Number(bonusType.split('+')[1].trim().replace('%', '')))
          }
          if (bonusType.startsWith('Leader DMG') || bonusType.startsWith('Leader Dmg')) {
            totalLeaderDmgBonus = Math.abs(totalLeaderDmgBonus + Number(bonusType.split('+')[1].trim().replace('%', '')))
          }
        }
        i++
      }
      unitHealth = Math.floor(mathjs.evaluate(`${unitHealth} + ${Number(totalHPBonus)}%`))
      unitAttack = Math.floor(mathjs.evaluate(`${unitAttack} + ${Number(totalDmgBonus)}%`))

      addedHealth = Math.floor(mathjs.evaluate(`${unitHealth} + ${Number(totalHPBonus)}%`)) - unbuffedStats.HP
      addedAttack = Math.floor(mathjs.evaluate(`${unitAttack} + ${Number(totalDmgBonus)}%`)) - unbuffedStats.ATK


      appliedBoosts.push(`**Star Rank** \`${star_rank}\`
╰HP Bonus \`${Math.round(10 * totalHPBonus) / 10}%\`
╰Attack Bonus \`${Math.round(10 * totalDmgBonus) / 10}%\`
╰Movement Speed Bonus \`${Math.round(10 * totalSpeedBonus) / 10}%\``)
      if (unit.LEADER == 'TRUE') {



        unitLeaderHealth = Math.floor(mathjs.evaluate(`${unitLeaderHealth} + ${Number(totalLeaderHPBonus)}%`))
        unitLeaderAttack = Math.floor(mathjs.evaluate(`${unitLeaderAttack} + ${Number(totalLeaderDmgBonus)}%`))

        addedUnitLeaderHealth = Math.floor(mathjs.evaluate(`${unitLeaderHealth} + ${Number(totalLeaderHPBonus)}%`)) - unbuffedStats.leaderHP
        addedUnitLeaderAttack = Math.floor(mathjs.evaluate(`${unitLeaderAttack} + ${Number(totalLeaderDmgBonus)}%`)) - unbuffedStats.leaderATK

        appliedBoosts.push(`╰Leader HP Bonus \`${Math.round(10 * totalLeaderHPBonus) / 10}%\`\n╰Leader Attack Bonus \`${Math.round(10 * totalLeaderDmgBonus) / 10}%\``)
      }


      appliedBoostList.push(`Star Rank: ${star_rank}`)
    } else {
      appliedBoosts.push(`\`\`\`This unit has no star rank rewards\`\`\``)
    }
  }
  // End apply star rank rewards





  // Start apply boosts
  if (unitBoost && unitBoost != 0) {
    boostData = unitBoosts[unitBoost]
    if (boostData.units && !boostData.units.includes(unitName)) {
      appliedBoosts.push(`\`\`\`This unit cannot benefit from the ${unitBoost} boost\`\`\``)

    } else {
      appliedBoosts.push(`**${unitBoost} Boost** ${boostData.emoji}\n╰Attack Boost \`${boostData.boost}%\``)
      appliedBoostList.push(`${unitBoost} Buff (${boostData.boost}%)`)

      unitAttack = mathjs.evaluate(`${unitAttack} + ${boostData.boost}%`)
    }

  }
  // End apply boosts



  if (unitHealth > 0) {
    unitStats.push(`**HP** \`${unitHealth.toLocaleString()}\``)
  }


  if (unitAttack > 0) {
    if (attackSpeed == 0) attackSpeed = 1

    if (hitsPerAttack > 1) {
      unitStats.push(`<:pelops_alert:983097178513895544> __**This unit hits \`${hitsPerAttack}\` times per attack**__`)
      unitStats.push(`**In-Game Stat** \`${unitAttack.toLocaleString()}\``)
      unitAttack = Math.floor(unitAttack * hitsPerAttack)

    }


    var attacksPerSecond = Math.abs(1 / attackSpeed);
    var dps = parseInt(attacksPerSecond * unitAttack)

    unitStats.push(`**Attack** \`${unitAttack.toLocaleString()}\` | **DPS** \`${dps.toLocaleString()}\``)

    if (rushMultiplier > 1) {
      rushAttack = Math.floor(unitAttack * rushMultiplier)
      unitStats.push(`**Rush Attack** \`${rushAttack.toLocaleString()}\``)
    }

    if (attackSpeedAir > 0) {
      var attacksPerSecondAir = Math.abs(1 / attackSpeedAir);
      var dpsAir = parseInt(attacksPerSecondAir * unitAttack)
      unitStats.push(`**Air Attack** \`${unitAttack.toLocaleString()}\` | **DPS** \`${dpsAir.toLocaleString()}\``)
    }

    if (acidDamage > 0) {
      unitStats.push(`**Acid Damage** \`${acidDamage.toLocaleString()}\``)
    }
    if (digDamage > 0) {
      // unitStats.push(`**Dig Damage** \`${Math.floor(digDamage).toLocaleString()}\``)
    }



  }


  if (unit['Unit Name'] === "Godzilla 21") {
    unitStats.push(`<:pelops_alert:983097178513895544> __**Godzilla 21's attack is boosted every 3.1 seconds**__
**Attack at __3.1__ Seconds** \`${(unitAttack).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / attackSpeed) * unitAttack).toLocaleString()}\`
**Attack at __6.2__ Seconds** \`${Math.ceil(unitAttack * 4).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / 6.2) * Math.ceil(unitAttack * 4)).toLocaleString()}\`
**Attack at __9.3__ Seconds** \`${Math.ceil(unitAttack * 13).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / 9.3) * Math.ceil(unitAttack * 13)).toLocaleString()}\`
**Attack at __12.4__ Seconds** \`${Math.ceil(unitAttack * 40).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / 12.4) * Math.ceil(unitAttack * 40)).toLocaleString()}\`        
    `)
  }




  if (transferTime > 0) {
    unitStats.push(`**Transfer Time** \`${transferTime.toLocaleString()}\``)
  }

  if (recoveryAmount > 0 && unitName == "Psychic Chorus") {
    // unitStats.push(`**Recovery Amount** \`${recoveryAmount.toLocaleString()}\``)
  }

  if (unit['Unit Name'] === "Burning Godzilla") {
    expireDmgOne = Number(unitAttack);
    expireDmgTwo = Math.floor(expireDmgOne + (expireDmgOne * (burnUpgradePercent['2'] / 100)));
    expireDmgThree = Math.ceil(expireDmgTwo + (expireDmgTwo * (burnUpgradePercent['3'] / 100)));
    expireDmgFour = Math.ceil(expireDmgThree + (expireDmgThree * (burnUpgradePercent['4'] / 100)));


    unitStats.push(`**Expire Damage 1** \`${expireDmgOne}\``)
    unitStats.push(`**Expire Damage 2** \`${expireDmgTwo}\``)
    unitStats.push(`**Expire Damage 3** \`${expireDmgThree}\``)
    unitStats.push(`**Expire Damage 4** \`${expireDmgFour}\``)
  }

  if (unitStats.length > 0) {
    unitEmbed.addFields({
      name: `__Unit Stats__`,
      value: `${unitStats.join('\n')}`,
      inline: false
    })
  }
  if (unit.LEADER == 'TRUE') {
    unitNotice.push(`Leader levels above 40/50 may not be accurate. If you have a leader at level 41+, please post in the <#875214614416224266> channel.`)

    var attacksPerSecond = Math.abs(1 / leaderAttackSpeed);
    var dps = parseInt(attacksPerSecond * unitLeaderAttack)

    unitEmbed.addFields({
      name: `__Leader Stats__`,
      value: `
**HP** \`${unitLeaderHealth.toLocaleString()}\`
**Attack** \`${unitLeaderAttack.toLocaleString()}\` | **DPS** \`${dps.toLocaleString()}\`
`,
      inline: false
    })
    unitEmbed.setFooter({ text: `To see leader ability use /leader_ability` })
  }

  if (unit.BUILDING === "TRUE") {

    unitEmbed.addFields({
      name: `__Spawned Unit Stats__`,
      value: `
**HP** \`${spawnedUnitHP.toLocaleString()}\`
**Attack** \`${spawnedUnitAttack.toLocaleString()}\`
`,
      inline: false
    })
  }
  if (level < 1) level = 1
  if (level - 1 > maxLevel) level = maxLevel
  // console.log(level)
  upgradeData = []
  requiredPieceData = []

  // <:coins:943379224163672074>
  // unit['EMOJI']

  var upgradeCostData = []

  // if (level <= maxLevel) {
  //   nextLevelPieceCost = pieceChart[level - 1] || `Data not found for level ${level}`
  //   upgradeCostData.push(`**G-Tokens** <:coins:943379224163672074> \`${(costChart[level - 1]).toLocaleString()}\``)
  //   upgradeCostData.push(`**Pieces** ${unit['EMOJI']} \`${(nextLevelPieceCost).toLocaleString()}\``)
  // } else {

  // }

  //   upgradeCostData.push(`
  // **Total G-Tokens** <:coins:943379224163672074> \`${getTotalCost(level - 2, costChart)}\`
  // **Total Pieces** ${unit['EMOJI']} \`${getTotalCost(level - 2, pieceChart)}\`
  //   `)



  // value: `${upgradeCostData.join('\n')}`,

  unitEmbed.addFields({
    name: `__Upgrade Costs__`,
    value: `Upgrade costs were recently changed, please wait until I get updated data.`,
    inline: false
  })


  if (unitNotice.length > 0) {
    unitEmbed.addFields({
      name: `__Notice__`,
      value: unitNotice.join('\n'),
      inline: false
    })
  }
  // var attacksPerSecond = Math.abs(1 / attackSpeed);
  // var dps = parseInt(attacksPerSecond * unitAttack)

  unitData = {
    "Name": unit['Unit Name'],
    "Level": bl - 1,
    "Rarity": unitRarity,
    "Cost": unitCost,
    "stats": {

    },
    "unitStats": {
      "HP": unitHealth,
      "ATK": unitAttack,
      "DPS": Math.floor(Math.abs(1 / attackSpeed) * unitAttack),
    },
    "leaderStats": {
      "HP": unitLeaderHealth,
      "ATK": unitLeaderAttack,
      "DPS": Math.floor(Math.abs(1 / leaderAttackSpeed) * unitLeaderAttack),
    },
    "HitsPerAttack": hitsPerAttack,
    "Boosts": appliedBoostList,
  }


  if (appliedBoosts.length > 0) {
    appliedBoosts.unshift(`__**Applied Buffs**__`)
    unitEmbed.setDescription(`${appliedBoosts.join(`\n`)}`);

  }
  unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/e_sharpen,h_300,w_300,c_fit,c_pad,b_rgb:ffb33c/v1667588389/gbl/${unit['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}`)


  var returnData = {
    embed: unitEmbed,
    unitData: unitData,
    unbuffedStats: unbuffedStats,
  }

  cache.set(`${unit['Unit Name']}_${level}_${star_rank}_${unitBoost}`, returnData, 0);
  endTime = performance.now();
  console.log(`Level ${level-1} ${unit['Unit Name']} took ${endTime - startTime}ms`)
  return returnData;
};




function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
}


const oneStarCost = []
const twoStarCost = []
const threeStarCost = []
const fourStarCost = []


const oneStarPieces = []
const twoStarPieces = []
const threeStarPieces = []
const fourStarPieces = []

function getTotalCost(level, array) {
  totalArray = array.slice(0, level + 1)
  total = totalArray.reduce((a, b) => a + b, 0)
  return total.toLocaleString()
}

