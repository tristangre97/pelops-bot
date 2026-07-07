// Test script to verify API response includes upgrade cost data
const getUnitData = require('./utility/getUnitData.js');

async function test() {
    console.log('\n=== Testing API Response with Upgrade Costs ===\n');

    // Test getting all data for Anguirus (2-star unit)
    const unitName = 'Anguirus';
    const apiResponse = await getUnitData.getAll(unitName);

    if (!apiResponse) {
        console.log('Unit not found!');
        return;
    }

    console.log(`Unit: ${apiResponse.unitName}`);
    console.log(`Rarity: ${apiResponse.rarity} ⭐`);
    console.log(`Max Level: ${apiResponse.maxLevel}`);
    console.log(`\nMax Level Upgrade Costs (1 → ${apiResponse.maxLevel}):`);
    console.log(`  G-Tokens: ${apiResponse.maxLevelUpgradeCosts?.gTokens?.toLocaleString() || 'N/A'}`);
    console.log(`  Pieces: ${apiResponse.maxLevelUpgradeCosts?.pieces?.toLocaleString() || 'N/A'}`);

    // Show a few sample levels with their costs
    console.log('\n--- Sample Level Stats with Costs ---');
    const sampleLevels = [1, 10, 20, apiResponse.maxLevel];

    for (const level of sampleLevels) {
        const levelStat = apiResponse.levelStats.find(ls => ls.level === level);
        if (levelStat) {
            console.log(`\nLevel ${levelStat.level}:`);
            if (levelStat.unit) {
                console.log(`  HP: ${levelStat.unit.hp.toLocaleString()}`);
            }
            if (levelStat.upgradeCost) {
                console.log(`  Upgrade Cost (${level - 1} → ${level}):`);
                console.log(`    G-Tokens: ${levelStat.upgradeCost.gTokens.toLocaleString()}`);
                console.log(`    Pieces: ${levelStat.upgradeCost.pieces.toLocaleString()}`);
            } else {
                console.log(`  Upgrade Cost: N/A (starting level)`);
            }
            if (levelStat.cumulativeCost) {
                console.log(`  Cumulative Cost (1 → ${level}):`);
                console.log(`    G-Tokens: ${levelStat.cumulativeCost.gTokens.toLocaleString()}`);
                console.log(`    Pieces: ${levelStat.cumulativeCost.pieces.toLocaleString()}`);
            }
        }
    }

    // Test with a 4-star unit
    console.log('\n\n=== Testing with 4-Star Unit ===\n');
    const fourStarUnit = 'Anguirus 2021';
    const fourStarResponse = await getUnitData.getAll(fourStarUnit);

    if (fourStarResponse) {
        console.log(`Unit: ${fourStarResponse.unitName}`);
        console.log(`Rarity: ${fourStarResponse.rarity} ⭐`);
        console.log(`Max Level: ${fourStarResponse.maxLevel}`);
        console.log(`\nMax Level Upgrade Costs (1 → ${fourStarResponse.maxLevel}):`);
        console.log(`  G-Tokens: ${fourStarResponse.maxLevelUpgradeCosts?.gTokens?.toLocaleString() || 'N/A'}`);
        console.log(`  Pieces: ${fourStarResponse.maxLevelUpgradeCosts?.pieces?.toLocaleString() || 'N/A'}`);
    }

    console.log('\n=== Test Complete ===\n');
}

test();
