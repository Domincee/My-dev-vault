import { effecItemtLogic } from "./effectItemLogic.js";

export const Effects = {
  spawnParticles(x, y, parent) {
    const numParticles = 24;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";

      // start position
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

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
    setTimeout(() => text.remove(), 2000);
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
          console.log("No empty slots found.");
          return;
        }

        // get bounding boxes
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

        
         const newItem = itemToMove.cloneNode(true);
          newItem.style.transform = "none"; // reset any transform
          emptySlot.appendChild(newItem);

        newItem.addEventListener("click", () => {

         if (!emptySlot) {
          console.log("No empty slots found.");
           effecItemtLogic.heartEffect(newItem)
          return;
        }
         effecItemtLogic.heartEffect(newItem);//call from logic

         newItem.remove();//remove item 
         emptySlot.classList.add("empty");//add empty class
      }, { once: true });

        // mark slot as filled
        emptySlot.classList.remove("empty");
        console.log(`Item moved to slot index ${[...slots].indexOf(emptySlot)} and marked as filled.`);
      },
          
};


