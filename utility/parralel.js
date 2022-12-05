

exports.process = async function (functions) {
    console.log(`Got ${functions.length} functions to process`)
    console.time('parralel')
    data = await Promise.all(functions)
    console.timeEnd('parralel')
    return data
};