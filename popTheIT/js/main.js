        import {generateGrid, ThemeManager, itemCreation } from './gameUI.js';
        import {gameState } from './gameState.js';
        import {itemClicked} from './gameLogic.js';

        generateGrid(gameState.item);
        itemCreation.createItem();
        document.addEventListener("DOMContentLoaded", () => {
        ThemeManager.changeTheme(); 


        const circle = document.querySelector('.circle');
        
        itemClicked.circle(circle);

        });

