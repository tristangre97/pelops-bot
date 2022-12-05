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





exports.get = async function (data) {

    var {id, user, time, guild, unit: {name, level, star_rank, apply_boost}} = data;

    const embed = new EmbedBuilder()
    const components = []

    unitData = unitDataMap.get(name);

    if(!unitData) {
        embed.setTitle(`Unit not found`)
        embed.setDescription(`Unit ${name} not found`)
        return {
            embed: embed,
            components: components
        }
    }

    console.log(unitData)
}
