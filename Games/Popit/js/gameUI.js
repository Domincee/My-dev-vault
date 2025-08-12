import { gameState, calculateRandomItem, itemList } from './gameLogic.js';

const grid = document.getElementById('grid');





export function generateGrid(){
for (let i = 0; i < gameState.items; i++) {
  const item = document.createElement('div');
  item.className = "boxes";
  grid.appendChild(item);
}

// Set grid layout size
const size = Math.ceil(Math.sqrt(gameState.items));
grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
/* END FOR GENERATING GRID */
}

let lastHealth = gameState.health; // store last HP value

export function updateHealthBar() {
  const health = document.getElementById('healthBar');
  const hpChange = Math.abs(gameState.health - lastHealth); // difference in HP
  
  // Calculate dynamic duration: larger drops = faster, small drops = slower
  let duration = Math.max(0.2, hpChange * 0.08); // tweak multiplier to taste
  // Example: drop of 25 → 2s, drop of 1 → 0.2s
  
  health.style.transition = `width ${duration}s ease-in-out`;
  health.style.width = `${gameState.health}%`;

  lastHealth = gameState.health; // update last value
}

export function createItem(){
  if(gameState.health  <= 0) 
    
    return;

  //get a random number based on the weight of the item
   const randomItemName = calculateRandomItem(itemList);
   const boxes = document.querySelectorAll('.boxes');

  //remove existing circles before creating a new one
  boxes.forEach(box => {
    const existingCircle = box.querySelector('.circle');
    if (existingCircle) {
      existingCircle.remove();
    }
  });

  //get a random place imdex in the boxes 
  const randomPlaceIndex = Math.floor(Math.random() * boxes.length);
  const targetBox = boxes[randomPlaceIndex];
  const div = document.createElement('div');
  div.className = 'circle';

  let clicked = false
  if(randomItemName === 'blueCircle') {
    div.addEventListener('click', () => {
      if(clicked) return; // Prevent multiple clicks

      clicked = true; // Mark as clicked
      console.log('Clicked blue circle');

      div.remove();
    })
    div.classList.add('blue');
    div.style.backgroundColor = 'blue';   
    
    

  } else if(randomItemName === 'redCircle') {
    div.addEventListener('click', () => {
      if(clicked) return; // Prevent multiple clicks
      clicked = true; // Mark as clicked
      console.log('Clicked red circle');


      div.remove();
    })
    div.classList.add('red'); 
    div.style.backgroundColor = 'red';
 
 
  }
  targetBox.appendChild(div);


}