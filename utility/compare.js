const unitEmbedGen = require('./getUnitData.js');
const imgGen = require('./HTML2IMG.js');
const search = require('./search.js');




exports.get = async function (options) {

    var firstUnit = options.firstUnit.name;
    var secondUnit = options.secondUnit.name;

    var firstUnitLevel = options.firstUnit.level;
    var secondUnitLevel = options.secondUnit.level;

    var firstUnitStarRank = options.firstUnit.starRank;
    var secondUnitStarRank = options.secondUnit.starRank;

    var firstUnitBuff = options.firstUnit.buffs;
    var secondUnitBuff = options.secondUnit.buffs;


    unitOneSearchResults = await search.unitSearch(firstUnit);
    unitTwoSearchResults = await search.unitSearch(secondUnit);

    if(!unitOneSearchResults || !unitTwoSearchResults) {
        return false;
    }



};