       export let gameState = {
        item: 100,
        theme: "default",
        points: 0,

        dropStateManger: {
            forHealth: true,
            forGun: true,
        },

        highestPoints:  parseInt(localStorage.getItem("highestScore")) || 0,
        currenthealth: 100,
        maxHealth:100,
        addPoints: 1,
        hpAdded: 10,
        Odds: 0.8, //odds between blue and red = 0.7 blue gets high chance to be picked


        threshold:
        {
            difficulty: 20, //points to increase difficulty
            forBossSpawn: 2,
            forGunSpawn:2,
        },

        comboState: {
              comboCount: 0,
              comboAcive: false,
              comboTimer: 3,
              comboTimeout: null, 
        },

        multiplier: {
              forHealth:1.5,

        },

        boss:{
            bossActive: false,
            maxHealth:100,
            currentHp:100,
            healthBossMultply :1,
            bossPoints:10,
            damageToBoss: 3, //decrease for higher boss level

        },

        timeManager:{
            delaySpawner: 500, //seconds before the next spawn of items
            disappear: 600,//seconds before the item disappears
        
             //1.5second
        },
       
        consumableItems: [
            { name: "itemHealth",  value: 100 ,lastHealthDropTime: 0, healthDropCooldown: 10000, },
            { name: "itemGun",  value: 10,lastHealthDropTime: 0, healthDropCooldown: 15000, duration: 10000}, // 10 seconds
        ],

       };






