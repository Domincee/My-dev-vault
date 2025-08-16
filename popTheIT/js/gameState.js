       export let gameState = {
        item: 100,
        theme: "default",
        points: 0,
        highestPoints:  parseInt(localStorage.getItem("highestScore")) || 0,
        currenthealth: 100,
        maxHealth:100,
        addPoints: 1,
        Odds: 0.7, //odds between blue and red = 0.7 blue gets high chance to be picked

        comboState: {
              comboCount: 0,
              comboAcive: false,
              comboTimer: 3,
              comboTimeout: null, 
        },
        multiplier: {
              forHealth:1.5,
              forPoints:1.5,
              forDamage:1.5,

        },

        timeManager:{
            delaySpawner: 1000, //1second
            disappear: 1500, //1.5second
        },
       
        consumableItems: [
            { name: "itemHealth", weight: 50, value: 100 },
            { name: "itemGun", weight: 50, value: 10},
        ],

        itemOnSlot: [
            {slot1:null},
            {slot2:null},
            {slot3:null},
            {slot4:null},
        ]
       };






