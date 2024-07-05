const unitData = require('./data/unitData.json');
const fs = require('node:fs');

const ud = {}

async function main() {
    console.log(unitData)
    for (const unit in unitData) {
        data = unitData[unit]
        ud[data.name] = data
    }

    fs.writeFileSync('./data/unitDataV3.js', JSON.stringify(ud  , null, 4))
}


main();