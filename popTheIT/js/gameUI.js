import { gameState } from "./gameState.js";
import {
  itemClicked,
  restartGame,
  depleteHP,
} from "./gameLogic.js";
import { Effects } from "./effect.js";
import { effecItemtLogic } from "./effectItemLogic.js";


export const grid = document.getElementById("grid");

export const ThemeManager = {
  getTheme(theme) {
    gameState.theme = theme;
  },

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.getTheme(theme); // keep in sync with itemList
  },

  changeTheme() {
    const select = document.getElementById("theme-select");
    select.value = localStorage.getItem("theme") || "default";

    select.addEventListener("change", (e) => {
      const theTheme = e.target.value;
      this.setTheme(theTheme);
    });
  },
};

export function generateGrid(item) {
    grid.innerHTML = "";
  for (let i = 0; i < item; i++) {
    const box = document.createElement("div");
    box.className = "boxes";

    grid.appendChild(box);
    UpdateUi.ofHealthBar();
  }

  const size = Math.ceil(Math.sqrt(item));
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  intervalOfCC();
}

export const itemCreation = {
  interSpawnTimer: null,
  createItem: () => {
    const boxes = document.querySelectorAll(".boxes");

    const spawnNext = () => {
      // Filter boxes that do NOT already have a circle
      const availableBoxes = Array.from(boxes).filter(
        (box) => !box.querySelector(".circle") && !box.querySelector(".item")
      );
      const pickRandomCircle = Math.random() < gameState.Odds ? "blue" : "red";
      // Pick a random available box
      const randomIndex = Math.floor(Math.random() * availableBoxes.length);
      const targetBox = availableBoxes[randomIndex];

      const div = document.createElement("div");
      div.classList.add("circle", pickRandomCircle);
      targetBox.appendChild(div);

      // Remove the circle after disappearSeconds
      setTimeout(() => {
        div.remove();
        gameState.health = gameState.health - 5;
      }, gameState.timeManager.disappear);

      // Schedule next spawn
      itemCreation.interSpawnTimer = setTimeout(
        spawnNext,
        gameState.timeManager.delaySpawner
      );

      itemClicked.circle(div, pickRandomCircle); //eventlistenerforclick
    };

    spawnNext(); // start spawning

    return;
  },



  stopSpawning: () => {
    const circle = document.querySelectorAll(".circle");

    circle.forEach((e) => {
      e.remove();
    });

    if (itemCreation.interSpawnTimer) {
      clearTimeout(itemCreation.interSpawnTimer);
      itemCreation.interSpawnTimer = null;
    }
  },

  initCircleBehavior: (circle, boss) => {
    const { damage, maxHealth } = boss;
    circle.style.width = "100%";

    circle.addEventListener("click", () => {
      boss.health = Math.max(boss.health - damage, 0);
      circle.style.width = (boss.health / maxHealth) * 100 + "%";
      console.log(`Boss Health: ${boss.health}`);
    });
  },

  resetBoxes: () => {
    document.querySelectorAll(".boxes").forEach((box) => {
      const circle = box.querySelector(".circle");
      if (circle) circle.remove();
    });
  },
};


export const BossPhase = {

start() {
  gameState.boss.bossActive = true;
  
  effecItemtLogic.dropingItemCondition.stopDropping();
  gameState.item = 1; // only spawn 1 (the boss)
  generateGrid(gameState.item);
  gameState.boss.currentHp = gameState.boss.maxHealth;
  const box = document.querySelector(".boxes");

  const bossContainer = document.createElement('div');
  bossContainer.className = "bossContainer"; // hidden state

  const boss = document.createElement("img");
  boss.className = "boss";
  boss.id = "boss";

  const bossHealthBarCon = document.createElement('div');
  const bosseHealthbarFill = document.createElement('div');

  bossHealthBarCon.className = "bossHealthBarCon";
  bosseHealthbarFill.className = "bosseHealthbarFill";
  bosseHealthbarFill.id = "bossHealthBarFill";

  bossContainer.appendChild(bossHealthBarCon);
  bossHealthBarCon.appendChild(bosseHealthbarFill);
  bossContainer.appendChild(boss);

  box.appendChild(bossContainer);

  itemCreation.resetBoxes();
  itemCreation.stopSpawning();
  depleteHP.stop();

  console.log("Boss spawned!");
  const bossText = document.createElement("div");
  bossText.className = "boss-appeared-text";
  bossText.innerText = "BOSS APPEARED!";
  document.body.appendChild(bossText);


    boss.id = "boss";
    boss.src = "assets/bossRoy.png"; // default image

    boss.addEventListener("click", () => {
    BossPhase.takeDamage(5 * gameState.boss.healthBossMultply);
    const bossDamageTaken = 5 * gameState.boss.healthBossMultply;

    Effects.showPoints(bossDamageTaken,"❤️","red");

    console.log("Boss clicked! Current HP: " + gameState.boss.currentHp);
    boss.src = "assets/bossRoyhurt.png"; // change to hurt version
    boss.classList.add("boss-hurt");

    // reset back after 0.3s  
    setTimeout(() => {
    boss.src = "assets/bossRoy.png";
    boss.classList.remove("boss-hurt");
    }, 300);
    });
  // Remove after animation ends
  setTimeout(() => {
    bossText.remove();
  }, 5000);

  // 🔹 Trigger animation after a short delay
  setTimeout(() => {
    bossContainer.classList.add("show");
  }, 50);

  // 🔹 Sync HP depletion to start after slide (3s)
  setTimeout(() => {
    depleteHP.start(20, 500); 
    console.log("Boss HP depletion started!");
  }, 5000);
},

  takeDamage(amount) {
    gameState.boss.currentHp = Math.max(gameState.boss.currentHp - amount, 0);
    const bossHealthBarFill = document.getElementById("bossHealthBarFill");

      if (bossHealthBarFill) {
        const percent = (gameState.boss.currentHp / gameState.boss.maxHealth) * 100;
        bossHealthBarFill.style.width = `${percent}%`;

        // Flash effect
        bossHealthBarFill.classList.add("damage-flash");
        setTimeout(() => bossHealthBarFill.classList.remove("damage-flash"), 300);
      }

   let defeated = false  
   if (gameState.boss.currentHp <= 0 && !defeated) {
    
    defeated = true
    const defeatText = document.createElement("div");
    defeatText.className = "boss-defeated-text";
    defeatText.innerText = "BOSS DEFEATED!";
    document.body.appendChild(defeatText);
    this.end();

    // remove after 3s
    setTimeout(() => {
      defeatText.remove();

      // call end() after text disappears

      // resume normal spawning

    }, 3000);
  }
  },

  end() {
  gameState.boss.bossActive = false;
    gameState.item = 100;   
    gameState.boss.pointsThresholdForBossSpawn += 3;
    generateGrid(gameState.item);// restore normal

    const boss = document.getElementById("boss");
    if (boss) boss.remove();
    console.log("Boss defeated! Back to normal phase.");
    depleteHP.stop();
    depleteHP.start(10, 1000); // restore normal depletion
    itemCreation.createItem(); // resume item creation

  }
};


const scoreBoard = document.getElementById("scoreboard");
const comboText = document.getElementById("comboCount");
const healthBar = document.getElementById("healthBar");
const healthBarCon = document.querySelector(".health-bar-container");
const HP = document.getElementById('healthBar');

export const UpdateUi = {
  ofScore: (points) => {
    scoreBoard.textContent = `Score: ${points}`;
    effecItemtLogic.dropingItemCondition.forGun();

  },

  ofCombo: {
    remove: () => {
      if (comboText) comboText.style.opacity = 0;
    },

    UpdateCombo: (combo) => {
      comboText.style.opacity = 1;
      comboText.textContent = `${combo}X`;
    },
  },

  ofHealthBar: (currenthealth, maxHeath,color) => {
    const percent = (currenthealth / maxHeath) * 100;
        healthBar.style.width = `${Math.max(percent, 0)}%`;
        Effects.showPoints(gameState.hpAdded,"❤️",color);
        UpdateUi.ofScore(gameState.points); 
        Effects.showPoints(gameState.addPoints,"pts",color); 
  },
};

export const comboUI = {
  remove: () => {
    comboText.remove();
  },
};

export const popUpNotif = {
  gameOver: (score, highScore) => {
    const notifContainer = document.createElement("div");
    const labelContainer = document.createElement("div");
    const textNotif = document.createElement("p");
    const textScore = document.createElement("p");
    const button = document.createElement("button");

    notifContainer.className = "notif-container";
    labelContainer.className = "label-container";
    textNotif.className = "game-over";
    textScore.className = "score";

    button.id = "retryButton";

    textNotif.textContent = "GAME OVER";
    textScore.textContent = `Score: ${score}\nHighest Score: ${highScore}`;
    textScore.style.whiteSpace = "pre-line"; // allow line breaks
    button.textContent = "Retry";

    document.body.appendChild(notifContainer);
    notifContainer.appendChild(labelContainer);
    labelContainer.appendChild(textNotif);
    labelContainer.appendChild(textScore);

    notifContainer.appendChild(button);

    button.addEventListener("click", () => {
      notifContainer.remove();
      restartGame();


      randomItemCreation.removeItems();
    });
  },
};

export const randomItemCreation = {
  spawnConsumableItem: (itemToSpawn) => {
    const boxes = document.querySelectorAll(".boxes");

    // Pick random item once
    if (itemToSpawn && itemToSpawn.name) {
      } else {
          console.error("itemToSpawn is undefined or missing a name property.");
          return; // Or handle the case where itemToSpawn is not valid
      }
    
    // Filter boxes that do NOT already have a consumable
    const availableBoxes = Array.from(boxes).filter(
      (box) => !box.querySelector(".cons-item") && !box.querySelector(".item")
    );

    if (availableBoxes.length === 0) return; // no space
    
    // Pick a random available box
    const randomIndex = Math.floor(Math.random() * availableBoxes.length);
    const targetBox = availableBoxes[randomIndex];

    // Create consumable div
    const div = document.createElement("div");
    div.classList.add("item");
    div.dataset.item = itemToSpawn.name;

    if (itemToSpawn.name === "itemHealth") {
      div.textContent = "❤️";
    } else if (itemToSpawn.name === "itemGun") {
      div.textContent = "🔫";
    }

    // temporary emoji for testing
    targetBox.appendChild(div);

    let clicked = false;

    // Remove the consumable after disappearSeconds * 2
    const disappearTimeout = setTimeout(() => {
        div.remove();
    }, gameState.timeManager.disappear * 2);


    // Add click event
    div.addEventListener("click", (e) => {
      clicked = true;
      clearTimeout(disappearTimeout);

      Effects.moveToSlotEffect(e.target);
      div.remove();
    });

    
  },

  removeItems: () => {
    const item = document.querySelectorAll(".item");

    item.forEach((item) => {
      if (item) {
        const parent = item.parentElement; // save before removing
        item.remove();
        if (parent) parent.classList.add("empty");
      }
    });
  },
};


function getCooldownRemaining(itemName) {
  const now = Date.now();
  const item = gameState.consumableItems.find(i => i.name === itemName);
  if (!item || !item.lastHealthDropTime) return 0;

  const elapsed = now - item.lastHealthDropTime;
  const remaining = item.healthDropCooldown - elapsed;
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0; // in seconds
}

// Update every 500ms
function intervalOfCC() {
  setInterval(() => {
    const gunRemaining = getCooldownRemaining("itemGun");
    const healthRemaining = getCooldownRemaining("itemHealth");

    const gunTimerEl = document.getElementById("cooldownGun");
    const healthTimerEl = document.getElementById("cooldownHealth");

    if (gunTimerEl) {
      if (gunRemaining > 0) {
        gunTimerEl.textContent = `🔫: ${gunRemaining}s`;
        
      } else {
        gunTimerEl.textContent = "🔫 ready!";

      }
    }

    if (healthTimerEl) {
      if (healthRemaining > 0) {
        healthTimerEl.textContent = `❤️: ${healthRemaining}s`;
        
      } else {
        healthTimerEl.textContent = "❤️ ready!";
      }
    }
  }, 500);
}
