const fs = require('fs');
const cache = require('./cache.js')
const Fuse = require("fuse.js");

let starRankData = require(`../data/starRankRewards.json`)
let gblData = require(`../data/unitData.json`)



exports.unitSearch = function (unit_name) {
    starRankData = JSON.parse(cache.get("starRankRewards")) 
    gblData = JSON.parse(cache.get("unitData")) 

    if (cache.get(`search_${unit_name}`)) {
        return cache.get(`search_${unit_name}`);
    }

    const options = {
        includeScore: true,
        keys: [{
                name: 'Unit Name',
                weight: 0.5
            },
            {
                name: 'ALIASES',
                weight: 0.8
            }
        ],
        findAllMatches: true,
    };
    const fuse = new Fuse(gblData, options);
    const result = fuse.search(unit_name);

    // console.log(result)
    results = result;

    cache.set(`search_${unit_name}`, results, 0);
    return results;

};


exports.starRankSearch = function (unit) {
    if(cache.get(`starRank_${unit}`))  return cache.get(`starRank_${unit}`);

    const options = {
        includeScore: true,
        keys: [{
            name: 'UNIT',
            weight: 1
        }],
        findAllMatches: true,
        threshold: 0.3,
    };
    const fuse = new Fuse(starRankData, options);
    const results = fuse.search(unit);

    if(results.length == 0) return null;
    
    cache.set(`starRank_${unit}`, results[0].item, 0);
    return results[0].item;

};