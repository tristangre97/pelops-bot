const express = require('express');
const router = express.Router();
const fs = require('node:fs');
const path = require('node:path');

const battleMemoriesPath = path.join(__dirname, '../../../../../../data/battleMemories.json');

router.get('/', async (req, res) => {
    // Clear cache and reload to get fresh data
    delete require.cache[require.resolve('../../../../../../data/battleMemories.json')];
    const battleMemories = require("../../../../../../data/battleMemories.json");

    res.header("Content-Type", "application/json");
    return res.send(JSON.stringify(battleMemories, null, 4));
});

router.post('/', async (req, res) => {
    const newBattleMemories = req.body;
    fs.writeFileSync(battleMemoriesPath, JSON.stringify(newBattleMemories, null, 4));
    res.header("Content-Type", "application/json");
    return res.send(JSON.stringify({
        message: "Battle memories updated successfully",
        data: newBattleMemories
    }, null, 4));
});


module.exports = router;