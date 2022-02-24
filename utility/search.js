const gblData = require('../data/unitData.json')
const logData = require('../data/mapLogsjson.json')
const cache = require('./cache.js')
const Fuse = require("fuse.js");



exports.unitSearch = function (unit_name) {

    if(cache.get(`search_${unit_name}`)) {
        return cache.get(`search_${unit_name}`);
    }

    const options = {
        includeScore: true,
        keys: [
            {
                name: 'Unit Name',
                weight: 0.7
            },
            {
                name: 'ALIASES',
                weight: 0.8
            }
        ],
        findAllMatches: true,
        threshold: 0.5,
    };
    const fuse = new Fuse(gblData, options);
    const result = fuse.search(unit_name);

    // console.log(result)
    results = result;

    cache.set(`search_${unit_name}`, results, 0);
    return results;

};

exports.unitSearchExact = function (unit_name) {
    const options = {
        includeScore: true,
        keys: ['Unit Name'],
        findAllMatches: true,
        threshold: 0.0,
    };
    const fuse = new Fuse(gblData, options);
    const result = fuse.search(unit_name);

    // console.log(result)
    results = result;


    return results;

};


exports.logSearch = function (log_text) {
    const options = {
        includeScore: true,
        keys: [
            {
                name: 'Log',
                weight: 1
            }
        ],
        findAllMatches: true,
        threshold: 0.4,
    };
    const fuse = new Fuse(logData, options);
    const result = fuse.search(log_text);

    // console.log(result)
    results = result;


    return results;

};