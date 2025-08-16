import { gameState } from "./gameState.js";
import {
  itemClicked,
  restartGame,
  pickRandomConsumableItem,
} from "./gameLogic.js";
import { Effects } from "./effect.js";

export const grid = document.getElementById("grid");

export const ThemeManager = {
  getTheme(theme) {
    gameState.theme = theme;
    console.log(gameState.theme); // optional: store in game state
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
  for (let i = 0; i < item; i++) {
    const box = document.createElement("div");
    box.className = "boxes";

    grid.appendChild(box);
    UpdateUi.ofHealthBar();
  }

  const size = Math.ceil(Math.sqrt(item));
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
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

const scoreBoard = document.getElementById("scoreboard");
const comboText = document.getElementById("comboCount");
const healthBar = document.getElementById("healthBar");
const healthBarCon = document.querySelector(".health-bar-container");

export const UpdateUi = {
  ofScore: (points) => {
    scoreBoard.textContent = `Score: ${points}`;
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

  ofHealthBar: (currenthealth, maxHeath) => {
    const percent = (currenthealth / maxHeath) * 100;
    healthBar.style.width = `${Math.max(percent, 0)}%`;

    Effects.shakeElement(healthBarCon);
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
  spawnConsumableItem: () => {
    const boxes = document.querySelectorAll(".boxes");

    // Pick random item once
    const pickRandomCons = pickRandomConsumableItem(gameState.consumableItems);

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
    div.dataset.item = pickRandomCons.name;

    if (pickRandomCons.name === "itemHealth") {
      div.textContent = "❤️";
    } else if (pickRandomCons.name === "itemGun") {
      div.textContent = "🔫";
    }

    // temporary emoji for testing
    targetBox.appendChild(div);

    let clicked = false;

    // Remove the consumable after disappearSeconds * 2
    const disappearTimeout = setTimeout(() => {
        div.remove();
        console.log(`${pickRandomCons.name} disappeared!`);
    }, gameState.timeManager.disappear * 2);


    // Add click event
    div.addEventListener("click", (e) => {
      clicked = true;
      clearTimeout(disappearTimeout);

      Effects.moveToSlotEffect(e.target);
      console.log(`Picked up ${pickRandomCons.name} (+${pickRandomCons.value})`);
      div.remove();
    });

    console.log(`Spawned ${pickRandomCons.name}`);
    
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
