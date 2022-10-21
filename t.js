const randomDeck = require('./utility/randomDeck.js')
const random = require('./utility/random.js')



async function test() {
        options = {
        id: random.id(10),
        disable_unavailable_units: true,
        user: 'test',

    }

    var deck = await randomDeck.get(options)
    // console.log(deck)
}


const arrayOfPromises = [
    test(),
]
async function processParallel(arrayOfPromises) {
    console.time('Processing Parallel')
    await Promise.all(arrayOfPromises)
    console.timeEnd('Processing Parallel')
    console.log('Processing Parallel Complete  \n')
    return;
}
processParallel(arrayOfPromises)
