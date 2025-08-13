// consumableManager.js
import { consumableItemList } from "./items.js";
import { GameUI } from "./GameUI.js";
export class ConsumableManager {
  constructor(getState, onConsumableClick) {
    this.getState = getState;
    this.onConsumableClick = onConsumableClick;
    this.windowTimer = null;
    this.tickTimer = null;
    this.windowActive = false;
  }

  // call this from game loop whenever HP changes (we handle transitions)
  onHealthChange() {
    const { health, maxHealth } = this.getState();
    const hpPercent = (health / maxHealth) * 100;

    if (!this.windowActive && hpPercent < 50) {
      this.startWindow(); // start 10s spawn window
    }
    if (this.windowActive && hpPercent > 70) {
      this.stopWindow();  // stop immediately if above 70%
    }
  }

  startWindow() {
    this.stopWindow();
    this.windowActive = true;

    // run ticking spawns for 10s total
    const startAt = performance.now();

    const tick = () => {
      if (!this.windowActive) return;

      const now = performance.now();
      if (now - startAt >= 10000) { // 10s window complete
        this.stopWindow();
        return;
      }

      // spawn one consumable (each alive for 1s)
      const item = consumableItemList[0]; // you can randomize if many consumables
      const el = GameUI.createConsumable(item); // appears for item.aliveMs (1s)
      if (el) {
        const despawn = setTimeout(() => {
          el.classList.add('circle--pop');
          setTimeout(() => el.remove(), 150);
        }, item.aliveMs);

        el.__onConsumableClick = () => {
          el.classList.add('circle--pop');
          setTimeout(() => el.remove(), 150);
          clearTimeout(despawn);
          this.onConsumableClick(item);
        };
      }

      // schedule next tick in 1s (reappear every second within the window)
      this.tickTimer = setTimeout(tick, 1000);
    };

    tick();
  }

  stopWindow() {
    this.windowActive = false;
    clearTimeout(this.tickTimer);
    clearTimeout(this.windowTimer);
    this.tickTimer = null;
    this.windowTimer = null;
  }
}
