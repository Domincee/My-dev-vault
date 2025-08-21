import { effecItemtLogic } from "./effectItemLogic.js";

export const Effects = {
  spawnParticles(x, y, parent,color) {
    const numParticles = 24;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";

      // start position
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      particle.style.background = color;
    

      parent.appendChild(particle);

      // random direction
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 30 + 20;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      // animate
      requestAnimationFrame(() => {
        particle.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;
        particle.style.opacity = 0;
      });

      // cleanup
      setTimeout(() => particle.remove(), 500);
    }
   /*  console.log("spawned"); */
  },

  showPoints(points,textS,color) {
    const text = document.createElement("div");
    text.className = "points-text";

    if(color === "blue"){
    text.textContent = `+${points}${textS}`;
    text.style.color = color;


    }else if(color === "red"){
          text.textContent = `-${points}${textS}`;
          text.style.color = 'red';
    }
    document.body.appendChild(text);

    const body = document.body;
    const gridRect = body.getBoundingClientRect();

    // Random side
    const side = Math.random() < 0.5 ? "left" : "right";

    // Random vertical pos
    const randomY = Math.random() * window.innerHeight;

    if (side === "left") {
      const randomX = Math.random() * window.innerWidth +5;
      text.style.left = `${randomX}px`;
    } else {
   
        const randomX = Math.random() * window.innerWidth -5;
      text.style.left = `${randomX}px`;
    }

    text.style.top = `${randomY}px`;

    // remove after animation
    setTimeout(() => text.remove(), 500);
  },

  shakeElement(el) {
    if (!el) return;

    let i = 0;
    const frames = [
      "rotate(0deg)",
      "rotate(-0.3deg)",
      "rotate(0.5deg)",
      "rotate(-0.3deg)",
      "rotate(0deg)"
    ];

    const interval = setInterval(() => {
      el.style.transform = frames[i];
      i++;
      if (i >= frames.length) {
        clearInterval(interval);
        el.style.transform = ""; // reset after shake
      }
    }, 80);
  },



 glowHealthBar(duration = 300,item) {
  if (!item) return;

  // Remove existing glow if any (prevents stacking)
  item.style.boxShadow = "";
  void item.offsetWidth; // force reflow

  // Apply glow
  // Remove glow after duration
  setTimeout(() => {
    item.style.boxShadow = "";
  }, duration);
},


moveToSlotEffect: (itemToMove) => {
  const slots = document.querySelectorAll(".cons-item");

  // find the first empty slot
  const emptySlot = Array.from(slots).find(slot =>
    slot.classList.contains("empty")
  );

  if (!emptySlot) {
    // if all slot is occupied trigger it immediately
   /*  console.log("No empty slots found. Using item directly..."); */
    effecItemtLogic.heartEffect(itemToMove); // apply effect
    itemToMove.remove(); // remove the dropped item from field
    return;
  }

  // --- Normal behavior if a slot is free ---
  const toMove = itemToMove.getBoundingClientRect();
  const target = emptySlot.getBoundingClientRect();

  const targetX = target.left + target.width / 2;
  const targetY = target.top + target.height / 2;

  const toMoverX = toMove.left + toMove.width / 2;
  const toMoverY = toMove.top + toMove.height / 2;

  const dx = targetX - toMoverX;
  const dy = targetY - toMoverY;

  // smooth animation
  itemToMove.style.transition = "transform 0.2s ease";
  itemToMove.style.transform = `translate(${dx}px, ${dy}px)`;

  // cloning the item from box and put it on the "slot" cons-item
  const newItem = itemToMove.cloneNode(true);
  newItem.style.transform = "none";
  emptySlot.appendChild(newItem);

  newItem.addEventListener("click", () => {
    effecItemtLogic.heartEffect(newItem); // apply effect when item from slot is clicked
    newItem.remove(); // remove from slot
    emptySlot.classList.add("empty"); // mark as free add class empty 
  }, { once: true });

  // remove the class empty to mark it as filled means there's item
  emptySlot.classList.remove("empty");
  console.log(`Item moved to slot index ${[...slots].indexOf(emptySlot)} and marked as filled.`);

  itemToMove.remove();//removing it after all the things are done 
},

  heartEffect: () => {
  const container = document.createElement("div");
  container.className = "container-heart";
  document.body.appendChild(container);

  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";

    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.animationDelay = (i * 0.1) + "s";
    console.log("heart effect");
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
      if (container.children.length === 0) {
        container.remove(); // clean container after all hearts gone
      }
    }, 3000 + (i * 200)); // delay matches animation + stagger
  }
},

gunEffect: (blueItem) => {
  if (!blueItem) return;

  // Get the position of the .blue item
  const rect = blueItem.getBoundingClientRect();
  const crosshair = document.createElement("div");
  crosshair.className = "crosshair-effect";

  // Center the crosshair on the .blue element
  const size = 50; // match CSS size
  crosshair.style.left = rect.left + rect.width / 2 - size / 2 + "px";
  crosshair.style.top = rect.top + rect.height / 2 - size / 2 + "px";
  document.body.appendChild(crosshair);

  // Remove crosshair after animation
  setTimeout(() => {
    crosshair.remove();
    // Remove the blue item AFTER the crosshair finishes
    blueItem.remove();
  }, 400); // match CSS animation duration
},
          
};


