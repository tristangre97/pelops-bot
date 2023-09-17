const unitData = require('../data/unitData.json');


oneStar = [];
twoStar = [];
threeStar = [];
fourStar = [];

for (item of unitData) {

    // Remove evolved units later

    if(item.AvailableInMap == "FALSE") continue

    if (item.RARITY == "1") {
        oneStar.push(item['Unit Name']);
    } else if (item.RARITY == "2") {
        twoStar.push(item['Unit Name']);
    } else if (item.RARITY == "3") {
        threeStar.push(item['Unit Name']);
    } else if (item.RARITY == "4") {
        fourStar.push(item['Unit Name']);
    }

}




mapData = {
    "Normal": {
        name: "Normal Expedition Map",
        pieces: 2,
        dropRates: {
            "1": 65.00,
            "2": 24.00,
            "3": 10.99,
            "4": 0.01,
        },
        guaranteedOne: 0,
        guaranteedTwo: 0,
        guaranteedThree: 0,
        guaranteedFour: 0,
        guaranteed: [],
        excluded: [],
    },
    "Rare": {
        name: "Rare Expedition Map",
        pieces: 4,
        dropRates: {
            "1": 55.00,
            "2": 28.00,
            "3": 16.50,
            "4": 0.50,
        },
        guaranteedOne: 0,
        guaranteedTwo: 0,
        guaranteedThree: 0,
        guaranteedFour: 0,
        guaranteed: [],
        excluded: [],
    },
    "Mysterious": {
        name: "Mysterious Expedition Map",
        pieces: 6,
        dropRates: {
            "1": 50.00,
            "2": 30.50,
            "3": 19.00,
            "4": 0.50,
        },
        guaranteedOne: 0,
        guaranteedTwo: 0,
        guaranteedThree: 0,
        guaranteedFour: 0,
        guaranteed: [],
        excluded: [],
    },
    "Legendary": {
        name: "Legendary Expedition Map",
        pieces: 1,
        dropRates: {
            "1": 0.00,
            "2": 0.00,
            "3": 0.00,
            "4": 100.00,
        },
        guaranteedOne: 0,
        guaranteedTwo: 0,
        guaranteedThree: 0,
        guaranteedFour: 0,
        guaranteed: [],
        excluded: [],
    },
    "Magonote Island": {
        name: "Magonote Island Expedition Map",
        pieces: 6,
        dropRates: {
            "1": 50.00,
            "2": 28.00,
            "3": 19.00,
            "4": 3.00,
        },
        guaranteedOne: 0,
        guaranteedTwo: 0,
        guaranteedThree: 0,
        guaranteedFour: 0,
        guaranteed: [],
        excluded: ['Desghidorah', 'Kong', 'Godzilla 21', 'Ultraman', 'Neronga', 'Zetton', 'Mefilas', 'EVA-01', 'Sachiel (4th Angel)', 'Mechagodzilla 21'],
    },
    "Test": {
        name: "Test",
        pieces: 2,
        dropRates: {
            "1": 0.00,
            "2": 0.00,
            "3": 0.00,
            "4": 100.00,
        },
        guaranteedOne: 0,
        guaranteedTwo: 0,
        guaranteedThree: 0,
        guaranteedFour: 0,
        guaranteed: [],
        excluded: ['Desghidorah', 'Kong', 'Godzilla 21', 'Ultraman', 'Neronga', 'Zetton', 'Mefilas', 'EVA-01', 'Sachiel (4th Angel)', 'Mechagodzilla 21'],
    }
}



exports.mapDrop = function (mapType) {
    let drops = new Array();
    dropData = mapData[mapType];
    maxPieces = dropData.pieces;
    while (drops.length < maxPieces) {

        // Guaranteed drops
        if (drops.length < dropData.guaranteedOne) {
            drops.push(oneStar[Math.floor(Math.random() * oneStar.length)]);
        } else if (drops.length < dropData.guaranteedOne + dropData.guaranteedTwo) {
            drops.push(twoStar[Math.floor(Math.random() * twoStar.length)]);
        } else if (drops.length < dropData.guaranteedOne + dropData.guaranteedTwo + dropData.guaranteedThree) {
            drops.push(threeStar[Math.floor(Math.random() * threeStar.length)]);
        } else if (drops.length < dropData.guaranteedOne + dropData.guaranteedTwo + dropData.guaranteedThree + dropData.guaranteedFour) {
            drops.push(fourStar[Math.floor(Math.random() * fourStar.length)]);
        }

        // Guaranteed units
        if (dropData.guaranteed.length > 0) {
            for (item of dropData.guaranteed) {
                if (drops.length < maxPieces) {
                    drops.push(item);
                }
            }
        }


        var dropRate = Math.random() * 100;

        if (dropRate <= dropData.dropRates["1"]) {
            drops.push(oneStar[Math.floor(Math.random() * oneStar.length)]);
        } else if (dropRate <= dropData.dropRates["1"] + dropData.dropRates["2"]) {
            drops.push(twoStar[Math.floor(Math.random() * twoStar.length)]);
        } else if (dropRate <= dropData.dropRates["1"] + dropData.dropRates["2"] + dropData.dropRates["3"]) {
            drops.push(threeStar[Math.floor(Math.random() * threeStar.length)]);
        } else if (dropRate <= dropData.dropRates["1"] + dropData.dropRates["2"] + dropData.dropRates["3"] + dropData.dropRates["4"]) {
            drops.push(fourStar[Math.floor(Math.random() * fourStar.length)]);
        }

        // Remove duplicates
        drops = [...new Set(drops)];

        // Check for excluded units
        if (dropData.excluded.length > 0) {
            for (item of dropData.excluded) {
                if (drops.includes(item)) {
                    drops.splice(drops.indexOf(item), 1);
                }
            }
        }


    }


    return {
        units: drops,
        map: dropData.name,
        pieces: maxPieces,
        dropData: dropData,

    }
}