const cache = require('../utility/cache')
const Fuse = require('fuse.js')
const unitData = require('../data/unitData.json')



module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;
        start = performance.now();
        var unitNames = cache.get("unitNames")
        const seasonData = cache.get('seasonList')

        if (interaction.commandName === 'unit' || interaction.commandName === 'stats' || interaction.commandName === 'compare' || interaction.commandName === 'tier_list') {
            const focusedValue = interaction.options.getFocused();
            // console.log(unitNames)
            const fuse = new Fuse(unitNames, {
                shouldSort: true,
                keys: ['name', 'aliases'],
                threshold: 0.3,
            })
            // results = fuse.search(focusedValue);
            if (!cache.get(`autocomplete.items.${focusedValue}`)) {
                results = fuse.search(focusedValue);
                cache.set(`autocomplete.items.${focusedValue}`, results);
                // console.log(`[Not Cached]Autocomplete for ${focusedValue} took ${performance.now() - start}ms`);
            } else {
                results = cache.get(`autocomplete.items.${focusedValue}`);
                // console.log(`[Cached]Autocomplete for ${focusedValue} took ${performance.now() - start}ms`);
            }
            // console.log(results)
            if (!results) return


            var itemOptions = []
            results.forEach(element => {
                itemOptions.push(element.item)
            })


            const choices = itemOptions.slice(0, 25)
            // console.log(`${focusedValue}\n${choices.join(', ')}`);

            // const filtered = choices.filter(choice => choice.startsWith(toTitleCase(focusedValue)));

            end = performance.now();
            // console.log(`Search took ${end - start} milliseconds.`);
            const response = await interaction.respond(
                choices.map(choice => ({
                    name: choice.name,
                    value: choice.name,
                })),
            );
        }
        // Get unit auto-complete end

        // if (interaction.commandName == 'season') {
        //     const focusedValue = interaction.options.getFocused();
        //     console.log(seasonData)
        //     const fuse = new Fuse(seasonData, {
        //         shouldSort: true,
        //         keys: ['Number', 'Name'],
        //         threshold: 0.3,
        //     })
        //     // results = fuse.search(focusedValue);
        //     if (!cache.get(`autocomplete.items.${focusedValue}`)) {
        //         results = fuse.search(focusedValue);
        //         cache.set(`autocomplete.items.${focusedValue}`, results);
        //         // console.log(`[Not Cached]Autocomplete for ${focusedValue} took ${performance.now() - start}ms`);
        //     } else {
        //         results = cache.get(`autocomplete.items.${focusedValue}`);
        //         // console.log(`[Cached]Autocomplete for ${focusedValue} took ${performance.now() - start}ms`);
        //     }
        //     // console.log(results)
        //     if (!results) return


        //     var itemOptions = []
        //     results.forEach(element => {
        //         itemOptions.push(element.item)
        //     })


        //     const choices = itemOptions.slice(0, 25)
        //     // console.log(`${focusedValue}\n${choices.join(', ')}`);

        //     // const filtered = choices.filter(choice => choice.startsWith(toTitleCase(focusedValue)));

        //     end = performance.now();
        //     // console.log(`Search took ${end - start} milliseconds.`);
        //     const response = await interaction.respond(
        //         choices.map(choice => ({
        //             name: choice.name,
        //             value: choice.name,
        //         })),
        //     );
        // }


    },
};


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}