// XP thresholds for each level
export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  1000,  // Level 5
  1750,  // Level 6
  2750,  // Level 7
  4000,  // Level 8
  5500,  // Level 9
  7500,  // Level 10
  10000, // Level 11
  13000, // Level 12
  17000, // Level 13
  22000, // Level 14
  28000, // Level 15
  35000, // Level 16
  43000, // Level 17
  52000, // Level 18
  62000, // Level 19
  75000, // Level 20
];

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (currentLevel - LEVEL_THRESHOLDS.length + 1) * 15000;
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

export function getXpProgress(xp: number, level: number): { current: number; required: number; percentage: number } {
  const currentLevelXp = level <= LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level - 1] :
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (level - LEVEL_THRESHOLDS.length) * 15000;
  const nextLevelXp = getXpForNextLevel(level);

  const current = xp - currentLevelXp;
  const required = nextLevelXp - currentLevelXp;
  const percentage = Math.min((current / required) * 100, 100);

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
