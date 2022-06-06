const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const search = require('../utility/search.js');

module.exports = {
    name: 'random_deck',
    category: 'Tools',
    description: 'Get a random deck',
    slash: "both",
    argsDescription: "The command category | the command name",
    testOnly: false,


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {
        var unitData = JSON.parse(cache.get('unitData'));
        var leaderUnits = []
        var units = []

        var randomDeck = []


        for (unit of unitData) {
            if (unit.LEADER === 'TRUE') {
                leaderUnits.push(unit)
                units.push(unit)
            } else {
                units.push(unit)
            }
        }

        function getRandomLeader() {
            return leaderUnits[Math.floor(Math.random() * leaderUnits.length)]
        }

        function getRandomUnit() {
            return units[Math.floor(Math.random() * units.length)]
        }

        function getRandomDeck() {

            var maxDeckSize = 8;
            var leader = getRandomLeader();
            randomDeck.push(leader['Unit Name'])

            while (randomDeck.length < maxDeckSize) {
                var unit = getRandomUnit()
                if (randomDeck.indexOf(unit['Unit Name']) === -1) {
                    if (unit['ISFINALEVOLUTION'] === 'FALSE') {
                        continue
                    } else {
                        randomDeck.push(unit['Unit Name'])
                    }

                } else {
                    continue
                }
            }

        }

        getRandomDeck()

        randomDeckFinal = []
        for (unit of randomDeck) {
            var unitData = search.unitSearch(unit)
            randomDeckFinal.push(`${unitData[0].item['EMOJI']}  **${unitData[0].item['Unit Name']}**`)
        }

        const embed = new MessageEmbed()
            .setColor('#ffb33c')
            .setTitle('Random Deck')
            .setDescription(`${randomDeckFinal.join('\n')}`)

        await interaction.editReply({
            embeds: [embed]
        });
    }
}