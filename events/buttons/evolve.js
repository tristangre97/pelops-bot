const cache = require("../../utility/cache");
const unitEmbedGen = require('../../utility/getUnitData.js');

module.exports = {
    name: "evolve",
    requiresID: true,
    originalUserOnly: true,
    run: async ({ interaction, interactionID, buttonData }) => {
        interactionData = await cache.get(`pelops:interactions:${interactionID}`);
        evolution = buttonData[2];
        // const options = {
        //     id: id,
        //     user: interaction.user.id,
        //     name: unitName,
        //     level: unitLevel,
        //     star_rank: 1,
        //     apply_boost: false,
        // }    

        interactionData.name = evolution

        cache.set(`pelops:interactions:${interactionID}`, interactionData, 600);
        unitData = await unitEmbedGen.get(interactionData)

        await interaction.update(
            {
                embeds: [unitData.embed],
                components: unitData.components
            }
        )

    },
};
