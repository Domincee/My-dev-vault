// spawnManager.js
import { BATCH_GAP_MS, BATCH_BASE_INTERVAL_MS, itemList, difficultyConfig } from "./items.js";
import { weightedPick } from "./utils.js"; // helper for weighted random
import { GameUI } from "./GameUI.js";
export class SpawnManager {
  constructor(getState, onCircleClick) {
    this.getState = getState;      // function returning gameState (read-only view)
    this.onCircleClick = onCircleClick; // callback to process click effects
    this.batchTimer = null;
    this.inBatch = false;
    this.activeTimeouts = new Set();
  }

  start() {
    this.stop(); // clear any previous
    this.scheduleNextBatch(BATCH_BASE_INTERVAL_MS);
  }

  stop() {
    clearTimeout(this.batchTimer);
    this.batchTimer = null;
    // also clear pending spawn timeouts
    this.activeTimeouts.forEach(t => clearTimeout(t));
    this.activeTimeouts.clear();
  }

  scheduleNextBatch(delayMs) {
    this.batchTimer = setTimeout(async () => {
      if (!this.getState().bossActive && this.getState().health > 0) {
        await this.runBatch();
      }
      // wait until batch completed then re-schedule based on base interval
      this.scheduleNextBatch(BATCH_BASE_INTERVAL_MS);
    }, delayMs);
  }

  async runBatch() {
    const state = this.getState();
    const diffKey = state.currentDifficultyTier; // e.g., 'easy','normal',...
    const diff = difficultyConfig[diffKey] ?? difficultyConfig.easy;
    const batchSize = diff.batchSize;
    const aliveMs = diff.disappearMs;

    this.inBatch = true;

    // spawn N circles with fixed gap
    for (let i = 0; i < batchSize; i++) {
      // spawn one
      const itemName = weightedPick(itemList, 'weight')?.name;
      if (itemName) {
        const circleEl = GameUI.createCircle(itemName, false, itemList); // add spawn anim inside
        if (circleEl) {
          // auto-despawn after aliveMs
          const despawnT = setTimeout(() => {
            circleEl?.classList.add('circle--pop'); // click/pop animation for disappear
            setTimeout(() => circleEl?.remove(), 180);
            this.activeTimeouts.delete(despawnT);
          }, aliveMs);
          this.activeTimeouts.add(despawnT);

          // click handler is attached in GameUI; here we listen via callback
          circleEl.dataset.itemName = itemName;
          circleEl.__onCircleClick = () => {
            // visual pop
            circleEl.classList.add('circle--pop');
            setTimeout(() => circleEl.remove(), 180);
            clearTimeout(despawnT);
            this.activeTimeouts.delete(despawnT);
            this.onCircleClick(itemName);
          };
        }
      }
      // wait gap before next circle in batch
      await this._sleep(BATCH_GAP_MS);
    }

    // batch ends automatically after last circle despawns (we don’t block the loop),
    // scheduling of the next batch is controlled by scheduleNextBatch().
    this.inBatch = false;
  }

  _sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
}
