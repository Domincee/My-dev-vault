import { gameState } from "./gameState.js";
import { UpdateUi, randomItemCreation,BossPhase } from "./gameUI.js";
import { Effects } from "./effect.js";


export const effecItemtLogic = {
    heartEffect: (newItem) => {
        if (newItem.dataset.item === "itemHealth") {
            gameState.currenthealth = 100;
            Effects.heartEffect();
            UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth, "blue");
        }

        if (newItem.dataset.item === "itemGun") {
            console.log("gun");

            // ✅ Start the gun effect damage loop
            GunBossDamage.start();

            // ✅ Stop it after 10s
            setTimeout(() => {
                GunBossDamage.stop();
                console.log("Gun effect stopped!");
            }, gameState.consumableItems[1].duration);
        }

        Effects.spawnParticles(newItem.offsetLeft, newItem.offsetTop, document.body);
        UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth);
    },

    dropingItemCondition: {
        forHealth: () => {
    if (!gameState.dropEnabled) return; // stop if disabled ✅

    const minHealthDrop = 50;

    if (gameState.currenthealth <= minHealthDrop) {
      const now = Date.now();

      gameState.consumableItems.forEach(item => {
        if (item.name === "itemHealth") {
          if (!item.lastHealthDropTime || now - item.lastHealthDropTime >= item.healthDropCooldown) {
            randomItemCreation.spawnConsumableItem(item);
            item.lastHealthDropTime = now;

            console.log(`succesfuly get ${item.name}`);
          }
        }
      });
    }
  },

  forGun: () => {
    if (!gameState.dropEnabled) return; // stop if disabled ✅

    console.log(gameState.consumableItems[1].thresholdSpawnGun);
    const itemGun = gameState.consumableItems.find(item => item.name === "itemGun");
    if (gameState.points > gameState.thresholdofPointsForGun) {
      const now = Date.now();

      if (!itemGun.lastHealthDropTime || now - itemGun.lastHealthDropTime >= itemGun.healthDropCooldown) {
        randomItemCreation.spawnConsumableItem(itemGun);
        itemGun.lastHealthDropTime = now;
        console.log(`succesfuly get ${itemGun.name}`);
      }

      console.log("Respawning GUN");
     


      console.log("New threshold:", gameState.consumableItems[1].thresholdSpawnGun);
    }
  },

  stopDropping: () => {
    gameState.dropEnabled = false;
    console.log("Consumable drops stopped.");
  },

  startDropping: () => {
    gameState.dropEnabled = true;
    console.log("Consumable drops resumed.");
  }
}

}



export const GunBossDamage = {
  interval: null,

  start: () => {
    if (GunBossDamage.interval) return; // prevent double start

    GunBossDamage.interval = setInterval(() => {
      // Case 1: .blue exists → normal logic
      const boxes = document.querySelectorAll(".boxes");
      const availableBoxes = Array.from(boxes).filter(
        (box) => box.querySelector(".blue")
      );

      if (availableBoxes.length > 0) {
        availableBoxes.forEach((box) => {
          const blueItem = box.querySelector(".blue");
          if (!blueItem) return;

          gameState.points = Math.floor(
            gameState.points + gameState.addPoints * gameState.multiplier.forPoints
          ); 


          gameState.currenthealth = Math.min(
          gameState.currenthealth + gameState.hpAdded * gameState.multiplier.forHealth,
          gameState.maxHealth
          );//increase health

          // Boss damage
          if (gameState.boss.bossActive) {
            BossPhase.takeDamage(gameState.boss.damageToBoss );
            Effects.showPoints(gameState.boss, "💥", "red");
            UpdateUi.ofBossHealthBar(gameState.boss.currentHp, gameState.boss.maxHp, "red");
          }

          Effects.gunEffect(blueItem);

          if(gameState.points >= gameState.boss.pointsThresholdForBossSpawn ) {
            console.log("gun spawn condition met!");
          }
    /*       effecItemtLogic.dropingItemCondition.forGun(); */

          Effects.showPoints(gameState.points, "pts", "blue");  
          Effects.showPoints(gameState.hpAdded, "❤️", "blue");
          UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth, "blue");
        });
      } 
      // Case 2: No .blue but boss active → auto damage tick
      else if (gameState.boss.bossActive) {
        BossPhase.takeDamage(10 * gameState.multiplier.forDamage);
        Effects.showPoints(10 * gameState.multiplier.forDamage, "💥", "red");
        UpdateUi.ofBossHealthBar(gameState.boss.currentHp, gameState.boss.maxHp, "red");
        console.log(`Auto damage to boss: ${10 * gameState.multiplier.forDamage}, Boss HP: ${gameState.boss.currentHp}`);
      }
    }, gameState.timeManager.delaySpawner);
  },

  stop: () => {
    if (GunBossDamage.interval) {
      clearInterval(GunBossDamage.interval);
      GunBossDamage.interval = null;
    }
  }
};
