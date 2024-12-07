const unitData = require('./data/unitData.json');
const fs = require('node:fs');

const ud = {}

async function main() {
    for (const unit in unitData) {
        data = unitData[unit]
        image = data.image
        imageCheck = await fetch(image, { method: 'HEAD' })
        if (imageCheck.ok) {
            ud[unit] = data
        } else {
            console.log(`Image not found for ${data.name}`)
        }
    }

}


main();