const cache = require('./utility/cache.js');
const fs = require('fs');
sTier = []
aTier = []
bTier = []
cTier = []
dTier = []
async function updateTierList() {

    unitData = JSON.parse(fs.readFileSync(`/home/tristan/Downloads/pelops/data/unitData.json`, 'utf8'));
    unitData.forEach(unit => {
        unitTier = unit['TIER']
        console.log(unitTier)
        if (unitTier == "S") {
            console.log("S tier")
            sTier.push(unit['Unit Name'])
        }
        if (unitTier == "A") {
            aTier.push(unit['Unit Name'])
        }
        if (unitTier == "B") {
            bTier.push(unit['Unit Name'])
        }
        if (unitTier == "C") {
            cTier.push(unit['Unit Name'])
        }
        if (unitTier == "D") {
            dTier.push(unit['Unit Name'])
        }
    })
    console.log('Done')
    tierList = {
        "S": sTier,
        "A": aTier,
        "B": bTier,
        "C": cTier,
        "D": dTier,

    }
    console.log(tierList)
    // cache.set("tierList", tierList, 0);
}


updateTierList()


// console.log(cache.get("tierList"))