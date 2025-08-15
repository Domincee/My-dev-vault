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

    const grid = document.querySelector(".grid");
    const gridRect = grid.getBoundingClientRect();

    // Random side
    const side = Math.random() < 0.5 ? "left" : "right";

    // Random vertical pos
    const randomY = gridRect.top + Math.random() * gridRect.height;

    if (side === "left") {
      const randomX = Math.random() * (gridRect.left - 50);
      text.style.left = `${randomX}px`;
    } else {
      const randomX =
        gridRect.right + 20 +
        Math.random() * (window.innerWidth - gridRect.right - 50);
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



 glowHealthBar(duration = 300, color = "red",item) {
  if (!item) return;

  // Remove existing glow if any (prevents stacking)
  item.style.boxShadow = "";
  void item.offsetWidth; // force reflow

  // Apply glow
  item.style.boxShadow = `0 0 15px ${color}, 0 0 5px 2px ${color}`;

  // Remove glow after duration
  setTimeout(() => {
    item.style.boxShadow = "";
  }, duration);
}
};

