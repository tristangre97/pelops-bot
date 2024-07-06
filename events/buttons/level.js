const cache = require("../../utility/cache");
const unitEmbedGen = require('../../utility/getUnitData.js');

module.exports = {
    name: "level",
    requiresID: true,
    originalUserOnly: true,
    run: async ({ interaction, interactionID, buttonData }) => {
        interactionData = await cache.get(`pelops:interactions:${interactionID}`);
        type = buttonData[2];

        // const options = {
        //     id: id,
        //     user: interaction.user.id,
        //     name: unitName,
        //     level: unitLevel,
        //     star_rank: 1,
        //     apply_boost: false,
        // }

        if (type == 'up') interactionData.level += 1;
        else if (type == 'down') interactionData.level -= 1;
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
