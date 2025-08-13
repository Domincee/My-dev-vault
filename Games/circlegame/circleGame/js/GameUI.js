// gameUI.js
export const GameUI = (() => {
  let container, topContainer, middleContainer, bottomContainer;
  let scoreboard, healthBarFill, grid;
  let restartBtn, leaderboardContainer;
  let bossHealthBarFill = null, bossHealthBarLabel = null;

  let currentDifficultyBtn = null;

  function createLayout() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    // Top container
    const topContainer = document.createElement('div');
    topContainer.className = 'top-container';

   const scoreboard = document.createElement('div');
    scoreboard.className = 'scoreboard';
    scoreboard.id = 'score';
    scoreboard.textContent = 'Score: 0';

    // Health bar container
    const healthBarContainer = document.createElement('div');
    healthBarContainer.className = 'health-bar-container';

   const healthBarFill = document.createElement('div');
    healthBarFill.className = 'health-bar-fill';
    healthBarFill.style.width = '100%';

    healthBarContainer.appendChild(healthBarFill);
    topContainer.appendChild(scoreboard);
    topContainer.appendChild(healthBarContainer);

    // Middle container
    const middleContainer = document.createElement('div');
    middleContainer.className = 'middle-container';

    grid = document.createElement('div');
    grid.className = 'grid';
    middleContainer.appendChild(grid);

    // Bottom container
    bottomContainer = document.createElement('div');
    bottomContainer.className = 'bottom-container';

    container.appendChild(topContainer);
    container.appendChild(middleContainer);
    container.appendChild(bottomContainer);

    // Game Over / scoreboard box (fixed)
    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.className = 'leaderboard-container';
    leaderboardContainer.innerHTML = `
      <h3>Game Over</h3>
      <div>Highest Score: <span id="highest-score">0</span></div>
      <div>2nd Highest: <span id="second-highest-score">0</span></div>
      <div>Your Score: <span id="current-score">0</span></div>
      <button id="restart-btn">Restart Game</button>
    `;
    leaderboardContainer.style.display = 'none';
    container.appendChild(leaderboardContainer);

    restartBtn = leaderboardContainer.querySelector('#restart-btn');
  }

  // grid generation
  
function generateGrid(itemsCount) {
  if (!grid) {
    console.error("Grid is undefined! Did you call createLayout()?");
    return;
  }
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
  function clearCircles() {
    const circles = grid.querySelectorAll('.circle');
    circles.forEach(c => c.remove());
  }

  // —— CIRCLE CREATION (normal items) ——
  function createCircle(itemName, isBoss = false, itemList = []) {
    if (isBoss) return null;
    if (!itemName) return null;

    const boxes = grid.querySelectorAll('.boxes');
    if (boxes.length === 0) return null;

    const targetBox = boxes[Math.floor(Math.random() * boxes.length)];

    const circle = document.createElement('div');
    circle.className = 'circle circle--spawn'; // spawn animation class

    const item = itemList.find(i => i.name === itemName);
    if (item) {
      circle.classList.add(item.name);
      circle.style.backgroundColor = item.color || 'gray';
    } else {
      circle.style.backgroundColor = 'gray';
    }

    // attach click handler hook (SpawnManager sets __onCircleClick)
    circle.addEventListener('click', () => {
      if (typeof circle.__onCircleClick === 'function') {
        circle.__onCircleClick();
      }
    });

    targetBox.appendChild(circle);
    return circle;
  }

  // —— CONSUMABLE CREATION (e.g., hearts) ——
  function createConsumable(consumable) {
    const boxes = grid.querySelectorAll('.boxes');
    if (boxes.length === 0) return null;

    const targetBox = boxes[Math.floor(Math.random() * boxes.length)];
    const circle = document.createElement('div');
    circle.className = 'circle circle--spawn consumable';

    if (consumable.color) circle.style.backgroundColor = consumable.color;
    if (consumable.display) {
      circle.textContent = consumable.display;
      circle.style.fontSize = '1.8rem';
      circle.style.lineHeight = '1';
      circle.style.display = 'flex';
      circle.style.alignItems = 'center';
      circle.style.justifyContent = 'center';
    }

    circle.addEventListener('click', () => {
      if (typeof circle.__onConsumableClick === 'function') {
        circle.__onConsumableClick();
      }
    });

    targetBox.appendChild(circle);
    return circle;
  }

  // —— BOSS UI ——
  function spawnBossCircle(bossHealth, onBossClick) {
    clearCircles();
    const box = grid.querySelector('.boxes');
    if (!box) return;

    const bossCircle = document.createElement('div');
    bossCircle.className = 'circle boss circle--spawn';

    bossCircle.addEventListener('click', () => {
      onBossClick?.();
    });

    box.appendChild(bossCircle);
    addBossHealthBar(bossHealth, bossHealth);
  }

  function addBossHealthBar(current, max) {
    removeBossHealthBar();

    const box = grid.querySelector('.boxes');
    if (!box) return;

    const container = document.createElement('div');
    container.className = 'boss-health-bar';
    container.style.position = 'absolute';
    container.style.top = '5%';
    container.style.width = '250px';
    container.style.height = '14px';
    container.style.borderRadius = '6px';
    container.style.border = '2px solid rgb(255, 15, 15)';
    container.style.overflow = 'hidden';
    container.style.background = '#120606';
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    const fill = document.createElement('div');
    fill.className = 'boss-health-bar-fill'; // animated via CSS transitions
    fill.style.height = '100%';
    fill.style.width = `${(current / max) * 100}%`;
    fill.style.background = '#f10905';

    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.width = '100%';
    label.style.textAlign = 'center';
    label.style.fontSize = '12px';
    label.style.color = '#fff';
    label.style.pointerEvents = 'none';
    label.textContent = `${current}/${max}`;

    container.appendChild(fill);
    container.appendChild(label);
    box.appendChild(container);

    bossHealthBarFill = fill;
    bossHealthBarLabel = label;
  }

  function updateBossHealthBar(current, max) {
    if (!bossHealthBarFill || !bossHealthBarLabel) return;
    bossHealthBarFill.style.width = `${(current / max) * 100}%`;
    bossHealthBarLabel.textContent = `${current}/${max}`;
  }

  function removeBossHealthBar() {
    const existing = grid.querySelector('.boss-health-bar');
    if (existing) existing.remove();
    bossHealthBarFill = null;
    bossHealthBarLabel = null;
  }

  // —— HUD ——
function updateScore(newScore) {
  if (scoreboard) {
    scoreboard.textContent = 'Score: ' + newScore;
  }
}

// Update updateHealthBar to check healthBarFill:
function updateHealthBar(health, maxHealth) {
  if (!healthBarFill) return;
  const widthPercent = (health / maxHealth) * 100;
  healthBarFill.style.width = widthPercent + '%';

  // green->red effect
  const greenValue = Math.floor((health / maxHealth) * 255);
  const redValue = 255 - greenValue;
  healthBarFill.style.background = `rgb(${redValue}, ${greenValue}, 0)`;
}

  function resizeGrid(size) {
    generateGrid(size * size);
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
      notification.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
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
    setTimeout(() => { notification.style.display = 'none'; }, 2000);
  }

  function showGameOver() {
    leaderboardContainer.style.display = 'block';
  }

  function hideGameOver() {
    leaderboardContainer.style.display = 'none';
  }

  function onRestart(handler) {
    if (!restartBtn) return;
    restartBtn.onclick = handler;
  }

  function resetUI(state) {
    updateScore(state.score);
    updateHealthBar(state.health, state.maxHealth);
    resizeGrid(10); // 100 items default
    clearCircles();
    hideGameOver();
    removeBossHealthBar();
  }

  return {
    createLayout,
    generateGrid,
    clearCircles,
    createCircle,
    createConsumable,
    spawnBossCircle,
    updateBossHealthBar,
    removeBossHealthBar,
    updateScore,
    updateHealthBar,
    resizeGrid,
    showBossNotification,
    showGameOver,
    hideGameOver,
    onRestart,
    resetUI,
  };
})();
