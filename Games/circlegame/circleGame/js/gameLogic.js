// gameLogic.js
import { GameUI } from "./GameUI.js";
import { SpawnManager } from "./spawnManager.js";
import { ConsumableManager } from "./consumableManager.js";
import { BossManager } from "./bossManager.js";
import { updateHighscores, renderGameOverScores } from "./scoreManager.js";
import { difficultyConfig, DIFFICULTY_ORDER, BOSS_SCORE_STEP, BOSSES_PER_TIER_UP } from "./items.js";
import { itemList } from "./items.js";

export const GameLogic = (() => {
  // ——— game state ———
  let state = {
    maxHealth: 100,
    health: 100,
    score: 0,

    items: 100,

    currentDifficultyTier: 'easy', // keys from difficultyConfig
    bossActive: false,
    bossHealth: 0,
    bossMaxHealth: 0,
    bossCount: 0,        // how many bosses defeated
    lastBossScore: 0,    // score at last boss defeat (for threshold calc)

    healthTickerId: null,
    inEndlessMode: false,
  };

  // ——— managers ———
  let spawnManager, consumableManager, bossManager;

  function getState() { return { ...state }; }
  function setState(patch) { state = { ...state, ...patch }; }

  // ——— init / start ———
  function initGame(mode = 'easy') {
    // mode can be 'easy' | 'normal' | 'hard' | 'endless'
    state = {
      maxHealth: 100,
      health: 100,
      score: 0,
      items: 100,

      currentDifficultyTier: (mode === 'endless') ? 'easy' : mode,
      bossActive: false,
      bossHealth: 0,
      bossMaxHealth: 0,
      bossCount: 0,
      lastBossScore: 0,

      healthTickerId: null,
      inEndlessMode: mode === 'endless',
    };

    GameUI.resetUI(state);

    // create managers
    spawnManager = new SpawnManager(getState, onCircleClicked);
    consumableManager = new ConsumableManager(getState, onConsumableClicked);
    bossManager = new BossManager(getState, setState, onBossDefeated);

    GameUI.onRestart(() => {
      GameUI.hideGameOver();
      initGame(state.inEndlessMode ? 'endless' : state.currentDifficultyTier);
    });

    startHealthTicker();
    spawnManager.start();
  }

  // ——— health ticker ———
  function startHealthTicker() {
    stopHealthTicker();
    const diff = difficultyConfig[state.currentDifficultyTier] ?? difficultyConfig.easy;

    // health drain per second (tune this if needed)
    const drainPerSecond = 100 / 15; // easy-ish default; you can map this per diff if you want
    state.healthTickerId = setInterval(() => {
      if (state.bossActive) return; // optional: pause drain during boss
      setState({ health: Math.max(0, state.health - drainPerSecond * 0.5) }); // tick ~500ms effective
      GameUI.updateHealthBar(state.health, state.maxHealth);

      // inform consumables of health
      consumableManager.onHealthChange();

      if (state.health <= 0) {
        stopGame();
      }
    }, 500);
  }

  function stopHealthTicker() {
    clearInterval(state.healthTickerId);
    state.healthTickerId = null;
  }

  // ——— click handlers ———
  function onCircleClicked(itemName) {
    const item = itemList.find(i => i.name === itemName);
    if (!item) return;

    const newScore = state.score + (item.points || 0);
    const newHP = Math.min(state.maxHealth, state.health + (item.healthEffect || 0));

    setState({ score: newScore, health: newHP });
    GameUI.updateScore(state.score);
    GameUI.updateHealthBar(state.health, state.maxHealth);

    // health change may trigger/stop consumable window
    consumableManager.onHealthChange();

    // boss check (instant)
    if (!state.bossActive && (state.score - state.lastBossScore) >= BOSS_SCORE_STEP) {
      enterBossMode();
    }
  }

  function onConsumableClicked(consumable) {
    const newScore = state.score + (consumable.points || 0);
    const newHP = Math.min(state.maxHealth, state.health + (consumable.healthEffect || 0));
    setState({ score: newScore, health: newHP });
    GameUI.updateScore(state.score);
    GameUI.updateHealthBar(state.health, state.maxHealth);

    // stop window if we pass 70%
    consumableManager.onHealthChange();
  }

  // ——— boss flow ———
  function enterBossMode() {
    // pause spawning & ticker
    spawnManager.stop();
    // optionally pause health drain
    // stopHealthTicker();

    setState({ bossActive: true });
    bossManager.trySpawnBoss();
  }

  function onBossDefeated() {
    // reward: add score if you want (optional)
    // setState({ score: state.score + 10 });
    // GameUI.updateScore(state.score);

    // resume normal gameplay
    setState({ bossActive: false });

    // escalate difficulty every BOSSES_PER_TIER_UP
    if (state.inEndlessMode) {
      const nextTier = maybeEscalateTier(state.currentDifficultyTier, state.bossCount);
      if (nextTier !== state.currentDifficultyTier) {
        setState({ currentDifficultyTier: nextTier });
      }
    }

    // resume spawn and ticker
    spawnManager.start();
    // startHealthTicker(); // if you paused drain during boss
  }

  function maybeEscalateTier(currTier, bossCount) {
    // increase tier after BOSSES_PER_TIER_UP bosses
    const currIndex = DIFFICULTY_ORDER.indexOf(currTier);
    const tiersUp = Math.floor(bossCount / BOSSES_PER_TIER_UP);
    const targetIndex = Math.min(currIndex + tiersUp, DIFFICULTY_ORDER.length - 1);
    return DIFFICULTY_ORDER[targetIndex];
  }

  // ——— stop / game over ———
  function stopGame() {
    spawnManager.stop();
    stopHealthTicker();

    // scores
    const { highest, second, newRecord } = updateHighscores(state.score);
    GameUI.showGameOver();
    renderGameOverScores({
      highest,
      second,
      current: state.score,
      newRecord
    });
  }

  // external API
  return {
    initGame,
    changeDifficulty: (mode) => initGame(mode),
  };
})();
