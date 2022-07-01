const cache = require('../utility/cache')
const db = require('../utility/database')

const Fuse = require('fuse.js')
const unitData = require('../data/unitData.json')
const leaderData = require('../data/leaderData.json')


module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;
        start = performance.now();


        if (interaction.commandName === 'unit' || interaction.commandName === 'stats' || interaction.commandName === 'get_image' || interaction.commandName === 'compare' || interaction.commandName === 'tier_list') {
            searchData = unitData;
            cacheName = 'unitNames';
            searchKeys = [{
                name: 'Unit Name',
                weight: 0.6
            },
            {
                name: 'ALIASES',
                weight: 0.5
            }]

            var unitUsage = cache.get('unitUsage') || db.get('unitStats')
            if (!cache.get('unitUsage')) cache.set('unitUsage', unitUsage, 5)

            var rankedUnits = Object.entries(unitUsage).sort((a,b) => b[1]-a[1])


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
            searchData = leaderData;
            cacheName = 'leaderNames';

            searchKeys = [{
                name: 'UNIT',
                weight: 0.6
            },
            {
                name: 'ABILITY NAME',
                weight: 0.5
            }]

            var unitUsage = cache.get('unitLeaderStats') || db.get('unitLeaderStats')
            if (!cache.get('unitLeaderStats')) cache.set('unitLeaderStats', unitUsage, 3600)


            var rankedUnits = Object.entries(unitUsage).sort((a,b) => b[1]-a[1])

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
                keys: searchKeys,
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
                itemOptions.push(element?.item['Unit Name'] || element?.item['UNIT'])
            })


        } else {

            results = unitRanking
            results.forEach(element => {
                itemOptions.push(element.name)
            })
            
        }






        const choices = itemOptions.slice(0, 25)


        end = performance.now();
        const response = await interaction.respond(
            choices.map(choice => ({
                name: choice,
                value: choice,
            })),
        );


    },
};


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}



