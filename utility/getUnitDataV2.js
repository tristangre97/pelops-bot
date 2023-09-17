const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

const unitDataFile = require('../data/unitData.json');
const unitDataMap = new Map();
unitDataFile.forEach((unit) => {
    unitDataMap.set(unit['Unit Name'], unit);
});


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


exports.get = async function (data) {

    var { id, user, time, guild, unit: { name, level, star_rank, apply_boost } } = data;

    const embed = new EmbedBuilder()
    const components = []

    unitData = unitDataMap.get(name);

    if (!unitData) {
        embed.setTitle(`Unit not found`)
        embed.setDescription(`Unit ${name} not found`)
        return {
            embed: embed,
            components: components
        }
    }

    currentLevel = 1

    let unitHealth = Number(unitData['HP'])
    let unitAttack = Number(unitData['ATK'])
    let unitLeaderHealth = Number(unitData['LEADER HP'])
    let unitLeaderAttack = Number(unitData['LEADER ATK'])
    const unitRarity = Number(unitData['RARITY'])


    start = performance.now();

    while(currentLevel < level) {

        if (inRange(currentLevel, 0, 4)) {
            var percent = upgradePercent[unitRarity]["1-5"];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["1-5"] || 0;
          }
      
          if (inRange(currentLevel, 5, 9)) {
            var percent = upgradePercent[unitRarity]["5-10"];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["5-10"] || 0
          }
          if (inRange(currentLevel, 10, 14)) {
            var percent = upgradePercent[unitRarity]["10-15"];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["10-15"] || 0
          }
      
          if (inRange(currentLevel, 15, 19)) {
            var percent = upgradePercent[unitRarity]["15-20"];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["15-20"] || 0
          }
          if (inRange(currentLevel, 20, 24)) {
            var percent = upgradePercent[unitRarity]["20-25"];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["20-25"] || 0
          }
          if (inRange(currentLevel, 25, 29)) {
            var percent = upgradePercent[unitRarity]["25-30"];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["25-30"] || 0
          }
          if (inRange(currentLevel, 30, 40)) {
            var percent = upgradePercent[unitRarity]["31-40"];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.["31-40"] || 0
          }

        unitHealth = Math.ceil(unitHealth + (unitHealth * (percent / 100)))
        unitAttack = calculateAttack(unitAttack, percent)
        unitLeaderHealth = Math.ceil(unitLeaderHealth + (unitLeaderHealth * (leaderPercent / 100)))
        unitLeaderAttack = Math.ceil(unitLeaderAttack + (unitLeaderAttack * (leaderPercent / 100)))
        currentLevel++;
    }



    end = performance.now();


    console.log(`
Health: ${unitHealth}
Attack: ${unitAttack}
Leader Health: ${unitLeaderHealth}
Leader Attack: ${unitLeaderAttack}
`);



    return unitData
}



function calculateAttack(attack, percent) {
    return Math.ceil(attack + (attack * (percent / 100)))
}



function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }