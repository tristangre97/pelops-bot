const search = require('./search.js');
const cache = require('./cache.js');
const db = require('./database.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Interaction
} = require('discord.js');

exports.getUnitEmbed = async function (unit, level) {


  db.add(`stats.uses`)
  db.add(`unitStats.${unit['Unit Name']}`)
  var unitData = []
  startTime = performance.now();
  level++;
  // console.log(unit['Unit Name'])
  const unitLevelUpData = []
  if (cache.get(`${unit['Unit Name']}_${level}`)) {
    endTime = performance.now();
    console.log(`${unit['Unit Name']} took ${endTime - startTime}ms`);
    return await cache.get(`${unit['Unit Name']}_${level}`);
  }
  var msg = []
  var levelMsg = ''
  var attackMsg = ''

  const upgradePercent = {
    1: {
      "1-5": "20",
      "5-10": "10",
      "10-15": "15",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
    },
    2: {
      "1-5": "20",
      "5-10": "10",
      "10-15": "15",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
    },
    3: {
      "1-5": "12",
      "5-10": "11",
      "10-15": "11",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
    },

    4: {
      "1-5": "30",
      "5-10": "3",
      "10-15": "1",
      "15-20": "1",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
    },
  };

  const leaderUpgradePercent = {
    3: {
      "1-10": "16",
      "10-20": "5",
      "20-30": "16",
      "30-40": "2",
    },

    4: {
      "1-10": "2",
      "10-20": "3",
      "20-30": "2",
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
    "2" : 50,
    "3" : 33.33,
    "4" : 50,
  }
  //  +20/10/15/2/0.5%

  var psychicChorusUpgradePercent = {
    "1-5": "10",
    "5-10": "20",
    "10-15": "15",
    "15-20": "2",
    "25-30": "0.5",
    "31-40": "0.5",
  }

  i = 1;
  bl = i;
  unitHealth = Number(unit.HP);
  unitAttack = Number(unit.ATK);
  unitLeaderHealth = Number(unit['LEADER HP']);
  unitLeaderAttack = Number(unit['LEADER ATK']);
  unitRarity = Number(unit.RARITY);
  unitCost = Number(unit.COST);
  unitDigDmg = Number(unit['DIGGING DMG']);
  rushDmg = Number(unit['RUSH DMG']);
  dmgBoost = Number(unit['DMG INCREASE'])
  recoveryAmount = Number(unit['RECOVERY AMOUNT'])
  attackSpeed = Number(unit['ATK SPD']);
  transferTime = Number(unit['TELEPORT TIME']);


  unitNotice = unit['NOTICE'];
  var transferTimeDecrease;
  var hitsPerAttack = Number(unit['HITS PER ATTACK']);
  var unitStats = []

  if (unit['DMG INCREASE']) dmgBoost = Math.abs(unit['DMG INCREASE'].replaceAll('%', ''))



  if (unitRarity == "4") {
    maxLevel = 30;
  } else {
    maxLevel = 40;
  }

  if (level - 1 >= maxLevel) {
    level = maxLevel + 1;
    // msg.push(`${maxLevel} is max level for ${unitRarity} star units`)
    levelMsg = `**MAX LEVEL**`
  }

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
  
  while (i < level) {
    // console.log(`Getting data for ${unit['Unit Name']} ${i}`)
    if (inRange(bl, 0, 1)) {
      transferTimeDecrease = 0.16
    }
    if (inRange(bl, 2, 4)) {
      transferTimeDecrease = 0.15
    }
    if (inRange(bl, 5, 9)) {
      transferTimeDecrease = 0.14
    }
    if (inRange(bl, 10, 14)) {
      transferTimeDecrease = 0.13
    }

    if (inRange(bl, 0, 4)) {
      var percent = upgradePercent[unitRarity]["1-5"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["1-10"] || 0;
      var recoveryPercent = psychicChorusUpgradePercent?.["1-5"] || 0;
    }

    if (inRange(bl, 5, 9)) {
      var percent = upgradePercent[unitRarity]["5-10"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["1-10"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["5-10"] || 0;
    }
    if (inRange(bl, 10, 14)) {
      var percent = upgradePercent[unitRarity]["10-15"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["10-20"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["10-15"] || 0;
    }

    if (inRange(bl, 15, 19)) {
      var percent = upgradePercent[unitRarity]["15-20"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["10-20"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["15-20"] || 0;
    }
    if (inRange(bl, 20, 24)) {
      var percent = upgradePercent[unitRarity]["20-25"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["20-30"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["20-25"] || 0;
    }
    if (inRange(bl, 25, 29)) {
      var percent = upgradePercent[unitRarity]["25-30"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["20-30"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["25-30"] || 0;
    }
    if (inRange(bl, 30, 40)) {
      var percent = upgradePercent[unitRarity]["31-40"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["30-40"] || 0
      var recoveryPercent = psychicChorusUpgradePercent?.["31-40"] || 0;
    }

    var factor = percent / 100;
    var leaderFactor = leaderPercent / 100;
    var recoveryFactor = recoveryPercent / 100;
    bl++;
    i++;
    if (bl > level - 1) {
      // console.log(`${unit['Unit Name']} is finished`)
    } else {
      addedHP = Math.ceil(unitHealth * factor);
      addedAttack = Math.ceil(unitAttack * factor);

      addedLeaderHP = Math.ceil(unitLeaderHealth * leaderFactor);
      addedLeaderAttack = Math.ceil(unitLeaderAttack * leaderFactor);

      addedSpawnedUnitAttack = Math.ceil(spawnedUnitAttack * factor);
      addedSpawnedUnitHP = Math.ceil(spawnedUnitHP * factor);

      addedDigDmg = Math.ceil(unitDigDmg * factor);

      addedRecoveryAmount = Math.ceil(recoveryAmount * recoveryFactor);

      unitHealth = unitHealth + addedHP;
      unitAttack = unitAttack + addedAttack;

      

      unitLeaderHealth = unitLeaderHealth + addedLeaderHP;
      unitLeaderAttack = unitLeaderAttack + addedLeaderAttack;

      spawnedUnitAttack = spawnedUnitAttack + addedSpawnedUnitAttack;
      spawnedUnitHP = spawnedUnitHP + addedSpawnedUnitHP;

      unitDigDmg = unitDigDmg + addedDigDmg;

      transferTime = transferTime - transferTimeDecrease;

      recoveryAmount = recoveryAmount + addedRecoveryAmount;

    }
    if (attackSpeed == 0) attackSpeed = 1
      var attacksPerSecond = Math.abs(1 / attackSpeed);
      var dps = parseInt(attacksPerSecond * unitAttack)

      if (hitsPerAttack > 1) {
        dps = parseInt((unitAttack * hitsPerAttack)/attackSpeed)
      }

      unitAttackBoosted = Math.ceil(unitAttack + (unitAttack * dmgBoost / 100))
      var dpsBoosted = parseInt(attacksPerSecond * unitAttackBoosted)
      unitLevelData = {
        "Name": unit['Unit Name'],
        "Level": bl,
        "Rarity": unitRarity,
        "Cost": unitCost,
        "HP": unitHealth,
        "ATK": unitAttack,
        "HitsPerAttack": hitsPerAttack,
        "DMGBoost": dmgBoost,
        "ATKBoosted": unitAttackBoosted,
        "DPS": dps,
        "DPSBoosted": dpsBoosted,
      }
    
      unitData.push(unitLevelData)
  }
  if (hitsPerAttack > 1) {
    attackMsg = `\`This unit hits ${hitsPerAttack} times per attack\``
  }
  if (msg.length > 0) {
    msg = `\`\`\`${msg.join('\n')}\`\`\``
  }
  const unitEmbed = new MessageEmbed();
  unitEmbed.setTitle(`Unit Calculator`);
  unitEmbed.setColor('#ffb33c');
  unitEmbed.setDescription(`**Unit**  ${unit['EMOJI']} \`${unit['Unit Name']}\`\n**Level**  \`${i - 1}\` ${levelMsg}\n${msg}`);
  unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/e_sharpen,h_300,w_300,c_fit,c_pad,b_rgb:ffb33c/v1654043653/gbl/${unit['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}`)



  if (unitHealth > 0) {
    unitStats.push(`**HP** \`${unitHealth.toLocaleString()}\``)
  }

  if (unitAttack > 0) {
    if (attackSpeed == 0) attackSpeed = 1
    var attacksPerSecond = Math.abs(1 / attackSpeed);
    
    var dps = parseInt(attacksPerSecond * unitAttack)




    if (dmgBoost > 0) {
      unitAttackBoosted = Math.ceil(unitAttack + (unitAttack * dmgBoost / 100))
      var dpsBoosted = parseInt(attacksPerSecond * unitAttackBoosted)

      unitStats.push(`**Attack** \`${unitAttack.toLocaleString()}\` | **DPS** \`${dps.toLocaleString()}\``)
      unitStats.push(`**Buffed** \`${unitAttackBoosted.toLocaleString()}\` | **DPS** \`${dpsBoosted.toLocaleString()}\``)
    } else {

      unitStats.push(`**Attack** \`${unitAttack.toLocaleString()}\` | **DPS** \`${dps.toLocaleString()}\``)

    }

    if (hitsPerAttack > 1) {
      dps = parseInt((unitAttack * hitsPerAttack)/attackSpeed)
      unitStats.push(`<:pelops_alert:983097178513895544> ${attackMsg}\n**Damage per Attack** \`${(unitAttack * hitsPerAttack).toLocaleString()}\` | **DPS** \`${((unitAttack * hitsPerAttack)/attackSpeed).toLocaleString()}\``)
    }

  }


  if (unit['Unit Name'] === "Godzilla 21") {
    unitStats.push(`<:pelops_alert:983097178513895544> \`Godzilla 21's attack is boosted every 3.1 seconds\`
**Attack at __3.1__ Seconds** \`${(unitAttack).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / attackSpeed) * unitAttack).toLocaleString()}\`
**Attack at __6.2__ Seconds** \`${Math.ceil(unitAttack * 4).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / 6.2) * Math.ceil(unitAttack * 4)).toLocaleString()}\`
**Attack at __9.3__ Seconds** \`${Math.ceil(unitAttack * 13).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / 9.3) * Math.ceil(unitAttack * 13)).toLocaleString()}\`
**Attack at __12.4__ Seconds** \`${Math.ceil(unitAttack * 40).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / 12.4) * Math.ceil(unitAttack * 40)).toLocaleString()}\`        
    `)
  }

  if (unitDigDmg > 0) {
    // unitStats.push(`**Burrow Damage** \`${unitDigDmg.toLocaleString()}\``)
  }
  if (rushDmg > 0) {
    rushMultipler = 1;
    if (unit['Unit Name'] === "King Caesar") rushMultipler = 3
    if (unit['Unit Name'] === "Mothra Leo") rushMultipler = 2

    rushDmg = Math.ceil(unitAttack * rushMultipler)
    unitStats.push(`**Rush Damage** \`${rushDmg.toLocaleString()}\``)
  }
  if (recoveryAmount > 0) {
    if (!unit['Unit Name'] === "Psychic Chorus") return
    unitStats.push(`**Recovery Rate** Exact recovery rate per level is currently unknown, please share in the <#875214614416224266> channel if you know!`)
    // unitStats.push(`**Recovery Rate** \`${recoveryAmount.toLocaleString()}\``)

  }

  if (transferTime > 0) {
    unitStats.push(`**Transfer Time** \`${transferTime.toLocaleString()}\``)
  }

  if (unit['Unit Name'] === "Burning Godzilla") {
    expireDmgOne = Number(unitAttack);
    expireDmgTwo = Math.floor(expireDmgOne+(expireDmgOne*(burnUpgradePercent['2']/100)));
    expireDmgThree = Math.ceil(expireDmgTwo+(expireDmgTwo*(burnUpgradePercent['3']/100)));
    expireDmgFour = Math.ceil(expireDmgThree+(expireDmgThree*(burnUpgradePercent['4']/100)));


    unitStats.push(`**Expire Damage 1** \`${expireDmgOne}\``)
    unitStats.push(`**Expire Damage 2** \`${expireDmgTwo}\``)
    unitStats.push(`**Expire Damage 3** \`${expireDmgThree}\``)
    unitStats.push(`**Expire Damage 4** \`${expireDmgFour}\``)
  }

  if (unitStats.length > 0) {
    unitEmbed.addField(`__Unit Stats__`, `${unitStats.join('\n')}`);
  }

  LeaderStatsData = 'unfinished'

  if (unit.LEADER === 'TRUE' && LeaderStatsData == 'finished') {
    unitEmbed.addField(`__Leader Stats__`, `
__**UNFINISHED**__
Exact stat upgrade percents are currently unknown, please share in the <#875214614416224266> channel if you know!
\`(Please include player level)\`
**HP** \`${unitLeaderHealth.toLocaleString()}\`
**Attack** \`${unitLeaderAttack.toLocaleString()}\`
`);
  }

  if (unit.BUILDING === "TRUE") {
    unitEmbed.addField(`__Spawned Unit Stats__`, `
**HP** \`${spawnedUnitHP.toLocaleString()}\`
**Attack** \`${spawnedUnitAttack.toLocaleString()}\`
    `);
    // unitEmbed.addField(`HP`, `${spawnedUnitHP.toLocaleString()}`);
    // unitEmbed.addField(`Spawned Unit Attack`, `${spawnedUnitAttack.toLocaleString()}`);
  }
  if (level < 1) level = 1
  if (level - 1 > maxLevel) level = maxLevel
  // console.log(level)
  upgradeData = []
  requiredPieceData = []



  if (level - 2 == 0) {
    nextLevel = costChart[level - 1] || `Data not found for level ${level}`
    upgradeData.push(`**Next Level** \`${nextLevel.toLocaleString()}\` <:coins:943379224163672074> \`(${getTotalCost(level - 1, costChart)} Total)\``)

    nextLevelPieceCost = pieceChart[level - 1] || `Data not found for level ${level}`
    requiredPieceData.push(`**Next Level** \`${nextLevelPieceCost.toLocaleString()}\` \`(${getTotalCost(level - 1, pieceChart)} Total)\``)

  }

  if (level - 1 === maxLevel) {
    prevLevel = costChart[level - 2] || `Data not found for level ${level - 2}`
    upgradeData.push(`**Previous Level** \`${prevLevel.toLocaleString()}\` <:coins:943379224163672074> \`(${getTotalCost(level - 2, costChart)} Total)\``)

    prevLevelPieceCost = pieceChart[level - 2] || `Data not found for level ${level - 2}`
    requiredPieceData.push(`**Previous Level** \`${prevLevelPieceCost.toLocaleString()}\` \`(${getTotalCost(level - 1, pieceChart)} Total)\``)
  }

  if (level - 1 != maxLevel && level - 2 !== 0) {
    prevLevel = costChart[level - 2] || `Data not found for level ${level - 2}`
    nextLevel = costChart[level - 1] || `Data not found for level ${level}`
    upgradeData.push(`**Previous Level** \`${prevLevel.toLocaleString()}\` <:coins:943379224163672074> \`(${getTotalCost(level - 2, costChart)} Total)\``)
    upgradeData.push(`**Next Level** \`${nextLevel.toLocaleString()}\` <:coins:943379224163672074> \`(${getTotalCost(level - 1, costChart)} Total)\``)

    prevLevelPieceCost = pieceChart[level - 2] || `Data not found for level ${level - 2}`
    nextLevelPieceCost = pieceChart[level - 1] || `Data not found for level ${level}`
    requiredPieceData.push(`**Previous Level** \`${prevLevelPieceCost.toLocaleString()}\` \`(${getTotalCost(level - 2, pieceChart)} Total)\``)
    requiredPieceData.push(`**Next Level** \`${nextLevelPieceCost.toLocaleString()}\` \`(${getTotalCost(level - 1, pieceChart)} Total)\``)
  }

  if (upgradeData.length > 0) {
    unitEmbed.addField(`__Upgrade Cost__`, `${upgradeData.join('\n')}`);
  }
  if (requiredPieceData.length > 0) {
    unitEmbed.addField(`__Required Pieces__`, `${requiredPieceData.join('\n')}`);
  }

  if(unitNotice.length > 0) {
    unitEmbed.addField(`__Notice__`, `\`\`\`${unitNotice}\`\`\``);
  }

  var returnData = {
    embed: unitEmbed,
    unitData: unitData,
  }

  cache.set(`${unit['Unit Name']}_${level}`, returnData, 0);
  endTime = performance.now();
  console.log(`${unit['Unit Name']} took ${endTime - startTime}ms`);




// console.log(returnData)

  return returnData;
};




function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
}


const oneStarCost = [0, 20, 80, 120, 200, 300, 400, 500, 600, 800, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 12000, 13500, 15000, 16500, 18000, 19500, 21000, 22500, 24000, 27000, 30000, 33000, 33000, 36000, 36000, 39000, 39000, 42000, 42000, 45000, 45000]
const twoStarCost = [0, 50, 200, 300, 400, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 11900, 13600, 15300, 17000, 19125, 21250, 23375, 25500, 29750, 34000, 35700, 37400, 39100, 40800, 42500, 44200, 45900, 47600, 49300, 51000]
const threeStarCost = [0, 200, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 10500, 14000, 15750, 17500, 19250, 21000, 22750, 24500, 29750, 35000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000]
const fourStarCost = [0, 2500, 2500, 2500, 2500, 5000, 5000, 5000, 5000, 5000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 20000, 20000, 20000, 20000, 20000, 25000, 25000, 25000, 25000, 25000]


const oneStarPieces = [0, 2, 4, 6, 10, 15, 20, 25, 30, 40, 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 900, 1000, 1100, 1100, 1200, 1200, 1300, 1300, 1400, 1400, 1500, 1500]
const twoStarPieces = [0, 2, 4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 225, 250, 275, 300, 350, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600]
const threeStarPieces = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 45, 50, 55, 60, 65, 70, 85, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
const fourStarPieces = [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5]

function getTotalCost(level, array) {
  totalArray = array.slice(0, level + 1)
  total = totalArray.reduce((a, b) => a + b, 0)
  return total.toLocaleString()
}


// const twoStarCost = [0, 50, 200, 300, 400, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 11900, 13600, 15300, 17000, 19125, 21250, 23375, 25500, 29750, 34000, 35700, 37400]
// const threeStarCost = [0, 200, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 10500, 14000, 15750, 17500, 19250, 21000, 22750, 24500, 29750, 35000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000]
// const fourStarCost = [0, 2500, 2500, 2500, 2500, 5000, 5000, 5000, 5000, 5000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 20000, 20000, 20000, 20000, 20000, 25000, 25000, 25000, 25000, 25000]