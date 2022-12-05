const unitEmbedGen = require('./utility/getUnitData.js');
const search = require('./utility/search.js');



async function main() {
  searchResults = await search.unitSearch(`Godzilla 89`);
  unit = searchResults[0].item;
  start = performance.now();
  data = await unitEmbedGen.getUnitEmbed(unit, 9, 1, null, true);
  end = performance.now();
  console.log(end - start);
  // console.log(data);
}

main();