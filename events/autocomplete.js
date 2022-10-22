const cache = require('../utility/cache')
const db = require('../utility/database')

const Fuse = require('fuse.js')
const unitData = require('../data/unitData.json')
const leaderData = require('../data/leaderData.json')

var unitSearch = []
var leaderSearch = []

var userDeckUnits = []
var userDeckLeaders = []

for (unit of unitData) {
    if (unit['ISFINALEVOLUTION'] === 'FALSE' ) continue 

    if (unit.LEADER === 'TRUE') {
        userDeckLeaders.push({
            name: unit['Unit Name'],
            value: unit['Unit Name']
        })
        userDeckUnits.push({
            name: unit['Unit Name'],
            value: unit['Unit Name']
        })
    } else {
        userDeckUnits.push({
            name: unit['Unit Name'],
            value: unit['Unit Name']
        })
    }
}

for (item of unitData) {
    unitSearch.push({
        name: item['Unit Name'],
        value: item['Unit Name'],
        aliases: item['ALIASES'].split(', '),
    })
}
for (item of leaderData) {
    leaderSearch.push({
        name: `${item['UNIT']} (${item['ABILITY NAME']})`,
        value: item['UNIT'],
        aliases: item['ABILITY NAME'],
    })
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;
        start = performance.now();

        subCommandData = interaction?.options?.data



        if (interaction.commandName === 'random_deck') {
            searchData = userDeckLeaders
            cacheName = 'userDeckLeaders'
            unitRanking = searchData
        }

        if (subCommandData[0].name === 'create') {
            var currentInputName = interaction.options.getFocused(true).name;

            if (currentInputName === 'leader') {
                searchData = userDeckLeaders
                cacheName = 'userDeckLeaders'
                unitRanking = searchData
            } else {
                searchData = userDeckUnits
                cacheName = 'userDeckUnits'
                unitRanking = searchData
            }
        }


        if (subCommandData[0].name === 'view') {
            deckSearch = []
            userDecks = await db.get('usersDecks')
            for(item in userDecks) {
                deckSearch.push({
                    name: `${userDecks[item].details.name}`,
                    value: `${item}`,
                    aliases: userDecks[item].id
                })
            }
            searchData = deckSearch;
            cacheName = 'userDecks';
            unitRanking = searchData
        }



        if (interaction.commandName === 'unit' || interaction.commandName === 'stats' || interaction.commandName === 'unit_image' || interaction.commandName === 'compare' || interaction.commandName === 'tier_list') {
            searchData = unitSearch;
            cacheName = 'unitNames';

            var unitUsage = cache.get('unitUsage') || db.get('unitStats')
            if (!cache.get('unitUsage')) cache.set('unitUsage', unitUsage, 5)

            var rankedUnits = Object.entries(unitUsage).sort((a, b) => b[1] - a[1])


            var unitUsageRank = []


            for (var unit in rankedUnits) {
                var data = {
                    name: rankedUnits[unit][0],
                    aliases: ''
                }
                unitUsageRank.push(data)
            }
            unitRanking = unitUsageRank

        }

        if (interaction.commandName === 'leader_ability') {
            searchData = leaderSearch;
            cacheName = 'leaderNames';

            var unitUsage = cache.get('unitLeaderStats') || db.get('unitLeaderStats')
            if (!cache.get('unitLeaderStats')) cache.set('unitLeaderStats', unitUsage, 3600)


            var rankedUnits = Object.entries(unitUsage).sort((a, b) => b[1] - a[1])

            var unitUsageRank = []

            for (var unit in rankedUnits) {
                var data = {
                    name: rankedUnits[unit][0],
                    aliases: ''
                }
                unitUsageRank.push(data)
            }
            unitRanking = unitUsageRank


        }


        var focusedValue = interaction.options.getFocused();
        var itemOptions = []

        if (focusedValue) {

            const fuse = new Fuse(searchData, {
                shouldSort: true,
                keys: ['name', 'aliases'],
                findAllMatches: true,
                threshold: 0.5,
            })

            if (!cache.get(`autocomplete.${cacheName}.${focusedValue}`)) {
                results = fuse.search(focusedValue);
                cache.set(`autocomplete.${cacheName}.${focusedValue}`, results);
            } else {
                results = cache.get(`autocomplete.${cacheName}.${focusedValue}`);
            }

            if (!results) return

            results.forEach(element => {
                itemOptions.push({
                    name: element.item.name,
                    value: element.item.value,
                })
            })


        } else {

            results = unitRanking
            results.forEach(element => {
                itemOptions.push({
                    name: element.name,
                    value: element.value || element.name,
                })
            })

        }





        const choices = itemOptions.slice(0, 25)


        end = performance.now();
        const response = await interaction.respond(
            choices.map(choice => ({
                name: choice.name,
                value: choice.value,
            })),
        );


    },
};


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}



