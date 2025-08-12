// js/GameLogic.js
import { GameUI } from "./gameUI.js";

export const GameLogic = (() => {
  // Adjustable parameters for difficulties
  const difficulties = {
    easy: {
      name: 'Easy',
      healthDecreaseDuration: 15, // seconds for HP to go 100->0
      spawnInterval: 1500, // ms
      bossHealth: 20,
      bossPoints: 10,
      scoreThreshold: 30,
      circleHealthDecreaseTick: 500, // ms tick interval for health decrease
    },
    normal: {
      name: 'Normal',
      healthDecreaseDuration: 8,
      spawnInterval: 1200,
      bossHealth: 40,
      bossPoints: 20,
      scoreThreshold: 60,
      circleHealthDecreaseTick: 1000,
    },
    hard: {
      name: 'Hard',
      healthDecreaseDuration: 5,
      spawnInterval: 900,
      bossHealth: 60,
      bossPoints: 30,
      scoreThreshold: 90,
      circleHealthDecreaseTick: 500,
    },
  };

  // Game state
  let gameState = {
    maxHealth: 100,
    bossMaxHealth: 100,
    health: 100,
    score: 30,
    items: 100,
    multiplier: 0, // Health decrease per tick calculated
    currentDifficulty: 'easy',
    spawnIntervalId: null,
    healthTickIntervalId: null,
    bossActive: false,
    bossHealth: 0,
    inEndlessMode: false,
    scoreThresholdForBoss: difficulties.easy.scoreThreshold,
    lastBossScore: 0,
    itemList: [
      { name: 'blueCircle', color: 'blue', weight: 80, points: 1, healthEffect: +10 },
      { name: 'redCircle', color: 'red', weight: 20, points: 0, healthEffect: -5 },
    ],
  };

  // Endless mode related
  const endlessSettings = {
    minSpawnInterval: 500,
    spawnIntervalDecreaseStep: 50,
    healthDecreaseDurationDecreaseStep: 0.2,
    bossHealthIncreaseStep: 5,
    bossPointsIncreaseStep: 5,
    scoreThresholdIncreaseStep: 10,
  };

  // Helper: Calculate health decrease per tick based on duration and tick interval
  function calculateHealthDecreasePerTick(difficultyName) {
    const diff = difficulties[difficultyName];
    const ticks = diff.healthDecreaseDuration / (diff.circleHealthDecreaseTick / 1000);
    return gameState.maxHealth / ticks;
  }

  // Weighted random function for item selection
  function calculateRandomItem(itemList) {
    const sumWeight = itemList.reduce((acc, item) => acc + item.weight, 0);
    let randomWeight = Math.random() * sumWeight;
    let cumulativeWeight = 0;
    for (const item of itemList) {
      cumulativeWeight += item.weight;
      if (randomWeight < cumulativeWeight) return item.name;
    }
    return null;
  }

  // Initialize game state on start or restart
  function initGame(difficulty = 'easy') {
    gameState.currentDifficulty = difficulty;
    gameState.health = gameState.maxHealth;
    gameState.score = 28;
    gameState.items = 100;
    gameState.bossActive = false;
    gameState.bossHealth = 0;
    gameState.inEndlessMode = difficulty === 'endless';
    gameState.lastBossScore = 0;

    // Calculate multiplier (health decrease per tick)
    gameState.multiplier = calculateHealthDecreasePerTick(difficulty);

    // Set threshold for boss spawn
    gameState.scoreThresholdForBoss = difficulties[difficulty]?.scoreThreshold ?? difficulties.easy.scoreThreshold;

    if (gameState.inEndlessMode) {
      // Start endless with easy difficulty settings initially
      gameState.currentDifficulty = 'easy';
      gameState.multiplier = calculateHealthDecreasePerTick('easy');
      gameState.scoreThresholdForBoss = difficulties.easy.scoreThreshold;
    }

    GameUI.resetUI(gameState);
    startHealthTicker();
    startSpawning();
  }

  // Health ticker: decreases health periodically
  function startHealthTicker() {
    if (gameState.healthTickIntervalId) clearInterval(gameState.healthTickIntervalId);
    gameState.healthTickIntervalId = setInterval(() => {
      if (gameState.health <= 0) {
        stopGame();
        return;
      }

      gameState.health = Math.max(0, gameState.health - gameState.multiplier);
      GameUI.updateHealthBar(gameState.health, gameState.maxHealth);

      if (gameState.health <= 0) {
        stopGame();
      }
    }, difficulties[gameState.currentDifficulty].circleHealthDecreaseTick);
  }

  // Circle spawning logic
  function startSpawning() {
    if (gameState.spawnIntervalId) clearInterval(gameState.spawnIntervalId);

    let spawnInterval = difficulties[gameState.currentDifficulty]?.spawnInterval ?? 1500;

    // In endless mode, adjust spawn interval based on score
    if (gameState.inEndlessMode) {
      spawnInterval = Math.max(
        endlessSettings.minSpawnInterval,
        spawnInterval - ((gameState.score / endlessSettings.scoreThresholdIncreaseStep) * endlessSettings.spawnIntervalDecreaseStep)
      );
    }

    gameState.spawnIntervalId = setInterval(() => {
      if (gameState.health <= 0) {
        clearInterval(gameState.spawnIntervalId);
        return;
      }
      // Boss logic: spawn boss if threshold reached
      if (!gameState.bossActive && (gameState.score - gameState.lastBossScore) >= gameState.scoreThresholdForBoss) {
        spawnBoss();
      } else if (!gameState.bossActive) {
      GameUI.createCircle(calculateRandomItem(gameState.itemList), false, gameState.itemList)
        

      }
    }, spawnInterval);
  }

  // Spawn boss monster
function spawnBoss() {
  gameState.bossActive = true;

  // Stop health decrease while boss appears
  if (gameState.healthTickIntervalId) {
    clearInterval(gameState.healthTickIntervalId);
    gameState.healthTickIntervalId = null;
  }

  GameUI.showBossNotification();

  // Shrink grid to 1x1 first so box exists for boss circle
  GameUI.resizeGrid(1);

  // Set boss health based on difficulty, plus increments if endless
  let baseBossHealth = difficulties[gameState.currentDifficulty]?.bossHealth ?? 20;
  if (gameState.inEndlessMode) {
    const extraHP = Math.floor(gameState.score / endlessSettings.scoreThresholdIncreaseStep) * endlessSettings.bossHealthIncreaseStep;
    baseBossHealth += extraHP;
  }
  gameState.bossHealth = baseBossHealth;
  gameState.bossMaxHealth = baseBossHealth;
  // Spawn boss circle AFTER grid resize
  GameUI.spawnBossCircle(gameState.bossHealth);
  // Delay restarting health ticker until after notification hides (2 seconds)
  setTimeout(() => {
    startHealthTicker();
  }, 2100);
}

  // Boss circle clicked - reduce boss health
  

  function bossHit() {
    if (!gameState.bossActive) return;

    gameState.bossHealth--;
    GameUI.updateBossHealthBar(gameState.bossHealth, gameState.bossMaxHealth);

    if (gameState.bossHealth <= 0) {
      // Boss defeated
      gameState.bossActive = false;
      // Increase score for boss defeat
      let bossPoints = difficulties[gameState.currentDifficulty]?.bossPoints ?? 10;

      if (gameState.inEndlessMode) {
        const extraPoints = Math.floor((gameState.score / endlessSettings.scoreThresholdIncreaseStep)) * endlessSettings.bossPointsIncreaseStep;
        bossPoints += extraPoints;
      }

      gameState.score += bossPoints;
      GameUI.updateScore(gameState.score);

      // Reset grid size
      gameState.items = 100;
      GameUI.resizeGrid(10);

      // Save last boss score checkpoint to reset threshold count
      gameState.lastBossScore = gameState.score;

      // Resume spawning normal circles
      GameUI.clearCircles();
    }
  }

  // Circle clicked: affects score and health based on item
  function circleClicked(itemName) {
    if (gameState.health <= 0) return;
    if (gameState.bossActive) return; // Only boss circle clickable in boss mode

    // Find item
    const item = gameState.itemList.find(i => i.name === itemName);
    if (!item) return;

    gameState.score += item.points;
    gameState.health = Math.min(gameState.maxHealth, gameState.health + item.healthEffect); // healthEffect may be negative (damage) or 0 (no change)
    GameUI.updateScore(gameState.score);
    GameUI.updateHealthBar(gameState.health, gameState.maxHealth);

    // Clear current circle so a new will spawn next tick
    GameUI.clearCircles();
  }

  // Stop game
  function stopGame() {
    clearInterval(gameState.spawnIntervalId);
    clearInterval(gameState.healthTickIntervalId);
    GameUI.showGameOver(gameState.score);
    saveScore(gameState.score);
  }

  // Restart game
  function restartGame() {
    initGame(gameState.inEndlessMode ? 'endless' : gameState.currentDifficulty);
  }

  // Save score to localStorage leaderboard
  function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('popit_leaderboard') || '[]');
    scores.push(score);
    // Sort descending and keep last 10 scores max
    scores = scores.sort((a, b) => b - a).slice(0, 10);
    localStorage.setItem('popit_leaderboard', JSON.stringify(scores));
    GameUI.showLeaderboard(scores);
  }

  // Exposed API for GameUI to call on circle click, boss hit, restart, difficulty change
  return {
    initGame,
    circleClicked,
    bossHit,
    restartGame,
    changeDifficulty: (diff) => {
      if (!difficulties[diff] && diff !== 'endless') return;
      initGame(diff);
    }
  };
})();
