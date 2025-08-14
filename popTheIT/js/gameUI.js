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
      
        

