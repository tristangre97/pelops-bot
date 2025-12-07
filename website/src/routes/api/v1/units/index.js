const express = require('express');
const router = express.Router();
const fs = require("node:fs");
const unitEmbedGen = require('../../../../../../utility/getUnitData.js');

router.get('/', async (req, res) => {
    const unitName = req.query.unit;
    const unitData = await unitEmbedGen.getAll(unitName);
    res.header("Content-Type", "application/json");
    return res.send(JSON.stringify(unitData, null, 4));
});

router.post('/', async (req, res) => {
    const newData = req.body;

    // Read existing data
    let oldData = {};
    try {
        const existingContent = fs.readFileSync('data/unitData.json', 'utf8');
        oldData = JSON.parse(existingContent);
    } catch (error) {
        console.log('No existing data file found, treating all units as new');
    }

    const timestamp = new Date().toISOString();
    const changes = {
        added: [],
        updated: [],
        unchanged: 0
    };

    // Process each unit in the new data
    for (const unitName in newData) {
        const newUnit = newData[unitName];
        const oldUnit = oldData[unitName];

        if (!oldUnit) {
            // New unit - add "added" timestamp
            newUnit.added = timestamp;
            changes.added.push(unitName);
        } else {
            // Existing unit - check if data changed
            // Create copies without timestamp fields for comparison
            const oldUnitCopy = { ...oldUnit };
            const newUnitCopy = { ...newUnit };
            delete oldUnitCopy.added;
            delete oldUnitCopy.lastUpdate;
            delete newUnitCopy.added;
            delete newUnitCopy.lastUpdate;

            const hasChanged = JSON.stringify(oldUnitCopy) !== JSON.stringify(newUnitCopy);

            if (hasChanged) {
                // Unit was modified - update "lastUpdate" timestamp
                // Preserve original "added" timestamp if it exists
                if (oldUnit.added) {
                    newUnit.added = oldUnit.added;
                }
                newUnit.lastUpdate = timestamp;
                changes.updated.push(unitName);
            } else {
                // No changes - preserve existing timestamps
                if (oldUnit.added) {
                    newUnit.added = oldUnit.added;
                }
                if (oldUnit.lastUpdate) {
                    newUnit.lastUpdate = oldUnit.lastUpdate;
                }
                changes.unchanged++;
            }
        }
        newData[unitName].id = unitName;
    }

    // Write updated data
    fs.writeFileSync('data/unitData.json', JSON.stringify(newData, null, 2));

    res.header("Content-Type", "application/json");
    return res.send(JSON.stringify({
        status: "success",
        message: "Data saved successfully!",
        changes: changes,
        timestamp: timestamp
    }, null, 4));
});

module.exports = router;