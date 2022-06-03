const search = require('./utility/search')
const unitEmbedGen = require('./utility/getUnitData.js');

var seasonOptions = []

i = 0;

while(i < 14) {
    var data = {
        name: `${i}`,
        value: `${i}`,
    }
    seasonOptions.push(data)
    i++
}


return console.log(seasonOptions)


async  function unit() {
    searchResults = await search.unitSearch(' Shin Godzilla (Stage 2)');
unit = searchResults[0].item;

embed = await unitEmbedGen.getUnitEmbed(unit, 30)

console.log(embed)

}


unit()





var updateList = [{
    name: "unitData",
    fullName: "Unit Data",
    type: "download",
    url: "https://sheetsu.com/apis/v1.0su/bfb7ac95068b",
},
{
    name: "mapLogs",
    fullName: "Map Logs",
    type: "download",
    url: "https://sheetsu.com/apis/v1.0bu/9acebc3f7c89",
},
{
    name: "autocomplete",
    fullName: "Autocomplete",
    type: "cache",
},
{
    name: "tierList",
    fullName: "Tier List",
    type: "download",
    url: "https://sheetsu.com/apis/v1.0bu/9acebc3f7c89",
}
];