import { GameLogic } from "./gameLogic.js";

export const GameUI = (() => {
  let container, topContainer, middleContainer, bottomContainer;
  let scoreboard, healthBarFill, grid;
  let restartBtn, leaderboardContainer;
  let bossHealthBarFill = null;

  let currentDifficultyBtn = null;

  function createLayout() {
    container = document.getElementById('game-container');
    container.innerHTML = '';

    // Top container
    topContainer = document.createElement('div');
    topContainer.className = 'top-container';

    scoreboard = document.createElement('div');
    scoreboard.className = 'scoreboard';
    scoreboard.textContent = 'Score: 0';

    // Health bar container
    const healthBarContainer = document.createElement('div');
    healthBarContainer.className = 'health-bar-container';

    healthBarFill = document.createElement('div');
    healthBarFill.className = 'health-bar-fill';
    healthBarFill.style.width = '100%';

    healthBarContainer.appendChild(healthBarFill);
    topContainer.appendChild(scoreboard);
    topContainer.appendChild(healthBarContainer);

    // Middle container
    middleContainer = document.createElement('div');
    middleContainer.className = 'middle-container';

    grid = document.createElement('div');
    grid.className = 'grid';
    middleContainer.appendChild(grid);

    // Bottom container
    bottomContainer = document.createElement('div');
    bottomContainer.className = 'bottom-container';

    // Difficulty buttons
    const difficulties = ['easy', 'normal', 'hard', 'endless'];
    difficulties.forEach(diff => {
      const btn = document.createElement('button');
      btn.className = 'difficulty-btn';
      btn.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);
      btn.addEventListener('click', () => {
        if (currentDifficultyBtn) currentDifficultyBtn.classList.remove('active');
        btn.classList.add('active');
        currentDifficultyBtn = btn;
        GameLogic.changeDifficulty(diff);
      });
      bottomContainer.appendChild(btn);
      if (diff === 'easy') {
        currentDifficultyBtn = btn;
        btn.classList.add('active');
      }
    });

    // Restart button (hidden initially)
    restartBtn = document.createElement('button');
    restartBtn.id = 'restart-btn';
    restartBtn.textContent = 'Restart Game';
    restartBtn.addEventListener('click', () => {
      restartBtn.style.display = 'none';
      leaderboardContainer.style.display = 'none';
      GameLogic.restartGame();
    });
    bottomContainer.appendChild(restartBtn);

    // Leaderboard container (hidden initially)
    leaderboardContainer = document.createElement('div');
    leaderboardContainer.className = 'leaderboard-container';
    container.appendChild(leaderboardContainer);

    // Append all to main container
    container.appendChild(topContainer);
    container.appendChild(middleContainer);
    container.appendChild(bottomContainer);
  }

  // Create grid squares based on gameState.items count
  function generateGrid(itemsCount) {
    grid.innerHTML = '';
    const size = Math.ceil(Math.sqrt(itemsCount));
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < itemsCount; i++) {
      const box = document.createElement('div');
      box.className = 'boxes';
      grid.appendChild(box);
    }
  }

  // Clear any circles from boxes
  function clearCircles() {
    const boxes = document.querySelectorAll('.boxes');
    boxes.forEach(box => {
      const circle = box.querySelector('.circle');
      if (circle) circle.remove();
    });
  }


function createCircle(itemName, isBoss = false, itemList = []) {
  clearCircles();

  if (isBoss) {
    spawnBossCircle(gameState.bossHealth);  
    return;
  }

  if (!itemName) return;

  const boxes = document.querySelectorAll('.boxes');
  if (boxes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * boxes.length);
  const targetBox = boxes[randomIndex];

  const circle = document.createElement('div');
  circle.className = 'circle';

  // Find item details from passed itemList
  const item = itemList.find(i => i.name === itemName);

  console.log('Creating circle:', itemName, itemList);
    console.log('Found item:', item);
  if (item) {
    circle.classList.add(item.name);
    circle.style.backgroundColor = item.color;
   
} else {
    circle.style.backgroundColor = 'gray';
  }

  let clicked = false;
  circle.addEventListener('click', () => {
    if (clicked) return;
    clicked = true;
    GameLogic.circleClicked(itemName);
  });

  targetBox.appendChild(circle);
}

  // Spawn boss circle (single big circle)
  function spawnBossCircle(bossHealth) {
  clearCircles();

  const box = document.querySelector('.boxes');
  if (!box) return;

  const bossCircle = document.createElement('div');
  bossCircle.className = 'circle boss';



  bossCircle.addEventListener('click', () => {
    GameLogic.bossHit();
  });

  box.appendChild(bossCircle);

  addBossHealthBar(bossHealth);
}
  // Add or update boss health bar below the grid
function addBossHealthBar(bossHealth) {
  // Remove previous if exists
  let existing = document.querySelector('.boss-health-bar-container');
  if (existing) existing.remove();

  const box = document.querySelector('.boxes');
  if (!box) return;


  const bossHealthBarContainer = document.createElement('div');
  bossHealthBarContainer.className = 'boss-health-bar';

  bossHealthBarFill = document.createElement('div');
  bossHealthBarFill.className = 'boss-health-bar-fill';
  bossHealthBarFill.style.width = '100%';
  

  bossHealthBarContainer.appendChild(bossHealthBarFill);
  box.appendChild(bossHealthBarContainer); 
  // append inside the boss box, below the boss circle
}   

  function updateBossHealthBar(currentBossHealth, maxHpBoss) {
    if (!bossHealthBarFill) return;
    

   const widthPercent = (currentBossHealth / maxHpBoss) * 100;
    bossHealthBarFill.style.width = widthPercent + '%';

    if (currentBossHealth <= 0) {
      const container = document.querySelector('.boss-health-bar-container');
      if (container) container.remove();
      bossHealthBarFill = null;
    }
  }

  // Update scoreboard
  function updateScore(score) {
    scoreboard.textContent = `Score: ${score}`;
  }

  // Update health bar fill width
  function updateHealthBar(health, maxHealth) {
    const widthPercent = (health / maxHealth) * 100;
    healthBarFill.style.width = widthPercent + '%';

    // Change color from green to red as health decreases
    const greenValue = Math.floor((health / maxHealth) * 255);
    const redValue = 255 - greenValue;
    healthBarFill.style.background = `rgb(${redValue}, ${greenValue}, 0)`;
  }

  // Resize grid (used for boss 1x1 or normal 10x10)
  function resizeGrid(size) {
    generateGrid(size * size);
  }

  // Show game over UI with leaderboard and restart button
  function showGameOver(score) {
    restartBtn.style.display = 'inline-block';
    leaderboardContainer.style.display = 'block';
  }

  // Show leaderboard scores
  function showLeaderboard(scores) {
    leaderboardContainer.innerHTML = '<h3>Leaderboard</h3>';
    if (scores.length === 0) {
      leaderboardContainer.innerHTML += '<p>No scores yet.</p>';
      return;
    }
    const list = document.createElement('ol');
    scores.forEach(score => {
      const li = document.createElement('li');
      li.textContent = score;
      list.appendChild(li);
    });
    leaderboardContainer.appendChild(list);
  }

  // Reset UI on game start/restart
  function resetUI(state) {
    updateScore(state.score);
    updateHealthBar(state.health, state.maxHealth);
    generateGrid(state.items);
    clearCircles();
    restartBtn.style.display = 'none';
    leaderboardContainer.style.display = 'none';

    // Remove boss health bar if any
    const bossBar = document.querySelector('.boss-health-bar-container');
    if (bossBar) bossBar.remove();
    bossHealthBarFill = null;
  }


  function showBossNotification() {
  let notification = document.getElementById('boss-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'boss-notification';
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '20px 40px';
    notification.style.fontSize = '2rem';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '10000';
    notification.style.textAlign = 'center';
    notification.style.userSelect = 'none';
    document.body.appendChild(notification);
  }
  notification.textContent = 'Boss Monster Appeared!';
  notification.style.display = 'block';

  // Hide after 2 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}


  // Public API
  return {
    createLayout,
    generateGrid,
    clearCircles,
    createCircle,
    spawnBossCircle,
    updateBossHealthBar,
    updateScore,
    updateHealthBar,
    resizeGrid,
    showGameOver,
    showLeaderboard,
    resetUI,
    showBossNotification,   
  };
})();
