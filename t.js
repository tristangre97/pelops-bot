const search = require('./utility/search')
const mathjs = require('mathjs')

var results = search.starRankSearch('Hedorah')
return console.log(results)
totalHPBonus = 0;
totalDmgBonus = 0

star_rank = 5
i = 1
for (item in results) {
    bonusType = results[item]
    if (i >= star_rank) {
    } else {
        if (bonusType.startsWith('HP')) {
            totalHPBonus = Math.abs(totalHPBonus + Number(bonusType.split('+')[1].trim().replace('%', '')))
        }
        if (bonusType.startsWith('Dmg')) {
            totalDmgBonus = Math.abs(totalDmgBonus + Number(bonusType.split('+')[1].trim().replace('%', '')))
        }
    }
    i++
}
console.log(totalHPBonus)
console.log(totalDmgBonus)

