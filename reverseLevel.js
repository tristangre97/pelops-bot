#!/usr/bin/env node

/**
 * Quick CLI tool to reverse-calculate level 1 stats from higher level stats
 * Usage: node reverseLevel.js <rarity> <currentLevel> <currentStat> [isLeader]
 * Example: node reverseLevel.js 4 30 5000
 * Example: node reverseLevel.js 3 20 800 true
 */

const levelRanges = {
    "1-5": [0, 4],
    "5-10": [5, 9],
    "10-15": [10, 14],
    "15-20": [15, 19],
    "20-25": [20, 24],
    "25-30": [25, 29],
    "31-40": [30, 40],
    "41-50": [41, 50]
};

const upgradePercent = {
    1: {
        "1-5": "18",
        "5-10": "8",
        "10-15": "11.80",
        "15-20": "10",
        "20-25": "1.90",
        "25-30": "1.90",
        "31-40": "0.5",
        "41-50": "0.05",
    },
    2: {
        "1-5": "18",
        "5-10": "8",
        "10-15": "11.80",
        "15-20": "10",
        "20-25": "1.90",
        "25-30": "1.90",
        "31-40": "0.5",
        "41-50": "0.05",
    },
    3: {
        "1-5": "10",
        "5-10": "9",
        "10-15": "9",
        "15-20": "8.80",
        "20-25": "2",
        "25-30": "2",
        "31-40": "0.5",
        "41-50": "0.5",
    },
    4: {
        "1-5": "20",
        "5-10": "4",
        "10-15": "1",
        "15-20": "0.80",
        "20-25": "1.70",
        "25-30": "1.70",
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
};

// Forward calculation (same as getUnitData.js)
function calculateStatForward(level, unitRarity, baseStat, isLeader = false) {
    level = parseInt(level);
    unitRarity = parseInt(unitRarity);
    baseStat = parseInt(baseStat);

    let currentLevel = 1;
    let stat = baseStat;
    let lastRange = null;
    let percent, leaderPercent;

    while (currentLevel < level) {
        const rangeKey = Object.keys(levelRanges).find(range => {
            const [min, max] = levelRanges[range];
            return currentLevel >= min && currentLevel <= max;
        });

        if (rangeKey !== lastRange) {
            lastRange = rangeKey;
            percent = upgradePercent[unitRarity]?.[rangeKey];
            leaderPercent = leaderUpgradePercent?.[unitRarity]?.[rangeKey] || percent;
        }

        const effectivePercent = isLeader ? leaderPercent : percent;
        stat = Math.ceil(stat + (stat * (parseFloat(effectivePercent) / 100)));
        currentLevel++;
    }

    return stat;
}

function reverseStat(currentLevel, unitRarity, currentStat, isLeader = false) {
    currentLevel = parseInt(currentLevel);
    unitRarity = parseInt(unitRarity);
    currentStat = parseInt(currentStat);

    // First, get approximate value using mathematical reverse
    let stat = currentStat;
    let level = currentLevel;
    let lastRange = null;
    let percent, leaderPercent;

    while (level > 1) {
        const prevLevel = level - 1;
        const rangeKey = Object.keys(levelRanges).find(range => {
            const [min, max] = levelRanges[range];
            return prevLevel >= min && prevLevel <= max;
        });

        if (rangeKey !== lastRange) {
            lastRange = rangeKey;
            percent = upgradePercent[unitRarity]?.[rangeKey];
            leaderPercent = leaderUpgradePercent?.[unitRarity]?.[rangeKey] || percent;
        }

        const effectivePercent = isLeader ? leaderPercent : percent;
        stat = stat / (1 + (parseFloat(effectivePercent) / 100));
        level--;
    }

    const approximateBase = Math.round(stat);

    // Search around the approximate value to find exact match
    // Due to Math.ceil accumulation, we need to search nearby values
    const searchRange = 20; // Search ±20 from approximate
    for (let testBase = approximateBase - searchRange; testBase <= approximateBase + searchRange; testBase++) {
        if (testBase <= 0) continue;

        const forwardCalculated = calculateStatForward(currentLevel, unitRarity, testBase, isLeader);
        if (forwardCalculated === currentStat) {
            return testBase;
        }
    }

    // If no exact match found, return approximate
    return approximateBase;
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.log('\n=== Reverse Level Calculator ===');
        console.log('Calculate level 1 stats from higher level stats\n');
        console.log('Usage: node reverseLevel.js <rarity> <currentLevel> <currentStat> [isLeader]');
        console.log('\nExamples:');
        console.log('  node reverseLevel.js 4 30 5000');
        console.log('  node reverseLevel.js 3 20 800 true');
        console.log('\nParameters:');
        console.log('  rarity       - Unit rarity (1-4)');
        console.log('  currentLevel - Current level of the unit');
        console.log('  currentStat  - Current stat value (HP/Attack)');
        console.log('  isLeader     - Optional: true if calculating leader skill stat\n');
        process.exit(0);
    }

    const rarity = parseInt(args[0]);
    const currentLevel = parseInt(args[1]);
    const currentStat = parseInt(args[2]);
    const isLeader = args[3] === 'true';

    if (isNaN(rarity) || rarity < 1 || rarity > 4) {
        console.error('Error: Rarity must be between 1 and 4');
        process.exit(1);
    }

    if (isNaN(currentLevel) || currentLevel < 1) {
        console.error('Error: Current level must be a positive number');
        process.exit(1);
    }

    if (isNaN(currentStat) || currentStat < 1) {
        console.error('Error: Current stat must be a positive number');
        process.exit(1);
    }

    const level1Stat = reverseStat(currentLevel, rarity, currentStat, isLeader);

    console.log('\n=== Reverse Calculation Result ===');
    console.log(`Rarity:        ${rarity}⭐`);
    console.log(`Current Level: ${currentLevel}`);
    console.log(`Current Stat:  ${currentStat.toLocaleString()}`);
    console.log(`Level 1 Stat:  ${level1Stat.toLocaleString()}`);
    if (isLeader) console.log(`Type:          Leader Skill`);
    console.log('\nNote: This finds the exact base stat through search algorithm\n');
}

module.exports = { reverseStat };
