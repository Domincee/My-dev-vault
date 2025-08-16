        import {generateGrid, ThemeManager, itemCreation,randomItemCreation } from './gameUI.js';
        import {gameState } from './gameState.js';
        import {itemClicked,depleteHP} from './gameLogic.js';

        generateGrid(gameState.item);
        itemCreation.createItem();
        randomItemCreation.spawnConsumableItem();
        document.addEventListener("DOMContentLoaded", () => {
        ThemeManager.changeTheme(); 


        depleteHP.start(50, 500); // subtract 2 HP every 500ms


        const circle = document.querySelector('.circle');
        
        itemClicked.circle(circle);

        });

