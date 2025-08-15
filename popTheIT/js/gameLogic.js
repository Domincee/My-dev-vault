import { gameState } from "./gameState.js";
import {Effects} from "./effect.js";
import { UpdateUi } from "./gameUI.js";

const healthBarCon = document.querySelector('.health-bar-container');

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
          gameState.currenthealth + 10 * gameState.multiplier.forHealth,
          gameState.maxHealth
        );

        Effects.showPoints(gameState.addPoints,"pts",color); //show popup points sides
        Effects.showPoints(gameState.currenthealth,"❤️",color);
        UpdateUi.ofScore(gameState.points); //update score


      } else if (color === "red") {
        gameState.currenthealth = Math.max(
          gameState.currenthealth - 10 * gameState.multiplier.forDamage,
          0
        );

        UpdateUi.ofCombo.remove();
        Effects.showPoints(gameState.currenthealth,"❤️",color);
        gameState.comboState.comboCount = 0;
        gameState.comboState.comboTimer * 1000;
      }

       
    
      UpdateUi.ofHealthBar();
      Effects.spawnParticles(e.offsetX, e.offsetY, circle.parentElement);
      Effects.glowHealthBar(300, color,healthBarCon);

      circle.remove();

    /*    console.log("points " + gameState.points);
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