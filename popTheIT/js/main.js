        import {generateGrid, ThemeManager, itemCreation } from './gameUI.js';
        import {gameState } from './gameState.js';
        import {itemClicked,depleteHP} from './gameLogic.js';

        generateGrid(gameState.item);
        itemCreation.createItem();
        document.addEventListener("DOMContentLoaded", () => {
        ThemeManager.changeTheme(); 


        depleteHP.start(20, 500); // subtract 2 HP every 500ms


        const circle = document.querySelector('.circle');
        
        itemClicked.circle(circle);

        });



        console.log(gameState);