const search = require('./search.js');
const cache = require('./cache.js');
const db = require('./database.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');

exports.getUnitEmbed = async function (unit, level) {
  // console.log(unit, level);
  db.add(`stats.uses`)
  startTime = performance.now();
  level++;
  // console.log(unit['Unit Name'])
  if (cache.get(`${unit['Unit Name']}_${level}`)) {
    endTime = performance.now();
    console.log(`${unit['Unit Name']} took ${endTime - startTime}ms`);
    return await cache.get(`${unit['Unit Name']}_${level}`);
  }
  var msg = []

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
      "1-10": "13",
      "10-20": "10",
      "20-30": "12",
      "30-40": "0.5",
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


  i = 1;
  bl = i;
  // console.log(unit)
  unitHealth = Number(unit.HP);
  unitAttack = Number(unit.ATK);
  unitLeaderHealth = Number(unit['LEADER HP']);
  unitLeaderAttack = Number(unit['LEADER ATK']);
  unitRarity = Number(unit.RARITY);
  unitDigDmg = Number(unit['DIGGING DMG']);
  rushDmg = Number(unit['RUSH DMG']);
  dmgBoost = Number(unit['DMG INCREASE'])
  recoveryRate = Number(unit['RECOVERY RATE'])
  attackSpeed = Number(unit['ATK SPD']);
  transferTime = Number(unit['TELEPORT TIME']);
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
    msg.push(`${maxLevel} is max level for ${unitRarity} star units`)
  }

  var spawnedUnitAttack
  var spawnedUnitHP
  if (unit.BUILDING === "TRUE") {
    spawnedUnitHP = Number(unit['BUILDING UNIT HP'])
    spawnedUnitAttack = Number(unit['BUILDING UNIT ATK'])
  }
  if (unitRarity == 1) {
    costChart = oneStarCost;
  }
  if (unitRarity == 2) {
    costChart = twoStarCost;
  }
  if (unitRarity == 3) {
    costChart = threeStarCost;
  }
  if (unitRarity == 4) {
    costChart = fourStarCost;
  }

  while (i < level) {
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
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["1-10"] || 0
    }

    if (inRange(bl, 5, 9)) {
      var percent = upgradePercent[unitRarity]["5-10"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["1-10"] || 0
    }
    if (inRange(bl, 10, 14)) {
      var percent = upgradePercent[unitRarity]["10-15"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["10-20"] || 0
    }

    if (inRange(bl, 15, 19)) {
      var percent = upgradePercent[unitRarity]["15-20"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["10-20"] || 0
    }
    if (inRange(bl, 20, 24)) {
      var percent = upgradePercent[unitRarity]["20-25"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["20-30"] || 0
    }
    if (inRange(bl, 25, 29)) {
      var percent = upgradePercent[unitRarity]["25-30"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["20-30"] || 0
    }
    if (inRange(bl, 30, 40)) {
      var percent = upgradePercent[unitRarity]["31-40"];
      var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["30-40"] || 0
    }

    var factor = percent / 100;
    var leaderFactor = leaderPercent / 100;
    bl++;
    i++;
    if (bl > level - 1) {

    } else {
      addedHP = Math.ceil(unitHealth * factor);
      addedAttack = Math.ceil(unitAttack * factor);

      addedLeaderHP = Math.ceil(unitLeaderHealth * leaderFactor);
      addedLeaderAttack = Math.ceil(unitLeaderAttack * leaderFactor);

      addedSpawnedUnitAttack = Math.ceil(spawnedUnitAttack * factor);
      addedSpawnedUnitHP = Math.ceil(spawnedUnitHP * factor);

      addedDigDmg = Math.ceil(unitDigDmg * factor);
      addedrecoveryRate = Math.ceil(recoveryRate * factor);


      unitHealth = unitHealth + addedHP;
      unitAttack = unitAttack + addedAttack;

      unitLeaderHealth = unitLeaderHealth + addedLeaderHP;
      unitLeaderAttack = unitLeaderAttack + addedLeaderAttack;

      spawnedUnitAttack = spawnedUnitAttack + addedSpawnedUnitAttack;
      spawnedUnitHP = spawnedUnitHP + addedSpawnedUnitHP;

      unitDigDmg = unitDigDmg + addedDigDmg;
      recoveryRate = recoveryRate + addedrecoveryRate;

      transferTime = transferTime - transferTimeDecrease;

    }

  }
  if (hitsPerAttack > 1) {
    msg.push(`This unit hits ${hitsPerAttack} times per attack`)
  }
  if (msg.length > 0) {
    msg = `\`\`\`${msg.join('\n')}\`\`\``
  }
  const unitEmbed = new MessageEmbed();
  unitEmbed.setTitle(`Unit Calculator`);
  unitEmbed.setColor('#ffb33c');
  unitEmbed.setDescription(`**Unit**  \`${unit['Unit Name']}\`\n**Level**  \`${i - 1}\`\n${msg}`);
  unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/e_sharpen,h_300,w_300,c_fit,c_pad,b_rgb:ffb33c/v1644991354/gbl/${unit['Unit Name'].replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.webp`)



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
      unitStats.push(`**Damage per Attack** \`${(unitAttack * hitsPerAttack).toLocaleString()}\` | **DPS** \`${((unitAttack * hitsPerAttack)/attackSpeed).toLocaleString()}\``)
    }

  }


  if (unit['Unit Name'] === "Godzilla 21") {
    unitStats.push(`**Attack at __3.1__ Seconds** \`${(unitAttack).toLocaleString()}\` | **DPS** \`${parseInt(Math.abs(1 / attackSpeed) * unitAttack).toLocaleString()}\`
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

  if (recoveryRate > 0) {
    if (!unit['Unit Name'] === "Psychic Chorus") return
    unitStats.push(`**Recovery Rate** Exact recovery rate per level is currently unknown, please share in the <#875214614416224266> channel if you know!`)
    // unitStats.push(`**Recovery Rate** \`${recoveryRate.toLocaleString()}\``)

  }

  if (transferTime > 0) {
    // unitStats.push(`**Transfer Time** \`${transferTime.toLocaleString()}\``)
  }

  if (unitStats.length > 0) {
    unitEmbed.addField(`__Unit Stats__`, `${unitStats.join('\n')}`);
  }

  if (unit.LEADER === 'TRUE') {
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




  if (level - 2 == 0) {
    nextLevel = costChart[level - 1] || `Data not found for level ${level}`
    upgradeData.push(`**Next Level** \`${nextLevel.toLocaleString()}\` <:coins:943379224163672074>`)
  }

  if (level - 1 === maxLevel) {
    prevLevel = costChart[level - 2] || `Data not found for level ${level - 2}`
    upgradeData.push(`**Previous Level** \`${prevLevel.toLocaleString()}\` <:coins:943379224163672074>`)
  }

  if (level - 1 != maxLevel && level - 2 !== 0) {
    prevLevel = costChart[level - 2] || `Data not found for level ${level - 2}`
    nextLevel = costChart[level - 1] || `Data not found for level ${level}`
    upgradeData.push(`**Previous Level** \`${prevLevel.toLocaleString()}\` <:coins:943379224163672074>`)
    upgradeData.push(`**Next Level** \`${nextLevel.toLocaleString()}\` <:coins:943379224163672074>`)
  }

  if (upgradeData.length > 0) {
    unitEmbed.addField(`__Upgrade Cost__`, `${upgradeData.join('\n')}`);
  }


  cache.set(`${unit['Unit Name']}_${level}`, unitEmbed, 0);
  endTime = performance.now();
  console.log(`${unit['Unit Name']} took ${endTime - startTime}ms`);
  return unitEmbed;
};




function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
}




const oneStarCost = [0, 20, 80, 120, 200, 300, 400, 500, 600, 800, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 12000, 13500, 15000, 16500, 18000, 19500, 21000, 22500, 24000, 27000, 30000, 33000, 33000, 36000, 36000, 39000, 39000, 42000, 42000, 45000, 45000]
const twoStarCost = [0, 50, 200, 300, 400, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 11900, 13600, 15300, 17000, 19125, 21250, 23375, 25500, 29750, 34000, 35700, 37400]
const threeStarCost = [0, 200, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 10500, 14000, 15750, 17500, 19250, 21000, 22750, 24500, 29750, 35000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000]
const fourStarCost = [0, 2500, 2500, 2500, 2500, 5000, 5000, 5000, 5000, 5000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 9000, 20000, 20000, 20000, 20000, 20000, 25000, 25000, 25000, 25000, 25000]