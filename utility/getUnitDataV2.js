const unitData = require('../data/unitData.json');
// unitData to a map
const unitDataMap = new Map();
unitData.forEach((unit) => {
    unitDataMap.set(unit.name, unit);
    });