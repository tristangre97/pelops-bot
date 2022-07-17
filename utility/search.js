const fs = require('fs');
const cache = require('./cache.js')
const Fuse = require("fuse.js");
const starRankData = require(`../data/starRankRewards.json`)




exports.unitSearch = function (unit_name) {
    const gblData = JSON.parse(cache.get('unitData'));

    if (cache.get(`search_${unit_name}`)) {
        return cache.get(`search_${unit_name}`);
    }

    const options = {
        includeScore: true,
        keys: [{
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
    const gblData = JSON.parse(cache.get('unitData'));
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
    const logData = JSON.parse(cache.get('mapLogs'));
    const options = {
        includeScore: true,
        keys: [{
            name: 'Log',
            weight: 1
        }],
        findAllMatches: true,
        threshold: 0.4,
    };
    const fuse = new Fuse(logData, options);
    const result = fuse.search(log_text);

    // console.log(result)
    results = result;


    return results;

};


exports.logUnitSearch = function (unit) {
    const logData = JSON.parse(cache.get('mapLogs'));
    const options = {
        includeScore: true,
        keys: [{
            name: 'Units',
            weight: 1
        }],
        findAllMatches: true,
        threshold: 0.1,
    };
    const fuse = new Fuse(logData, options);
    const results = fuse.search(unit);



    return results;

};



exports.leaderSearch = function (unit) {
    const leaderData = JSON.parse(cache.get('leaderData'));
    const options = {
        includeScore: true,
        keys: [{
            name: 'UNIT',
            weight: 1
        }],
        findAllMatches: true,
        threshold: 0.3,
    };
    const fuse = new Fuse(leaderData, options);
    const results = fuse.search(unit)[0].item;


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