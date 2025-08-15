import { gameState } from "./gameState.js";
import { itemClicked } from "./gameLogic.js";
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
    createItem: () => {
        const boxes = document.querySelectorAll(".boxes");
        const decreaseSpawnDelay = 0.3;
        const delay = 1500 - decreaseSpawnDelay; // ms between spawns
        const disappearSeconds = 1800; // circle disappears after 1 second

        const spawnNext = () => {
        // Filter boxes that do NOT already have a circle
        const availableBoxes = Array.from(boxes).filter(
            (box) => !box.querySelector(".circle")
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
        }, disappearSeconds);

        // Schedule next spawn
        setTimeout(spawnNext, delay);

        itemClicked.circle(div,pickRandomCircle);//eventlistenerforclick
        };

        spawnNext(); // start spawning

        return ;
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


const scoreBoard = document.getElementById('scoreboard');
const comboText = document.getElementById('comboCount');
const healthBar = document.getElementById('healthBar');
const healthBarCon = document.querySelector('.health-bar-container');

export const UpdateUi = {
    ofScore : (points) =>{
        
        scoreBoard.textContent =   `Score: ${points}`;
    },

    ofCombo: {

        remove: () =>{
            if(comboText) comboText.style.opacity = 0 ;
        },

        UpdateCombo:(combo) =>{
          comboText.style.opacity = 1;
          comboText.textContent = `${combo}X`;

        },


    },

ofHealthBar: () => {
  const percent = (gameState.currenthealth / gameState.maxHealth) * 100;
  healthBar.style.width = `${Math.max(percent, 0)}%`;

    Effects.shakeElement(healthBarCon);
},

}

export const comboUI = {
    remove: () =>{
        comboText.remove();
    }


}