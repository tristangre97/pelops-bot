const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder
} = require('discord.js');
const search = require('./search');
const cache = require('./cache');
const unitDataFile = require('../data/unitData.json');
const unitDataMap = new Map();
const searchList = new Array();
for (unit in unitDataFile) {
    unitDataMap.set(unit, unitDataFile[unit]);
    searchList.push({
        name: unitDataFile[unit].name,
        value: unitDataFile[unit].name,
    })
}

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
    let { name, level, id, star_rank, apply_boost } = data;
    name = name.replaceAll('_', ' ')
    let unitData = unitDataMap.get(name);

    const embed = new EmbedBuilder()
    const components = []


    if (!unitData) {
        unitSearch = await search.search({
            searchList: searchList,
            query: name,
            searchKeys: ["name", "value"],
            workerAmount: 1,
            cacheName: "unitSearch",
            threshold: 0.4,
        })

        if (unitSearch.length > 0) {
            unitData = unitDataMap.get(unitSearch[0].name)
        } else {
            embed.setTitle(`Unit not found`)
            embed.setDescription(`Unit ${name} not found.\nPlease be sure to use the autocomplete feature.`)
            return {
                embed: embed,
                components: components
            }
        }


    }


    const unitRarity = unitData.rarity
    const maxLevel = (unitRarity < 4) ? 50 : 40;

    if (level > maxLevel) {
        level = maxLevel;
        const options = cache.get(`pelops:interactions:${id}`) || {}
        options.level = level
        cache.set(`pelops:interactions:${id}`, options, 600)
    }

    if (level < 1) level = 1;

    const fields = new Array();

    if (unitData.type === "Duo") {

        for (unit of unitData.units) {
            const unitHealth = calculateStat(level, unitRarity, unit.hp)
            const unitAttacks = getAttacks({ attacks: unit.attacks, level: level, unitRarity: unitRarity })

            fields.push(
                {
                    name: `__**${unit.name} Stats**__`,
                    value: `<:pelops_health:1258999655186960465> **HP** \`${unitHealth.toLocaleString()}\`\n${unitAttacks.join('\n')}`,
                    inline: false
                }
            )
        }


    } else if (unitData.type === "n") {




    } else {
        const unitHealth = calculateStat(level, unitRarity, unitData.unit.hp) ?? 'N/A'
        const unitAttacks = getAttacks({
            attacks: unitData.unit.attacks,
            level: level,
            unitRarity: unitRarity
        })

        fields.push(
            {
                name: '__**Unit Stats**__',
                value: `<:pelops_health:1258999655186960465> **HP** \`${unitHealth.toLocaleString()}\`\n${unitAttacks.join('\n')}`,
                inline: false
            }
        )
    }


    if (unitData.leader) {
        const leaderHealth = calculateStat(level, unitRarity, unitData.leader.hp, true)
        const leaderAttacks = getAttacks({
            attacks: unitData.leader.attacks,
            level: level,
            unitRarity: unitRarity
        })
        //         fields.push({
        //             name: '__**Leader Stats**__',
        //             value: `<:pelops_health:1258999655186960465> **HP** \`${leaderHealth.toLocaleString()}\`
        // ${leaderAttacks.join('\n')}
        // `
        //         })

        fields.push({
            name: '__**Leader Stats**__',
            value: `Leader stats were changed at some point and I have no idea what they are. `
        })
    }


    const spawnedUnit = unitData.spawnedUnit
    const spawnedUnitData = unitDataMap.get(spawnedUnit);

    if (spawnedUnitData) {
        const spawnedUnitHealth = calculateStat(level, unitRarity, spawnedUnitData.unit.hp)
        const spawnedUnitAttacks = getAttacks({
            attacks: spawnedUnitData.unit.attacks,
            level: level,
            unitRarity: unitRarity
        })

        fields.push(
            {
                name: '__**Spawned Unit Stats**__',
                value: `<:pelops_health:1258999655186960465> **Name** \`${spawnedUnitData.name}\` **HP** \`${spawnedUnitHealth.toLocaleString()}\`\n${spawnedUnitAttacks.join('\n')}`,
                inline: false
            }
        )
    }

    embed.setTitle(`${unitData.name} - Level ${level} Stats`)
    embed.setColor('#ffb33c')
    embed.setFields(fields)
    const imageLink = unitData.image
    embed.setThumbnail(imageLink)

    const levelBtns = new ActionRowBuilder();
    levelBtns.addComponents(
        new ButtonBuilder()
            .setCustomId(`level ${id} down`)
            .setLabel(`Level ${level - 1}`)
            .setStyle('Primary')
            .setEmoji(`<:pelops_arrow_down:1201214028291252296>`)
            .setDisabled(level == 1)
    )
    levelBtns.addComponents(
        new ButtonBuilder()
            .setCustomId(`level ${id} up`)
            .setLabel(`Level ${parseInt(level + 1)}`)
            .setStyle('Primary')
            .setEmoji(`<:pelops_arrow_up:1201214024940015747>`)
            .setDisabled(level == maxLevel)
    )



    let i = 0;
    let selectOptions = [];
    let levelUp = level;
    let levelDown = level;

    while (i < 25) {

        if (levelUp < maxLevel) {
            levelUp++
            selectOptions.push({
                label: `Level ${levelUp}`,
                value: levelUp.toString(),
            })
            i++
        }
        if (levelDown > 1) {
            levelDown--
            selectOptions.push({
                label: `Level ${levelDown}`,
                value: levelDown.toString(),
            })
            i++
        }

    }

    selectOptions.sort((a, b) => a.value - b.value)

    const selectMenu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`levelSelectMenu_${id}`)
                .setPlaceholder('Level Select')
                .addOptions(selectOptions.slice(0, 25))
        );


    components.push(levelBtns)

    const evolutionBtns = new ActionRowBuilder();
    if (unitData?.evolutions.length > 0) {
        unitData.evolutions.forEach((evolution) => {
            evolutionBtns.addComponents(
                new ButtonBuilder()
                    .setCustomId(`evolve ${id} ${evolution.replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '')}`)
                    .setLabel(evolution)
                    .setStyle('Success')
            )
        })
        components.push(evolutionBtns)
    }
    components.push(selectMenu)


    return {
        embed: embed,
        components: components,
        fields: fields
    }
}


function calculateStat(level, unitRarity, stat, isLeader = false) {
    level = parseInt(level);
    unitRarity = parseInt(unitRarity);
    stat = parseInt(stat);

    let currentLevel = 1;
    let lastRange = null;

    while (currentLevel < level) {
        let rangeKey = Object.keys(levelRanges).find(range => {
            let [min, max] = levelRanges[range];
            return currentLevel >= min && currentLevel <= max;
        });

        if (rangeKey !== lastRange) {
            lastRange = rangeKey;
            var percent = upgradePercent[unitRarity][rangeKey];
            var leaderPercent = leaderUpgradePercent?.[unitRarity]?.[rangeKey] || percent;
        }

        const effectivePercent = isLeader ? leaderPercent : percent;
        stat = Math.ceil(stat + (stat * (effectivePercent / 100)));

        currentLevel++;
    }

    return stat;
}


function calculateDPS(attack, speed) {
    var attacksPerSecond = Math.abs(1 / speed);
    var dps = parseInt(attacksPerSecond * attack)
    return dps
}

function getAttacks(options) {
    var { attacks, level, unitRarity } = options
    return attacks.map((attack) => {
        attackStat = calculateStat(level, unitRarity, attack.attack) * attack.hitsPerAttack
        const multiHitMessage = attack.hitsPerAttack > 1 ? ` | **Hits** \`${attack.hitsPerAttack}\`` : ''
        const notesMessage = attack.notes ? `
-# ${attack.notes}` : ''
        return `<:pelops_attack:1258999656193462335> **${attack.name}** \`${attackStat.toLocaleString()}\` | **DPS** \`${calculateDPS(attackStat, attack.attackSpeed).toLocaleString()}\` ${multiHitMessage}${notesMessage}`
    })
}