const express = require('express');
const router = express.Router();
const unitEmbedGen = require('../../../../../../utility/getUnitData.js');
const upgradeCosts = require('../../../../../../data/upgradeCosts.js');

// Get upgrade costs for a specific rarity and level
router.get('/', async (req, res) => {
    const rarity = parseInt(req.query.rarity);
    const level = parseInt(req.query.level);
    const toLevel = parseInt(req.query.toLevel);

    // Validate rarity
    if (!rarity || rarity < 1 || rarity > 4) {
        return res.status(400).json({
            error: 'Invalid rarity. Must be between 1 and 4.'
        });
    }

    // If toLevel is provided, return cumulative costs
    if (toLevel) {
        if (toLevel < 1 || toLevel > unitEmbedGen.getMaxLevel(rarity)) {
            return res.status(400).json({
                error: `Invalid toLevel. Must be between 1 and ${unitEmbedGen.getMaxLevel(rarity)} for ${rarity}-star units.`
            });
        }

        const cumulativeCosts = unitEmbedGen.calculateCumulativeCosts(rarity, toLevel);
        return res.json({
            rarity,
            toLevel,
            cumulativeCost: {
                gTokens: cumulativeCosts.totalCost,
                pieces: cumulativeCosts.totalPieces
            }
        });
    }

    // If level is provided, return specific level upgrade cost
    if (level) {
        const maxLevel = unitEmbedGen.getMaxLevel(rarity);
        if (level < 2 || level > maxLevel) {
            return res.status(400).json({
                error: `Invalid level. Must be between 2 and ${maxLevel} for ${rarity}-star units.`
            });
        }

        const upgradeCost = unitEmbedGen.getUpgradeCostData(rarity, level);
        if (!upgradeCost) {
            return res.status(404).json({
                error: 'Upgrade cost data not found for this rarity and level.'
            });
        }

        return res.json({
            rarity,
            level,
            upgradeCost: {
                gTokens: upgradeCost.cost,
                pieces: upgradeCost.pieces
            }
        });
    }

    // If no level or toLevel provided, return all upgrade costs for the rarity
    const rarityKey = `${rarity}Star`;
    const allCosts = upgradeCosts[rarityKey];

    if (!allCosts) {
        return res.status(404).json({
            error: 'Upgrade cost data not found for this rarity.'
        });
    }

    const maxLevel = unitEmbedGen.getMaxLevel(rarity);
    const maxLevelCosts = unitEmbedGen.calculateCumulativeCosts(rarity, maxLevel);

    res.json({
        rarity,
        maxLevel,
        maxLevelUpgradeCosts: {
            gTokens: maxLevelCosts.totalCost,
            pieces: maxLevelCosts.totalPieces
        },
        levelUpgrades: allCosts.map(cost => ({
            level: parseInt(cost.level),
            gTokens: parseInt(cost.cost),
            pieces: parseInt(cost.pieces)
        }))
    });
});

module.exports = router;
