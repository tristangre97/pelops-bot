const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ButtonStyle
} = require('discord.js');
const search = require('./search');
const cache = require('./cache');
const fs = require('fs');
const path = require('path');

// ===== DATA INITIALIZATION =====
const unitDataMap = new Map();
const searchList = [];
let unitDataFile = null;

function loadUnitDataFile() {
    const unitDataPath = path.join(__dirname, '../data/unitData.json');
    const fileContent = fs.readFileSync(unitDataPath, 'utf8');
    return JSON.parse(fileContent);
}

function initializeUnitData() {
    unitDataFile = loadUnitDataFile();
    unitDataMap.clear();
    searchList.length = 0;

    for (const unit in unitDataFile) {
        unitDataMap.set(unit, unitDataFile[unit]);
        if (unitDataFile[unit].skipSearch) continue;
        searchList.push({
            name: unitDataFile[unit].name,
            id: unit,
            aliases: unitDataFile[unit].aliases || []
        });
    }

    console.log('Unit data loaded:', Object.keys(unitDataFile).length, 'units');
}

function reloadUnitData() {
    console.log('Reloading unit data...');
    initializeUnitData();
}

initializeUnitData();

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

function getMaxLevel(rarity) {
    return (rarity < 4) ? 50 : 40;
}

function createUnitEmoji(unitData) {
    const emojiName = unitData.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
    const emojiID = unitData.emoji;
    return `<:${emojiName}:${emojiID}>`;
}

function validateLevel(level, maxLevel, id) {
    if (level > maxLevel) {
        level = maxLevel;
        const options = cache.get(`pelops:interactions:${id}`) || {};
        options.level = level;
        cache.set(`pelops:interactions:${id}`, options, 600);
    }

    if (level < 1) level = 1;
    return level;
}

async function findUnitData(name) {
    let unitData = unitDataMap.get(name);

    if (!unitData) {
        const unitSearch = await search.search({
            searchList: searchList,
            query: name,
            searchKeys: ["name", "aliases", "id"],
            workerAmount: 1,
            cacheName: "unitSearch",
            threshold: 0.4,
        });
        if (unitSearch.length > 0) {
            unitData = unitDataMap.get(unitSearch[0].id);
        }
    }

    return unitData;
}

function calculateStat(level, unitRarity, stat, isLeader = false) {
    level = parseInt(level);
    unitRarity = parseInt(unitRarity);
    stat = parseInt(stat);

    let currentLevel = 1;
    let lastRange = null;
    let percent, leaderPercent;

    while (currentLevel < level) {
        const rangeKey = Object.keys(levelRanges).find(range => {
            const [min, max] = levelRanges[range];
            return currentLevel >= min && currentLevel <= max;
        });

        if (rangeKey !== lastRange) {
            lastRange = rangeKey;
            percent = upgradePercent[unitRarity][rangeKey];
            leaderPercent = leaderUpgradePercent?.[unitRarity]?.[rangeKey] || percent;
        }

        const effectivePercent = isLeader ? leaderPercent : percent;
        stat = Math.ceil(stat + (stat * (effectivePercent / 100)));
        currentLevel++;
    }

    return stat;
}

function calculateDPS(attack, speed) {
    const attacksPerSecond = Math.abs(1 / speed);
    return parseInt(attacksPerSecond * attack);
}

function getAttacks(options) {
    const { attacks, level, unitRarity, returnJSON = false } = options;

    const attackMap = {};
    attacks.forEach(attack => {
        attackMap[attack.name] = attack;
    });

    function calculateAttackValue(attack) {
        if (attack.inheritsFrom) {
            const parentAttack = attackMap[attack.inheritsFrom];
            if (!parentAttack) {
                throw new Error(`Parent attack "${attack.inheritsFrom}" not found for attack "${attack.name}"`);
            }

            const parentAttackValue = calculateAttackValue(parentAttack);

            if (attack.multiplierType === "Percent") {

                if (attack.multiplierValue < 100) {
                    return Math.ceil(parentAttackValue * (1 + attack.multiplierValue / 100))
                }

                return Math.ceil(parentAttackValue * (attack.multiplierValue / 100))
            }
            else if (attack.multiplierType === "PercentOf") {
                return Math.ceil(parentAttackValue * (attack.multiplierValue / 100))
            }
            else if (attack.multiplierType === "Flat") {
                return parentAttackValue + attack.multiplierValue;
            } else {
                return parentAttackValue + attack.multiplierValue;
            }
        } else {
            return calculateStat(level, unitRarity, attack.attack);
        }
    }


    if (returnJSON) {
        return attacks.map((attack) => {
            const attackStat = calculateAttackValue(attack);
            return {
                name: attack.name,
                attack: attackStat,
                hitsPerAttack: attack.hitsPerAttack,
                dps: calculateDPS(attackStat * attack.hitsPerAttack, attack.attackSpeed),
                notes: attack.notes || null
            };
        });
    }

    return attacks.map((attack) => {
        const attackStat = calculateAttackValue(attack);
        const multiHitMessage = attack.hitsPerAttack > 1 ? ` | **Hits** \`${attack.hitsPerAttack}\` for \`${attackStat * attack.hitsPerAttack}\`` : '';
        const notesMessage = attack.notes ? `\n-# ${attack.notes}` : '';
        return `<:pelops_attack:1258999656193462335> **${attack.name}** \`${attackStat.toLocaleString()}\` ${multiHitMessage} | **DPS** \`${calculateDPS(attackStat * attack.hitsPerAttack, attack.attackSpeed).toLocaleString()}\`${notesMessage}`;
    });
}

function createDuoFields(unitData, level, unitRarity, emoji) {
    const fields = [];
    for (const unit of unitData.units) {
        const unitHealth = calculateStat(level, unitRarity, unit.hp);
        const unitAttacks = getAttacks({ attacks: unit.attacks, level, unitRarity });

        fields.push({
            name: `${emoji} __**${unit.name} Stats**__`,
            value: `<:pelops_health:1258999655186960465> **HP** \`${unitHealth.toLocaleString()}\`\n${unitAttacks.join('\n')}`,
            inline: false
        });
    }
    return fields;
}

function createSingleUnitFields(unitData, level, unitRarity, emoji) {
    const unitHealth = calculateStat(level, unitRarity, unitData.unit.hp) ?? 'N/A';
    const unitAttacks = getAttacks({
        attacks: unitData.unit.attacks,
        level,
        unitRarity
    });

    return [{
        name: `${emoji} __**Unit Stats**__`,
        value: `<:pelops_health:1258999655186960465> **HP** \`${unitHealth.toLocaleString()}\`\n${unitAttacks.join('\n')}`,
        inline: false
    }];
}

function createSpawnedUnitFields(unitData, level, unitRarity) {
    const fields = [];
    const spawnedUnitData = unitDataMap.get(unitData.spawnedUnit);

    if (spawnedUnitData) {
        console.log(spawnedUnitData);
        const spawnedUnitEmoji = createUnitEmoji(unitData); // Using original unit's emoji for spawned unit
        const spawnedUnitHealth = calculateStat(level, unitRarity, spawnedUnitData.unit.hp);
        const spawnedUnitAttacks = getAttacks({
            attacks: spawnedUnitData.unit.attacks,
            level,
            unitRarity
        });

        fields.push({
            name: `${spawnedUnitEmoji} __**${spawnedUnitData.name} Stats**__`,
            value: `<:pelops_health:1258999655186960465> **Name** \`${spawnedUnitData.name}\`\n**HP** \`${spawnedUnitHealth.toLocaleString()}\`\n${spawnedUnitAttacks.join('\n')}`,
            inline: false
        });
    }

    return fields;
}

function createAllFields(unitData, level, unitRarity, emoji) {
    let fields = [];

    if (unitData.type === "Duo") {
        fields = fields.concat(createDuoFields(unitData, level, unitRarity, emoji));
    } else if (unitData.type !== "n") {
        fields = fields.concat(createSingleUnitFields(unitData, level, unitRarity, emoji));
    }

    // Leader fields
    // if (unitData.leader) {
    //     const leaderHealth = calculateStat(level, unitRarity, unitData.leader.hp, true);
    //     const leaderAttacks = getAttacks({
    //         attacks: unitData.leader.attacks,
    //         level,
    //         unitRarity,
    //         returnJSON: false
    //     });

    //     fields.push({
    //         name: `${emoji} __**Leader Stats**__`,
    //         value: `<:pelops_health:1258999655186960465> **HP** \`${leaderHealth.toLocaleString()}\`\n${leaderAttacks.join('\n')}`,
    //         inline: false
    //     });
    // }

    if (unitData.spawnedUnit) {
        fields = fields.concat(createSpawnedUnitFields(unitData, level, unitRarity));
    }

    return fields;
}

// ===== UI COMPONENT CREATION FUNCTIONS =====
function createEmbed(unitData, fields, level) {
    const embed = new EmbedBuilder()
        .setTitle(`${unitData.name} - Level ${level} Stats`)
        .setColor('#ffb33c')
        .setFields(fields);

    const imageLink = `http://api.pelops.app/images/units/${unitData.image}`;
    if (imageLink) {
        embed.setThumbnail(imageLink);
    } else {
        embed.setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1645067926/gbl/pelops/pelops_error.png');
    }

    return embed;
}

function createNotFoundEmbed(name) {
    return new EmbedBuilder()
        .setTitle(`Unit not found`)
        .setDescription(`Unit ${name} not found.\nPlease be sure to use the autocomplete feature.`);
}

function createLevelButtons(level, maxLevel, id) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`level ${id} down`)
                .setLabel(`Level ${level - 1}`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`<:pelops_arrow_down:1201214028291252296>`)
                .setDisabled(level === 1),
            new ButtonBuilder()
                .setCustomId(`level ${id} up`)
                .setLabel(`Level ${parseInt(level + 1)}`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`<:pelops_arrow_up:1201214024940015747>`)
                .setDisabled(level === maxLevel)
        );
}

function createLevelSelectMenu(level, maxLevel, id) {
    const selectOptions = [];
    let levelUp = level;
    let levelDown = level;
    let i = 0;

    while (i < 25) {
        if (levelUp < maxLevel) {
            levelUp++;
            selectOptions.push({
                label: `Level ${levelUp}`,
                value: levelUp.toString(),
            });
            i++;
        }
        if (levelDown > 1) {
            levelDown--;
            selectOptions.push({
                label: `Level ${levelDown}`,
                value: levelDown.toString(),
            });
            i++;
        }
    }

    selectOptions.sort((a, b) => a.value - b.value);

    return new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`levelSelectMenu_${id}`)
                .setPlaceholder('Level Select')
                .addOptions(selectOptions.slice(0, 25))
        );
}
function createWebsiteLink(unitData) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel(`View on Website`)
                .setStyle(ButtonStyle.Link)
                .setURL(`https://pelops.app/gbl/unit/${unitData.name.replaceAll(' ', '_')}`)
        );
}
function createEvolutionButtons(unitData, id) {
    if (!unitData?.evolutions || unitData.evolutions.length === 0) {
        return null;
    }

    const evolutionBtns = new ActionRowBuilder();

    unitData.evolutions.forEach((evolution) => {
        const evolutionData = unitDataMap.get(evolution);
        if (evolutionData) {
            const evolvedEmoji = createUnitEmoji(evolutionData);

            evolutionBtns.addComponents(
                new ButtonBuilder()
                    .setCustomId(`evolve ${id} ${evolution.replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '')}`)
                    .setLabel(evolution)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(evolvedEmoji)
            );
        }
    });

    return evolutionBtns;
}

function createComponents(unitData, level, maxLevel, id) {
    const components = [];
    components.push(createLevelButtons(level, maxLevel, id));
    // components.push(createWebsiteLink(unitData));

    const evolutionBtns = createEvolutionButtons(unitData, id);
    if (evolutionBtns) {
        components.push(evolutionBtns);
    }

    components.push(createLevelSelectMenu(level, maxLevel, id));

    return components;
}

exports.get = async function (data) {
    const { name, level: inputLevel, id, star_rank, apply_boost } = data;

    const unitData = await findUnitData(name);

    if (!unitData) {
        return {
            embed: createNotFoundEmbed(name),
            components: []
        };
    }

    const unitRarity = unitData.rarity;
    const maxLevel = getMaxLevel(unitRarity);
    const level = validateLevel(inputLevel, maxLevel, id);

    const emoji = createUnitEmoji(unitData);

    const fields = createAllFields(unitData, level, unitRarity, emoji);

    const embed = createEmbed(unitData, fields, level);

    const components = createComponents(unitData, level, maxLevel, id);

    return {
        embed,
        components,
        fields
    };
};

exports.calculateStat = calculateStat;
exports.calculateDPS = calculateDPS;
exports.getAttacks = getAttacks;
exports.findUnitData = findUnitData;
exports.getMaxLevel = getMaxLevel;
exports.reloadUnitData = reloadUnitData;

function getUnitStatsAtLevel(unitData, level) {
    const unitRarity = unitData.rarity;
    const result = {
        level,
        rarity: unitRarity,
        name: unitData.name
    };

    if (unitData.type === "Duo") {
        result.units = unitData.units.map(unit => ({
            name: unit.name,
            hp: calculateStat(level, unitRarity, unit.hp),
            attacks: getAttacks({
                attacks: unit.attacks,
                level,
                unitRarity,
                returnJSON: true
            })
        }));
    } else if (unitData.type !== "n" && unitData.unit) {
        result.unit = {
            hp: calculateStat(level, unitRarity, unitData.unit.hp),
            attacks: getAttacks({
                attacks: unitData.unit.attacks,
                level,
                unitRarity,
                returnJSON: true
            })
        };
    }

    if (unitData.spawnedUnit) {
        const spawnedUnitData = unitDataMap.get(unitData.spawnedUnit);
        if (spawnedUnitData && spawnedUnitData.unit) {
            result.spawnedUnit = {
                name: spawnedUnitData.name,
                hp: calculateStat(level, unitRarity, spawnedUnitData.unit.hp),
                attacks: spawnedUnitData.unit.attacks.map(attack => ({
                    name: attack.name,
                    attack: calculateStat(level, unitRarity, attack.attack) * attack.hitsPerAttack,
                    dps: calculateDPS(calculateStat(level, unitRarity, attack.attack) * attack.hitsPerAttack, attack.attackSpeed),
                    hitsPerAttack: attack.hitsPerAttack,
                    notes: attack.notes
                }))
            };
        }
    }

    return result;
}

exports.getUnitStats = async function (name, level) {
    const unitData = await findUnitData(name);
    if (!unitData) return null;

    const maxLevel = getMaxLevel(unitData.rarity);
    level = Math.max(1, Math.min(level, maxLevel));

    return getUnitStatsAtLevel(unitData, level);
};

exports.getAllLevelStats = async function (name) {
    const unitData = await findUnitData(name);
    if (!unitData) return null;

    const maxLevel = getMaxLevel(unitData.rarity);
    const allStats = [];

    for (let level = 1; level <= maxLevel; level++) {
        allStats.push(getUnitStatsAtLevel(unitData, level));
    }

    return {
        unitName: unitData.name,
        rarity: unitData.rarity,
        maxLevel: maxLevel,
        type: unitData.type,
        levelStats: allStats
    };
};

exports.getStatsForLevelRange = async function (name, minLevel, maxLevel) {
    const unitData = await findUnitData(name);
    if (!unitData) return null;

    const unitMaxLevel = getMaxLevel(unitData.rarity);
    minLevel = Math.max(1, minLevel);
    maxLevel = Math.min(maxLevel, unitMaxLevel);

    const rangeStats = [];
    for (let level = minLevel; level <= maxLevel; level++) {
        rangeStats.push(getUnitStatsAtLevel(unitData, level));
    }

    return {
        unitName: unitData.name,
        rarity: unitData.rarity,
        maxLevel: unitMaxLevel,
        type: unitData.type,
        requestedRange: { min: minLevel, max: maxLevel },
        levelStats: rangeStats
    };
};

exports.createStatsEmbed = async function (name, options = {}) {
    const {
        minLevel = 1,
        maxLevel = null,
        showAllLevels = false,
        showEveryNthLevel = 5,
        compact = false
    } = options;

    const unitData = await findUnitData(name);
    if (!unitData) {
        return createNotFoundEmbed(name);
    }

    const unitMaxLevel = getMaxLevel(unitData.rarity);
    const finalMaxLevel = maxLevel ? Math.min(maxLevel, unitMaxLevel) : unitMaxLevel;
    const emoji = createUnitEmoji(unitData);

    const embed = new EmbedBuilder()
        .setColor('#ffb33c');

    // Set thumbnail
    const imageLink = `http://api.pelops.app/images/units/${unitData.image}`;
    if (imageLink) {
        embed.setThumbnail(imageLink);
    } else {
        embed.setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1645067926/gbl/pelops/pelops_error.png');
    }

    if (showAllLevels) {
        // Show every single level (warning: can be very long)
        const allStats = await exports.getStatsForLevelRange(name, minLevel, finalMaxLevel);
        embed.setTitle(`${emoji} ${unitData.name} - All Level Stats (${minLevel}-${finalMaxLevel})`);

        if (compact) {
            // Compact format - just show key stats
            const statLines = allStats.levelStats.map(stat => {
                if (unitData.type === "Duo") {
                    const totalHP = stat.units.reduce((sum, unit) => sum + unit.hp, 0);
                    const totalDPS = stat.units.reduce((sum, unit) =>
                        sum + unit.attacks.reduce((attackSum, attack) => attackSum + attack.dps, 0), 0);
                    return `**L${stat.level}:** HP \`${totalHP.toLocaleString()}\` | DPS \`${totalDPS.toLocaleString()}\``;
                } else if (stat.unit) {
                    const totalDPS = stat.unit.attacks.reduce((sum, attack) => sum + attack.dps, 0);
                    return `**L${stat.level}:** HP \`${stat.unit.hp.toLocaleString()}\` | DPS \`${totalDPS.toLocaleString()}\``;
                }
                return `**L${stat.level}:** Data unavailable`;
            });

            // Split into multiple fields if too long
            const maxPerField = 10;
            for (let i = 0; i < statLines.length; i += maxPerField) {
                const chunk = statLines.slice(i, i + maxPerField);
                const startLevel = minLevel + i;
                const endLevel = Math.min(minLevel + i + maxPerField - 1, finalMaxLevel);

                embed.addFields({
                    name: `Levels ${startLevel}-${endLevel}`,
                    value: chunk.join('\n'),
                    inline: true
                });
            }
        } else {
            embed.setDescription(`Showing detailed stats for levels ${minLevel}-${finalMaxLevel}`);

            const maxLevelsInEmbed = 5; // Limit to prevent embed being too long
            const statsToShow = allStats.levelStats.slice(0, maxLevelsInEmbed);

            statsToShow.forEach(stat => {
                let fieldValue = '';

                if (unitData.type === "Duo") {
                    stat.units.forEach(unit => {
                        fieldValue += `**${unit.name}:**\n`;
                        fieldValue += `<:pelops_health:1258999655186960465> HP \`${unit.hp.toLocaleString()}\`\n`;
                        unit.attacks.forEach(attack => {
                            fieldValue += `<:pelops_attack:1258999656193462335> ${attack.name} \`${attack.attack.toLocaleString()}\` | DPS \`${attack.dps.toLocaleString()}\`\n`;
                        });
                        fieldValue += '\n';
                    });
                } else if (stat.unit) {
                    fieldValue += `<:pelops_health:1258999655186960465> HP \`${stat.unit.hp.toLocaleString()}\`\n`;
                    stat.unit.attacks.forEach(attack => {
                        fieldValue += `<:pelops_attack:1258999656193462335> ${attack.name} \`${attack.attack.toLocaleString()}\` | DPS \`${attack.dps.toLocaleString()}\`\n`;
                    });
                }

                if (stat.spawnedUnit) {
                    fieldValue += `\n**Spawned: ${stat.spawnedUnit.name}**\n`;
                    fieldValue += `<:pelops_health:1258999655186960465> HP \`${stat.spawnedUnit.hp.toLocaleString()}\`\n`;
                }

                embed.addFields({
                    name: `Level ${stat.level}`,
                    value: fieldValue.trim(),
                    inline: false
                });
            });

            if (allStats.levelStats.length > maxLevelsInEmbed) {
                embed.setFooter({
                    text: `Showing first ${maxLevelsInEmbed} levels. Use compact mode or level ranges for more data.`
                });
            }
        }
    } else {
        embed.setTitle(`${emoji} ${unitData.name} - Level Overview (Every ${showEveryNthLevel} levels)`);

        const levelsToShow = [];
        for (let level = minLevel; level <= finalMaxLevel; level += showEveryNthLevel) {
            levelsToShow.push(level);
        }

        // Always include max level if not already included
        if (!levelsToShow.includes(finalMaxLevel)) {
            levelsToShow.push(finalMaxLevel);
        }

        const statsPromises = levelsToShow.map(level => getUnitStatsAtLevel(unitData, level));
        const levelStats = statsPromises;

        const statLines = levelStats.map(stat => {
            if (unitData.type === "Duo") {
                const totalHP = stat.units.reduce((sum, unit) => sum + unit.hp, 0);
                const totalDPS = stat.units.reduce((sum, unit) =>
                    sum + unit.attacks.reduce((attackSum, attack) => attackSum + attack.dps, 0), 0);
                return `**Level ${stat.level}:** HP \`${totalHP.toLocaleString()}\` | Total DPS \`${totalDPS.toLocaleString()}\``;
            } else if (stat.unit) {
                const totalDPS = stat.unit.attacks.reduce((sum, attack) => sum + attack.dps, 0);
                return `**Level ${stat.level}:** HP \`${stat.unit.hp.toLocaleString()}\` | Total DPS \`${totalDPS.toLocaleString()}\``;
            }
            return `**Level ${stat.level}:** Data unavailable`;
        });

        embed.addFields({
            name: `Stats Overview`,
            value: statLines.join('\n'),
            inline: false
        });

        // Add growth info
        if (levelStats.length >= 2) {
            const firstStat = levelStats[0];
            const lastStat = levelStats[levelStats.length - 1];

            let growthInfo = '';
            if (unitData.type === "Duo") {
                const firstHP = firstStat.units.reduce((sum, unit) => sum + unit.hp, 0);
                const lastHP = lastStat.units.reduce((sum, unit) => sum + unit.hp, 0);
                const hpGrowth = ((lastHP - firstHP) / firstHP * 100).toFixed(1);
                growthInfo = `HP Growth: ${hpGrowth}% (L${firstStat.level} → L${lastStat.level})`;
            } else if (firstStat.unit && lastStat.unit) {
                const hpGrowth = ((lastStat.unit.hp - firstStat.unit.hp) / firstStat.unit.hp * 100).toFixed(1);
                growthInfo = `HP Growth: ${hpGrowth}% (L${firstStat.level} → L${lastStat.level})`;
            }

            if (growthInfo) {
                embed.addFields({
                    name: 'Growth Analysis',
                    value: growthInfo,
                    inline: false
                });
            }
        }
    }

    embed.addFields({
        name: 'Unit Info',
        value: `**Rarity:** ${unitData.rarity} ⭐\n**Max Level:** ${unitMaxLevel}\n**Type:** ${unitData.type || 'Standard'}`,
        inline: true
    });

    return embed;
};


exports.getAll = async function (name) {
    if (!name) {
        return unitDataFile
    }
    const unitData = await findUnitData(name);
    if (!unitData) return null;

    const maxLevel = getMaxLevel(unitData.rarity);
    const allStats = [];

    for (let level = 1; level <= maxLevel; level++) {
        allStats.push(getUnitStatsAtLevel(unitData, level));
    }

    let unitReturnData = {
        unitName: unitData.name,
        aliases: unitData.aliases || [],
        movie: unitData.movie || null,
        year: unitData.year || null,
        image: unitData.image,
        rarity: unitData.rarity,
        cost: unitData.cost || 0,
        type: unitData.type,
        evolutions: unitData.evolutions || [],
        youtube: unitData.youtube || null,
        levelStats: allStats
    }

    return unitReturnData;
};