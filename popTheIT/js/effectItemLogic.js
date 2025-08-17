import { gameState } from "./gameState.js";
import { UpdateUi, randomItemCreation } from "./gameUI.js";
import { Effects } from "./effect.js";



export const effecItemtLogic = {
    interval : null,
    heartEffect(newItem){

        if(newItem.dataset.item ==="itemHealth"){
        gameState.currenthealth = 100;

        UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth, "blue")
        }

                if (newItem.dataset.item === "itemGun") {
                console.log("gun");
                const boxes = document.querySelectorAll(".boxes");


                // Repeat every 1 second
                 effecItemtLogic.interval = setInterval(() => {
                    //filter that box have a child of blue 
                    const availableBoxes = Array.from(boxes).filter(
                        (box) => box.querySelector(".blue")
                    );
                    
                    availableBoxes.forEach((box) => {
                        const blueItem = box.querySelector(".blue");
                        gameState.points++; 
                        gameState.currenthealth = Math.min(
                        gameState.currenthealth + gameState.hpAdded * gameState.multiplier.forHealth,
                        gameState.maxHealth
                        );
                        if (blueItem) blueItem.remove();
                        console.log(gameState.currenthealth);
                        UpdateUi.ofHealthBar(gameState.currenthealth,gameState.maxHealth,"blue");
                    });

                }, gameState.timeManager.delaySpawner); 

                // Stop after N seconds
                effecItemtLogic.stopEffect();
               // stop after 10 seconds
            }
            
              UpdateUi.ofHealthBar(gameState.currenthealth, gameState.maxHealth);
        //show popup points sides
        
    },

    stopEffect(){
          setTimeout(() => {
                    clearInterval(effecItemtLogic.interval);
                    console.log("Stopped checking!");
         }, 10000);
    },



dropingItemCondition: {
  forHealth: () => {
    const minHealthDrop = 50;

    if (gameState.currenthealth <= minHealthDrop) {
      const now = Date.now();

      gameState.consumableItems.forEach(item => {
        if (item.name === "itemHealth") {
          if (!item.lastHealthDropTime || now - item.lastHealthDropTime >= item.healthDropCooldown) {
            randomItemCreation.spawnConsumableItem(item);
            item.lastHealthDropTime = now;

            console.log(`succesfuly get ${item.name}`)

          }
        }
      });
    }
  },
forGun: () => {
    let increaseThresHold = 10; // integer multiplier

     const itemGun = gameState.consumableItems.find(item => item.name === "itemGun");
    if (gameState.points > gameState.thresholdofPoints) {
      const now = Date.now();

         if (!itemGun.lastHealthDropTime || now - itemGun.lastHealthDropTime >= itemGun.healthDropCooldown) {
             randomItemCreation.spawnConsumableItem(itemGun);
            itemGun.lastHealthDropTime = now;
            console.log(`succesfuly get ${itemGun.name}`)

          }


        console.log("Respawning GUN");
        // Update threshold after respawn so next check is harder
         gameState.thresholdofPoints = Math.floor( gameState.thresholdofPoints + increaseThresHold);// stays integer
        console.log("New threshold:",  gameState.thresholdofPoints);
    }
}
}
//call where it updates score

} 



