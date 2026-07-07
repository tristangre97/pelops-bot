const unitData = require('./data/unitData.json');
const fs = require('node:fs');

const ud = {}

async function main() {
    for (const unit in unitData) {
        data = unitData[unit]
        image = data.image
        if (!image) {
            console.log(`No image for ${data.name}`);
            ud[unit] = data;
            continue;
        };
        // Download image to /home/tristan/Downloads/pelops/images/units
        const imageData = await fetch(image);
        const buffer = await imageData.arrayBuffer();
        fs.writeFileSync(`/home/tristan/Downloads/pelops/images/units/${data.name.replace(/[^a-zA-Z0-9]/g, "")}.png`, Buffer.from(buffer));
        data.image = `${data.name.replace(/[^a-zA-Z0-9]/g, "")}.png`
        ud[unit] = data;
    }
    console.log(ud);
    fs.writeFileSync('./data/unitDataNew.json', JSON.stringify(ud, null, 2));
    console.log(`Downloaded ${Object.keys(unitData).length} images!`);
}


main();