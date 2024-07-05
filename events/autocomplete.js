const search = require('../utility/search')
const unitData = require('../data/unitData.json')

const unitSearch = []
const leaderUnits = []

for (item in unitData) {
    unit = unitData[item]
    if(unit.skip) continue
    unitSearch.push({
        name: unit.name,
        value: unit.name,
        aliases: unit.aliases,
    })

    if (unit.leader) {
        leaderUnits.push({
            name: unit.name,
            value: unit.name,
            aliases: unit.aliases,
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


        const commandName = interaction.commandName
        console.log(commandName)

        if (commandName === 'unit' || commandName === 'compare') {
            searchList = unitSearch;
            cacheName = 'unitSearch'
        }

        if (commandName === 'random_deck') {
            searchList = leaderUnits;
            cacheName = 'leaderUnits'
        }



        let itemOptions = []


        if (!focusedValue) {
            itemOptions = searchList.filter(item => item?.name?.trim() !== '')
            // sort items by name
            itemOptions.sort((a, b) => a.name.localeCompare(b.name))
        } else {
            itemOptions = await search.search({
                searchList: searchList,
                query: focusedValue,
                searchKeys: ["name", "aliases"],
                workerAmount: 1,
                cacheName: cacheName
            })

        }


        if (itemOptions.length < 1) return

        var choices = itemOptions.slice(0, 25)

        end = performance.now();
        console.log(`${interaction.user.username} searched ${cacheName} (${focusedValue}) ${(end - start).toFixed(2)}ms.`);



        try {
            return interaction.respond(
                choices.map(choice => ({
                    // Only let name and value be 100 characters
                    name: choice.name.substring(0, 100),
                    value: choice.value.substring(0, 100),
                }))
            )
        } catch (error) {
            console.error(`Error sending autocomplete response: ${cacheName} (${focusedValue})`)
            console.error(error)
            return
        }



        end = performance.now();

    },
};


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}



