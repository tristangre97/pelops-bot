const upgradePercent = {
  1: {
      "1-5": "20",
      "5-10": "10",
      "10-15": "15",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
      "41-50": "0.05",
  },
  2: {
      "1-5": "20",
      "5-10": "10",
      "10-15": "15",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
      "41-50": "0.05",
  },
  3: {
      "1-5": "12",
      "5-10": "11",
      "10-15": "11",
      "15-20": "10",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
      "41-50": "0.5",
  },

  4: {
      "1-5": "30",
      "5-10": "3",
      "10-15": "1",
      "15-20": "1",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.5",
  },
};
const leaderUpgradePercent = {
  3: {
      "1-5": "16",
      "5-10": "5",
      "10-15": "8",
      "15-20": "16",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
      "41-50": "0.50",
  },

  4: {
      "1-5": "2",
      "5-10": "3",
      "10-15": "3",
      "15-20": "3",
      "20-25": "2",
      "25-30": "2",
      "31-40": "0.50",
  },
}

function calculateStat(level, unitRarity, stat, isLeader = false) {
  level = parseInt(level);
  unitRarity = parseInt(unitRarity);
  stat = parseInt(stat);

  const levelRanges = {
      "1-5": [0, 4],
      "5-10": [5, 9],
      "10-15": [10, 14],
      "15-20": [15, 19],
      "20-25": [20, 24],
      "25-30": [25, 29],
      "31-40": [30, 40],
      "41-50": [41, 50]
  };

  let currentLevel = 1;
  let lastRange = null;

  while (currentLevel < level) {
      let rangeKey = Object.keys(levelRanges).find(range => {
          let [min, max] = levelRanges[range];
          return currentLevel >= min && currentLevel <= max;
      });

      if (rangeKey !== lastRange) {
          lastRange = rangeKey;
          var percent = upgradePercent[unitRarity][rangeKey];
          var leaderPercent = leaderUpgradePercent?.[unitRarity]?.[rangeKey] || percent;
      }

      const effectivePercent = isLeader ? leaderPercent : percent;
      // stat = Math.ceil(stat + (stat * (effectivePercent / 100)));
      stat = Math.ceil(stat + (stat * (effectivePercent / 100)));
      console.log((stat * (effectivePercent / 100)))

      currentLevel++;
  }

  return stat;
}


console.log(`
410 || ${calculateStat(5, 4, 143)}
820 || ${calculateStat(5, 4, 286)}
`)