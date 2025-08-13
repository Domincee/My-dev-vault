// bossManager.js
import { BOSS_SCORE_STEP, difficultyConfig } from "./items.js";
import { GameUI } from "./GameUI.js";
export class BossManager {
  constructor(getState, setState, onBossDefeated) {
    this.getState = getState;
    this.setState = setState;
    this.onBossDefeated = onBossDefeated;
  }

  shouldSpawnBoss() {
    const s = this.getState();
    if (s.bossActive) return false;
    const nextMilestone = Math.floor(s.score / BOSS_SCORE_STEP) + 1;
    return (s.score >= BOSS_SCORE_STEP * nextMilestone) || ((s.score - s.lastBossScore) >= BOSS_SCORE_STEP);
  }

  // call when score changes; spawn instantly if threshold crossed
  trySpawnBoss() {
    const s = this.getState();
    if (s.bossActive) return;

    const milestonesCleared = Math.floor(s.score / BOSS_SCORE_STEP); // 0,1,2...
    const needNewBoss = (s.score - s.lastBossScore) >= BOSS_SCORE_STEP;

    if (!needNewBoss) return;

    // pause regular spawns & health ticker are handled by gameLogic
    const diff = difficultyConfig[s.currentDifficultyTier] ?? difficultyConfig.easy;

    // boss HP = base * 2^(bossIndex) where bossIndex counts how many bosses you've seen so far
    const bossIndex = s.bossCount; // starts at 0
    const bossHP = diff.bossBaseHP * Math.pow(2, bossIndex + 1) / 2; // first boss = base, then x2, x4...

    this.setState({
      bossActive: true,
      bossHealth: bossHP,
      bossMaxHealth: bossHP,
    });

    GameUI.showBossNotification();
    GameUI.resizeGrid(1);
    GameUI.spawnBossCircle(bossHP, (/*click*/) => this.hitBoss());
  }

  hitBoss() {
    const s = this.getState();
    if (!s.bossActive) return;

    const newHP = Math.max(0, s.bossHealth - 1);
    this.setState({ bossHealth: newHP });
    GameUI.updateBossHealthBar(newHP, s.bossMaxHealth);

    if (newHP <= 0) {
      // defeat boss
      this.setState({
        bossActive: false,
        bossCount: s.bossCount + 1,
        lastBossScore: s.score,
      });

      GameUI.clearCircles();
      GameUI.resizeGrid(10); // back to 100 items grid
      GameUI.removeBossHealthBar();

      this.onBossDefeated();
    }
  }
}
