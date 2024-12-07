const unitEmbed = require("../../utility/randomDeck");
module.exports = {
    name: "randomDeck",
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
