// Level data: each entry defines the totalXp threshold and class tier for that level
export const LEVEL_DATA = [
  { level: 1, xpRequired: 0, totalXp: 0, class: "Wanderer" },
  { level: 2, xpRequired: 50, totalXp: 50, class: "Wanderer" },
  { level: 3, xpRequired: 75, totalXp: 125, class: "Wanderer" },
  { level: 4, xpRequired: 100, totalXp: 225, class: "Wanderer" },
  { level: 5, xpRequired: 125, totalXp: 350, class: "Wanderer" },
  { level: 6, xpRequired: 150, totalXp: 500, class: "Wanderer" },
  { level: 7, xpRequired: 175, totalXp: 675, class: "Wanderer" },
  { level: 8, xpRequired: 200, totalXp: 875, class: "Wanderer" },
  { level: 9, xpRequired: 225, totalXp: 1100, class: "Wanderer" },
  { level: 10, xpRequired: 250, totalXp: 1350, class: "Wanderer" },
  { level: 11, xpRequired: 300, totalXp: 1650, class: "Wanderer" },
  { level: 12, xpRequired: 350, totalXp: 2000, class: "Wanderer" },
  { level: 13, xpRequired: 400, totalXp: 2400, class: "Wanderer" },
  { level: 14, xpRequired: 450, totalXp: 2850, class: "Wanderer" },
  { level: 15, xpRequired: 500, totalXp: 3350, class: "Adventurer" },
  { level: 16, xpRequired: 550, totalXp: 3900, class: "Adventurer" },
  { level: 17, xpRequired: 600, totalXp: 4500, class: "Adventurer" },
  { level: 18, xpRequired: 650, totalXp: 5150, class: "Adventurer" },
  { level: 19, xpRequired: 700, totalXp: 5850, class: "Adventurer" },
  { level: 20, xpRequired: 750, totalXp: 6600, class: "Adventurer" },
  { level: 21, xpRequired: 800, totalXp: 7400, class: "Adventurer" },
  { level: 22, xpRequired: 850, totalXp: 8250, class: "Adventurer" },
  { level: 23, xpRequired: 900, totalXp: 9150, class: "Adventurer" },
  { level: 24, xpRequired: 950, totalXp: 10100, class: "Adventurer" },
  { level: 25, xpRequired: 1000, totalXp: 11100, class: "Veteran" },
  { level: 26, xpRequired: 1050, totalXp: 12150, class: "Veteran" },
  { level: 27, xpRequired: 1100, totalXp: 13250, class: "Veteran" },
  { level: 28, xpRequired: 1150, totalXp: 14400, class: "Veteran" },
  { level: 29, xpRequired: 1200, totalXp: 15600, class: "Veteran" },
  { level: 30, xpRequired: 1250, totalXp: 16850, class: "Veteran" },
  { level: 31, xpRequired: 1300, totalXp: 18150, class: "Veteran" },
  { level: 32, xpRequired: 1350, totalXp: 19500, class: "Veteran" },
  { level: 33, xpRequired: 1400, totalXp: 20900, class: "Veteran" },
  { level: 34, xpRequired: 1450, totalXp: 22350, class: "Veteran" },
  { level: 35, xpRequired: 1500, totalXp: 23850, class: "Champion" },
  { level: 36, xpRequired: 1550, totalXp: 25400, class: "Champion" },
  { level: 37, xpRequired: 1600, totalXp: 27000, class: "Champion" },
  { level: 38, xpRequired: 1650, totalXp: 28650, class: "Champion" },
  { level: 39, xpRequired: 1700, totalXp: 30350, class: "Champion" },
  { level: 40, xpRequired: 1750, totalXp: 32100, class: "Champion" },
  { level: 41, xpRequired: 1800, totalXp: 33900, class: "Champion" },
  { level: 42, xpRequired: 1850, totalXp: 35750, class: "Champion" },
  { level: 43, xpRequired: 1900, totalXp: 37650, class: "Champion" },
  { level: 44, xpRequired: 1950, totalXp: 39600, class: "Champion" },
  { level: 45, xpRequired: 2000, totalXp: 41600, class: "Legend" },
  { level: 46, xpRequired: 2050, totalXp: 43650, class: "Legend" },
  { level: 47, xpRequired: 2100, totalXp: 45750, class: "Legend" },
  { level: 48, xpRequired: 2150, totalXp: 47900, class: "Legend" },
  { level: 49, xpRequired: 2200, totalXp: 50100, class: "Legend" },
  { level: 50, xpRequired: 2250, totalXp: 52350, class: "Legend" },
  { level: 51, xpRequired: 2300, totalXp: 54650, class: "Legend" },
  { level: 52, xpRequired: 2350, totalXp: 57000, class: "Legend" },
  { level: 53, xpRequired: 2400, totalXp: 59400, class: "Legend" },
  { level: 54, xpRequired: 2450, totalXp: 61850, class: "Legend" },
  { level: 55, xpRequired: 2500, totalXp: 64350, class: "Mythic" },
  { level: 56, xpRequired: 2600, totalXp: 66950, class: "Mythic" },
  { level: 57, xpRequired: 2700, totalXp: 69650, class: "Mythic" },
  { level: 58, xpRequired: 2800, totalXp: 72450, class: "Mythic" },
  { level: 59, xpRequired: 2900, totalXp: 75350, class: "Mythic" },
  { level: 60, xpRequired: 3000, totalXp: 78350, class: "Mythic" },
  { level: 61, xpRequired: 3150, totalXp: 81500, class: "Mythic" },
  { level: 62, xpRequired: 3300, totalXp: 84800, class: "Mythic" },
  { level: 63, xpRequired: 3450, totalXp: 88250, class: "Mythic" },
  { level: 64, xpRequired: 3600, totalXp: 91850, class: "Mythic" },
  { level: 65, xpRequired: 3750, totalXp: 95600, class: "Mythic" },
  { level: 66, xpRequired: 3900, totalXp: 99500, class: "Mythic" },
  { level: 67, xpRequired: 4050, totalXp: 103550, class: "Mythic" },
  { level: 68, xpRequired: 4200, totalXp: 107750, class: "Mythic" },
  { level: 69, xpRequired: 4350, totalXp: 112100, class: "Mythic" },
  { level: 70, xpRequired: 4500, totalXp: 116600, class: "Mythic" },
  { level: 71, xpRequired: 4750, totalXp: 121350, class: "Mythic" },
  { level: 72, xpRequired: 5000, totalXp: 126350, class: "Mythic" },
  { level: 73, xpRequired: 5250, totalXp: 131600, class: "Mythic" },
  { level: 74, xpRequired: 5500, totalXp: 137100, class: "Mythic" },
  { level: 75, xpRequired: 6000, totalXp: 143100, class: "Grand Mythic" },
];

// Legacy LEVEL_THRESHOLDS for backward compat (maps to totalXp values)
export const LEVEL_THRESHOLDS = LEVEL_DATA.map(d => d.totalXp);

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_DATA.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_DATA[i].totalXp) {
      return LEVEL_DATA[i].level;
    }
  }
  return 1;
}

export function getClassTier(level: number): string {
  const entry = LEVEL_DATA.find(d => d.level === level);
  if (entry) return entry.class;
  // Beyond max level
  return "Grand Mythic";
}

export function getXpForNextLevel(currentLevel: number): number {
  const idx = LEVEL_DATA.findIndex(d => d.level === currentLevel + 1);
  if (idx !== -1) return LEVEL_DATA[idx].totalXp;
  // Beyond max: continue scaling with 6000 XP per level
  const maxEntry = LEVEL_DATA[LEVEL_DATA.length - 1];
  return maxEntry.totalXp + (currentLevel + 1 - maxEntry.level) * 6000;
}

export function getXpProgress(xp: number, level: number): { current: number; required: number; percentage: number } {
  const currentLevelEntry = LEVEL_DATA.find(d => d.level === level);
  const currentLevelXp = currentLevelEntry ? currentLevelEntry.totalXp : 0;
  const nextLevelXp = getXpForNextLevel(level);

  const current = xp - currentLevelXp;
  const required = nextLevelXp - currentLevelXp;
  const percentage = required > 0 ? Math.min((current / required) * 100, 100) : 100;

  return { current, required, percentage };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
