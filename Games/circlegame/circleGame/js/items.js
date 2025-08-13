// items.js
export const DIFFICULTY_ORDER = ["easy", "normal", "hard", "veryHard", "extreme", "max"];

export const difficultyConfig = {
  easy:     { name: "Easy",     batchSize: 1, disappearMs: 1200, bossBaseHP: 20 },
  normal:   { name: "Normal",   batchSize: 2, disappearMs: 1000, bossBaseHP: 30 },
  hard:     { name: "Hard",     batchSize: 3, disappearMs:  800, bossBaseHP: 40 },
  veryHard: { name: "VeryHard", batchSize: 4, disappearMs:  600, bossBaseHP: 50 },
  extreme:  { name: "Extreme",  batchSize: 5, disappearMs:  500, bossBaseHP: 60 },
  max:      { name: "Max",      batchSize: 6, disappearMs:  400, bossBaseHP: 70 },
};

// main spawnable items (weighted selection)
export const itemList = [
  { name: 'blueCircle', color: 'blue', weight: 80, points: 1,  healthEffect: +10 },
  { name: 'redCircle',  color: 'red',  weight: 20, points: 0,  healthEffect: -5  },
  // add more items anytime (just set weight/points/healthEffect)
];

// consumables (spawn under conditions; no weight needed unless you want multiple kinds)
export const consumableItemList = [
  { name: 'heart', display: '❤️', color: '', points: 0, healthEffect: +20, aliveMs: 1000 },
  // add more consumables here; each must define .aliveMs for single appearance life
];

// constants controlling behavior
export const BATCH_GAP_MS = 500;   // fixed 0.5s gap between circles in a batch
export const BATCH_BASE_INTERVAL_MS = 1500; // base wait before starting a batch (tuned by difficulty if you want)
export const BOSS_SCORE_STEP = 30; // 30,60,90,...
export const BOSSES_PER_TIER_UP = 3; // after 3 bosses, escalate difficulty tier
