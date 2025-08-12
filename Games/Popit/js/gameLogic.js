import {updateHealthBar } from "./gameUI.js";
import { stopInterval } from "./gameSetTimer.js";

export let gameState = {
  items : 100,
  health : 100,
  maxHealth:100,
  minHealh:0,
  points : 0,
  multiplier : 1, 
  spawnRate : 1, //1sec spawn item
  topScore: null,
  threshold:null,
  hpMulipier : 0,

}

///changin animations 
export let itemList = [
  {name: 'blueCircle', color: 'blue' , weight: 80},
  {name: 'redCircle', color: 'red', weight: 20}
]

export function healthBar(amount = 0) {
  gameState.health = Math.min(gameState.maxHealth, Math.max(0, gameState.health + amount));
  console.log(gameState.health);

  if (gameState.health > 0  ) {
    gameState.health = Math.max(0, gameState.health - gameState.multiplier);
    console.log(gameState.health)
  }
  if (gameState.health <= 0){
    stopGameIfNoHealth();
  }


  updateHealthBar();
}

export function calculateRandomItem(itemList) {
 let sumWeigth = itemList.reduce((acc, item) => acc + item.weight, 0); // calculate the sum of all weights
  let randomWeight = Math.floor(Math.random() * sumWeigth); // generate a random number between 0 and the sum of weights
   let cumulativeWeight = 0; // variable to keep track of the cumulative weight/current weight
 

  for (let item of itemList) { //loop through the itemList 
    cumulativeWeight += item.weight; //get the first index weight 
    if (randomWeight < cumulativeWeight) { //compare the random weight with the cumulative weight
      return  item.name; // set the random item name to the current item name

    }
    //if the random weight is greater than the cumulative weight, continue to the next item
    //ex. if in itemList the first index weight is 80 and the randomWeight is 90
    //it will continue to the next item untill it will get the result
    //if the 2nd index weight is 20 then return the 2nd index item name
  }
  return null;
}
function stopGameIfNoHealth() {
  const circle = document.querySelectorAll('.circle');
  circle.forEach(e => e.remove());

  stopInterval("createItem");
  stopInterval("healthBar");

  console.log("Game Over! Final health:", gameState.health);
}
