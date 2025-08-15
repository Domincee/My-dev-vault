import { gameState } from "./gameState.js";

      export  const grid = document.getElementById('grid');

      export  function generateGrid(item){
           for(let i = 0; i < item ; i++){
                const box = document.createElement('div');
                box.className = 'boxes';

                grid.appendChild(box);
           }

           const size = Math.ceil(Math.sqrt(item));
            grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        }


        
export const ThemeManager = {
   
  getTheme(theme) {
    gameState.theme = theme;
    console.log(gameState.theme) // optional: store in game state
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
  }
};
      
        
export const itemCreation = {
  
createItem: () => {
    const boxes = document.querySelectorAll('.boxes');
    const createdCircles = [];
    const  decreaseSpawnDelay = 0.3;
    const delay = 1500 - decreaseSpawnDelay; // ms between spawns
    const disappearSeconds = 1800; // circle disappears after 1 second
    



    const spawnNext = () => {
        // Filter boxes that do NOT already have a circle
        const availableBoxes = Array.from(boxes).filter(
            box => !box.querySelector('.circle')
        );

        // Pick a random available box
        const randomIndex = Math.floor(Math.random() * availableBoxes.length);
        const targetBox = availableBoxes[randomIndex];

        const div = document.createElement('div');
        div.className = `circle`;
        targetBox.appendChild(div);

        createdCircles.push(div);
        // Remove the circle after disappearSeconds
        setTimeout(() => {
            div.remove();
        }, disappearSeconds);


        // Schedule next spawn
        setTimeout(spawnNext, delay);
    };

    spawnNext(); // start spawning

    return createdCircles;
},

    initCircleBehavior: (circle, boss) => {
        const { damage, maxHealth } = boss;
        circle.style.width = "100%";

        circle.addEventListener('click', () => {
            boss.health = Math.max(boss.health - damage, 0);
            circle.style.width = (boss.health / maxHealth * 100) + "%";
            console.log(`Boss Health: ${boss.health}`);
        });
    },

    resetBoxes: () => {
        document.querySelectorAll('.boxes').forEach(box => {
            const circle = box.querySelector('.circle');
            if (circle) circle.remove();
        });
    }
};





