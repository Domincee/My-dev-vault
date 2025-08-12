import { generateGrid,createItem } from "./gameUI.js";
import { healthBar  } from "./gameLogic.js";
import { delay } from "./gameSetTimer.js";
generateGrid();
healthBar(4);

delay("healthBar", true, () => healthBar(), 0.5);
delay("createItem", true, () => createItem(), 2);