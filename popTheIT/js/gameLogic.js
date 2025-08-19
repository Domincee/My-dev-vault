import { gameState } from "./gameState.js";
import {Effects} from "./effect.js";
import { itemCreation, UpdateUi,popUpNotif, BossPhase, generateGrid } from "./gameUI.js";
import { effecItemtLogic } from "./effectItemLogic.js";


export const itemClicked = {
circle: (circle, color) => {
    let clicked = false;
    
    circle.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      if (clicked) return;
      clicked = true;
      if (color === "blue") {

        counterCombo.fireCombo(color);

        gameState.points++;
        gameState.currenthealth = Math.min(
        gameState.currenthealth + gameState.hpAdded * gameState.multiplier.forHealth,
        gameState.maxHealth
        );


       if ( gameState.points >= gameState.boss.pointsThresholdForBossSpawn && !BossPhase.active) {
        BossPhase.start();
      }
      console.log(gameState.item);

      } else if (color === "red") {
        gameState.currenthealth = Math.max(
          gameState.currenthealth - 10 * gameState.multiplier.forDamage,
          0
        );

        UpdateUi.ofCombo.remove();
        gameState.comboState.comboCount = 0;
        gameState.comboState.comboTimer * 1000;
      }

       
    
      UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth,color);
     Effects.spawnParticles(e.offsetX, e.offsetY, document.body);

      circle.remove();

    /* console.log("points " + gameState.points);
       console.log("health " + gameState.currenthealth) 
       console.log("combo "  + gameState.comboState.comboCount); */
    });
},

    boss: () =>{

    }
}


export const counterCombo ={
fireCombo: () => {
    gameState.comboState.comboCount++;
    const triggerCombo = 3;

    if (gameState.comboState.comboCount >= triggerCombo) {
        // Show / update combo text
        UpdateUi.ofCombo.UpdateCombo(gameState.comboState.comboCount);

        // If there's already a timer running, cancel it
        if (gameState.comboState.comboTimeout) {
            clearTimeout(gameState.comboState.comboTimeout);
        }
        // Start a fresh 3s timer
        gameState.comboState.comboTimeout = setTimeout(() => {
            UpdateUi.ofCombo.remove();
            gameState.comboState.comboCount = 0; // reset only after 3s of inactivity
            gameState.comboState.comboTimeout = null;
        }, gameState.comboState.comboTimer * 1000);
    }
}
}


export const depleteHP = {
  interevalDepletetimer: null, // initialize the timer
  hpBelow50 : false,
  
  start: (amount = 1, interval = 500) => {
    if (depleteHP.interevalDepletetimer) return; // prevent multiple intervals

      depleteHP.interevalDepletetimer = setInterval(() => {
      gameState.currenthealth = Math.max(gameState.currenthealth - amount, 0);
      UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth);
      updateHighScore();

  
      if (gameState.currenthealth <= 0) {
       /*  console.log("HP depleted!"); */
        popUpNotif.gameOver(gameState.points,gameState.highestPoints);
         itemCreation.stopSpawning();
         depleteHP.stop();
         updateHighScore();
      }

      //check if hp is lessthan 50
       if(gameState.currenthealth < 50){
          if(depleteHP.hpBelow50) return;
          depleteHP.hpBelow50 = true;
          effecItemtLogic.dropingItemCondition.forHealth();//imported from effectItemlogic.js

      } else {
  // Reset the flag once HP is safe again
        depleteHP.hpBelow50 = false;
    }
    }, interval);
    
       
  },

  stop: () => {
    if (depleteHP.interevalDepletetimer) {
      clearInterval(depleteHP.interevalDepletetimer);
      depleteHP.interevalDepletetimer = null;
    }
  }
};





export function updateHighScore (){
  if(gameState.points >  gameState.highestPoints){
    gameState.highestPoints = gameState.points;
    localStorage.setItem("highestScore",gameState.highestPoints);
  }
}

export function restartGame(){
    gameState.item = 100;//generate back to 100 items 
    generateGrid(gameState.item);
    gameState.currenthealth = gameState.maxHealth;
    gameState.points = 0;
    gameState.comboState.comboCount = 0;

    UpdateUi.ofScore(gameState.points);
    UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth);

/*  console.log("restarted game" + `health ${gameState.currenthealth}` +`points ${gameState.points}` )
 */


    gameState.consumableItems.forEach((e)=>{
        e.lastHealthDropTime = 0;
        console.log(`${e.name} LHDT reverted to ${e.lastHealthDropTime} `);
    });


    // 4. Restart game systems
    itemCreation.createItem();   // restart spawning circles
    depleteHP.start(2, 500); 
}

export function pickRandomConsumableItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

      // 2. Pick a random number between 0 and totalWeight
      let random = Math.random() * totalWeight;

      // 3. Go through items until we find the chosen one
      for (const item of items) {
        if (random < item.weight) {
          return item;
        }
        random -= item.weight;
      }
  } 
