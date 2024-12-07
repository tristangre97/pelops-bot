const unitEmbed = require("../../utility/getUnitData");
module.exports = {
    name: "getUnitData",
    run: async (args) => {

        let { unit, level } = args;

        data = await unitEmbed.get({
            name: unit,
            level: level,
            id: Date.now(),
        })


        return data.fields;
    },
};
