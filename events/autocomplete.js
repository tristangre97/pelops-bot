const cache = require('../utility/cache')
const Fuse = require('fuse.js')
const unitData = JSON.parse(cache.get("unitData"))


const unitSearch = []
const leaderUnits = []

for (item of unitData) {
    unitSearch.push({
        name: item['Unit Name'],
        value: item['Unit Name'],
        aliases: item['ALIASES'].split(', '),
    })

    if (unit.LEADER === 'TRUE') {
        leaderUnits.push({
            name: item['Unit Name'],
            value: item['Unit Name'],
            aliases: item['ALIASES'].split(', '),
        })
    }
}


module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;
        start = performance.now();

        const focusedValue = interaction.options.getFocused();
        const subCommandData = interaction?.options?.data



        if (interaction.commandName === 'random_deck') {
            searchData = leaderUnits
            cacheName = 'leaderUnits'
        }


        if (interaction.commandName === 'unit' || interaction.commandName === 'stats' || interaction.commandName === 'unit_image' || interaction.commandName === 'compare' || interaction.commandName === 'tier_list') {
            searchData = unitSearch;
            cacheName = 'unitNames';
        }


        var itemOptions = []

        if (focusedValue) {

            const fuse = new Fuse(searchData, {
                shouldSort: true,
                keys: ['name', 'aliases'],
                findAllMatches: true,
                threshold: 0.4,
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
            searchData.forEach(element => {
                itemOptions.push({
                    name: element.name,
                    value: element.value,
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



