// Test script to verify upgrade cost calculations
const getUnitData = require('./utility/getUnitData.js');

async function test() {
    console.log('\n=== Testing Upgrade Cost Calculations ===\n');

    // Test for different rarities and levels
    const tests = [
        { rarity: 1, level: 10, name: '1-Star at Level 10' },
        { rarity: 2, level: 20, name: '2-Star at Level 20' },
        { rarity: 3, level: 30, name: '3-Star at Level 30' },
        { rarity: 4, level: 40, name: '4-Star at Level 40' },
    ];

    for (const test of tests) {
        console.log(`\n--- ${test.name} ---`);

        const cumulative = getUnitData.calculateCumulativeCosts(test.rarity, test.level);
        if (cumulative) {
            console.log(`Cumulative to Level ${test.level}:`);
            console.log(`  Total G-Energy: ${cumulative.totalCost.toLocaleString()}`);
            console.log(`  Total Pieces: ${cumulative.totalPieces.toLocaleString()}`);
        }

        const maxLevel = getUnitData.getMaxLevel(test.rarity);
        if (test.level < maxLevel) {
            const nextLevel = getUnitData.getUpgradeCostData(test.rarity, test.level + 1);
            if (nextLevel) {
                console.log(`\nNext Level (${test.level} → ${test.level + 1}):`);
                console.log(`  G-Energy: ${nextLevel.cost.toLocaleString()}`);
                console.log(`  Pieces: ${nextLevel.pieces.toLocaleString()}`);
            }
        }

        const maxCumulative = getUnitData.calculateCumulativeCosts(test.rarity, maxLevel);
        if (maxCumulative) {
            console.log(`\nMax Level (1 → ${maxLevel}):`);
            console.log(`  Total G-Energy: ${maxCumulative.totalCost.toLocaleString()}`);
            console.log(`  Total Pieces: ${maxCumulative.totalPieces.toLocaleString()}`);
        }
    }

    console.log('\n=== Test Complete ===\n');
}

test();
