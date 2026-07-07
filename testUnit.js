#!/usr/bin/env node

const { findUnitData, calculateStat, getAttacks, getMaxLevel } = require('./utility/getUnitData');

// Get command line arguments
const args = process.argv.slice(2);
const unitName = args[0];
const level = args[1] ? parseInt(args[1]) : 1;

if (!unitName) {
    console.log('Usage: node testUnit.js <unit_name> [level]');
    console.log('Example: node testUnit.js "Godzilla" 50');
    process.exit(1);
}

async function testUnit() {
    console.log(`\nSearching for: ${unitName}${level > 1 ? ` at level ${level}` : ''}...\n`);

    const unitData = await findUnitData(unitName);

    if (!unitData) {
        console.log(`❌ Unit not found: ${unitName}`);
        process.exit(1);
    }

    const unitRarity = unitData.rarity;
    const maxLevel = getMaxLevel(unitRarity);
    const actualLevel = Math.min(Math.max(1, level), maxLevel);

    if (level !== actualLevel) {
        console.log(`⚠️  Level adjusted from ${level} to ${actualLevel} (max for this unit is ${maxLevel})\n`);
    }

    // Header
    console.log('═'.repeat(60));
    console.log(`  ${unitData.name}`);
    console.log(`  Level ${actualLevel} | Rarity: ${unitRarity}★ | Cost: ${unitData.cost || 'N/A'} | Type: ${unitData.type || 'Standard'}`);
    console.log('═'.repeat(60));

    // Unit Stats
    if (unitData.type === "Duo" && unitData.units) {
        console.log('\n📊 DUO UNIT STATS\n');
        unitData.units.forEach((unit, index) => {
            const unitHealth = calculateStat(actualLevel, unitRarity, unit.hp);
            const unitAttacks = getAttacks({
                attacks: unit.attacks,
                level: actualLevel,
                unitRarity,
                returnJSON: true
            });

            console.log(`${'─'.repeat(60)}`);
            console.log(`  ${unit.name}`);
            console.log(`${'─'.repeat(60)}`);
            console.log(`  ❤️  HP: ${unitHealth.toLocaleString()}`);

            if (unitAttacks.length > 0) {
                console.log('\n  Attacks:');
                unitAttacks.forEach(attack => {
                    console.log(`    ⚔️  ${attack.name}`);
                    console.log(`        Attack: ${attack.attack.toLocaleString()}`);
                    if (attack.hitsPerAttack > 1) {
                        console.log(`        Hits: ${attack.hitsPerAttack} (Total: ${(attack.attack * attack.hitsPerAttack).toLocaleString()})`);
                    }
                    console.log(`        DPS: ${attack.dps.toLocaleString()}`);
                    if (attack.notes) {
                        console.log(`        Notes: ${attack.notes}`);
                    }
                });
            }
            console.log();
        });
    } else if (unitData.type !== "n" && unitData.unit) {
        console.log('\n📊 UNIT STATS\n');
        const unitHealth = calculateStat(actualLevel, unitRarity, unitData.unit.hp);
        const unitAttacks = getAttacks({
            attacks: unitData.unit.attacks,
            level: actualLevel,
            unitRarity,
            returnJSON: true
        });

        console.log(`${'─'.repeat(60)}`);
        console.log(`  ❤️  HP: ${unitHealth.toLocaleString()}`);

        if (unitAttacks.length > 0) {
            console.log('\n  Attacks:');
            unitAttacks.forEach(attack => {
                console.log(`    ⚔️  ${attack.name}`);
                console.log(`        Attack: ${attack.attack.toLocaleString()}`);
                if (attack.hitsPerAttack > 1) {
                    console.log(`        Hits: ${attack.hitsPerAttack} (Total: ${(attack.attack * attack.hitsPerAttack).toLocaleString()})`);
                }
                console.log(`        DPS: ${attack.dps.toLocaleString()}`);
                if (attack.notes) {
                    console.log(`        Notes: ${attack.notes}`);
                }
            });
        }
        console.log();
    }

    // Leader Stats
    if (unitData.leader) {
        console.log('👑 LEADER STATS\n');
        const leaderHealth = calculateStat(actualLevel, unitRarity, unitData.leader.hp, true);
        const leaderAttacks = getAttacks({
            attacks: unitData.leader.attacks,
            level: actualLevel,
            unitRarity,
            returnJSON: true,
            isLeader: true
        });

        console.log(`${'─'.repeat(60)}`);
        console.log(`  ❤️  HP: ${leaderHealth.toLocaleString()}`);

        if (leaderAttacks.length > 0) {
            console.log('\n  Attacks:');
            leaderAttacks.forEach(attack => {
                console.log(`    ⚔️  ${attack.name}`);
                console.log(`        Attack: ${attack.attack.toLocaleString()}`);
                if (attack.hitsPerAttack > 1) {
                    console.log(`        Hits: ${attack.hitsPerAttack} (Total: ${(attack.attack * attack.hitsPerAttack).toLocaleString()})`);
                }
                console.log(`        DPS: ${attack.dps.toLocaleString()}`);
                if (attack.notes) {
                    console.log(`        Notes: ${attack.notes}`);
                }
            });
        }
        console.log();
    }

    // Spawned Unit Stats
    if (unitData.spawnedUnit) {
        const spawnedUnitData = await findUnitData(unitData.spawnedUnit);
        if (spawnedUnitData && spawnedUnitData.unit) {
            console.log(`🔄 SPAWNED UNIT: ${spawnedUnitData.name}\n`);
            const spawnedUnitHealth = calculateStat(actualLevel, unitRarity, spawnedUnitData.unit.hp);
            const spawnedUnitAttacks = getAttacks({
                attacks: spawnedUnitData.unit.attacks,
                level: actualLevel,
                unitRarity,
                returnJSON: true
            });

            console.log(`${'─'.repeat(60)}`);
            console.log(`  ❤️  HP: ${spawnedUnitHealth.toLocaleString()}`);

            if (spawnedUnitAttacks.length > 0) {
                console.log('\n  Attacks:');
                spawnedUnitAttacks.forEach(attack => {
                    console.log(`    ⚔️  ${attack.name}`);
                    console.log(`        Attack: ${attack.attack.toLocaleString()}`);
                    if (attack.hitsPerAttack > 1) {
                        console.log(`        Hits: ${attack.hitsPerAttack} (Total: ${(attack.attack * attack.hitsPerAttack).toLocaleString()})`);
                    }
                    console.log(`        DPS: ${attack.dps.toLocaleString()}`);
                    if (attack.notes) {
                        console.log(`        Notes: ${attack.notes}`);
                    }
                });
            }
            console.log();
        }
    }

    // Additional Info
    if (unitData.evolutions && unitData.evolutions.length > 0) {
        console.log('🔀 EVOLUTIONS');
        console.log(`${'─'.repeat(60)}`);
        unitData.evolutions.forEach(evo => {
            console.log(`  → ${evo}`);
        });
        console.log();
    }

    if (unitData.movie) {
        console.log('🎬 SOURCE');
        console.log(`${'─'.repeat(60)}`);
        console.log(`  Movie: ${unitData.movie} (${unitData.year || 'N/A'})`);
        console.log();
    }

    console.log('═'.repeat(60));
    console.log();
}

testUnit().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
