const { parentPort, workerData } = require('worker_threads');
const Fuse = require('fuse.js');
const process = require('node:process');

function search(searchList, query, searchKeys, threshold) {
    focusedValueLength = query.length;
    const fuse = new Fuse(searchList, {
        keys: searchKeys,
        shouldSort: true,
        threshold: threshold || 0.4,
        findAllMatches: true,
    });
    searchResults = fuse.search(query);
    return searchResults.slice(0, 100)
}

const results = search(workerData.searchList, workerData.query, workerData.searchKeys, workerData.threshold);
parentPort.postMessage(results).then(() => {
    process.exit(0)
})

