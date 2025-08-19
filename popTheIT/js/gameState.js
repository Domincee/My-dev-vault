       export let gameState = {
        item: 100,
        theme: "default",
        points: 0,
        dropEnabled  : true,

        highestPoints:  parseInt(localStorage.getItem("highestScore")) || 0,
        currenthealth: 100,
        thresholdofPoints: 3,
        maxHealth:100,
        addPoints: 1,
        hpAdded: 10,
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

        boss:{
            bossActive: false,
            maxHealth:100,
            currentHp:100,
            healthBossMultply :1,
            pointsThresholdForBossSpawn: 6,


        },

        timeManager:{
            delaySpawner: 1000, //1second
            disappear: 1500,
        
             //1.5second
        },
       
        consumableItems: [
            { name: "itemHealth",  value: 100 ,lastHealthDropTime: 0, healthDropCooldown: 5000},
            { name: "itemGun",  value: 10,lastHealthDropTime: 0, healthDropCooldown: 5000},
        ],

        itemOnSlot: [
            {slot1:null},
            {slot2:null},
            {slot3:null},
            {slot4:null},
        ]
       };






