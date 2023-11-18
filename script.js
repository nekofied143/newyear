function calculateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const userOffset = now.getTimezoneOffset() * 60 * 1000;
  
    // Set the target date for the next New Year's Day adjusted for the user's timezone
    const nextYear = currentYear + 1;
    const newYearDateUTC = new Date(`January 1, ${nextYear} 00:00:00`).getTime();
    const newYearDateLocal = newYearDateUTC - userOffset;
  
    const distance = newYearDateLocal - now.getTime();
  
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      const countdownElement = document.getElementById("countdown");
  
      if (countdownElement) {
        countdownElement.innerHTML = `${days}D ${hours}H ${minutes}M ${seconds}S`;
      }
    } else {
      // Countdown is over, clear the interval
      clearInterval(countdown);
  
      // Display fireworks
      displayFireworks();
    }
  }
  
  function displayFireworks() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
  
    const ctx = canvas.getContext('2d');
    const fireworks = [];
    const explosionParticles = [];
    const numFireworks = 30;
    const explosionRadius = 5;
    const maxParticles = 100;
    const explosionDuration = 2000; // Duration of the explosion in milliseconds
    const fireworksDuration = 60000; // Total duration of fireworks display in milliseconds
    let elapsedTime = 0;
  
    function createFirework() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        color: `hsla(${Math.random() * 360}, 100%, 50%, 1)`,
        radius: 2,
        speed: {
          x: Math.random() * 5 - 2.5,
          y: Math.random() * -15 - 10
        },
        explosionFinished: false
      };
    }
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsedTime += 1000 / 60;
  
      if (elapsedTime < fireworksDuration) {
        if (fireworks.length < numFireworks && Math.random() < 0.1) {
          fireworks.push(createFirework());
        }
  
        fireworks.forEach((firework, index) => {
          ctx.beginPath();
          ctx.arc(firework.x, firework.y, firework.radius, 0, Math.PI * 2);
          ctx.fillStyle = firework.color;
          ctx.fill();
  
          if (!firework.explosionFinished) {
            if (firework.y <= firework.speed.y) {
              firework.explosionFinished = true;
  
              for (let i = 0; i < maxParticles; i++) {
                explosionParticles.push({
                  x: firework.x,
                  y: firework.y,
                  color: firework.color,
                  radius: Math.random() * 3 + 1,
                  speed: {
                    x: Math.random() * 6 - 3,
                    y: Math.random() * 6 - 3
                  },
                  life: Math.random() * explosionDuration
                });
              }
            } else {
              firework.x += firework.speed.x;
              firework.y += firework.speed.y;
              firework.speed.y += 0.2;
            }
          }
        });
  
        explosionParticles.forEach((particle, index) => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
  
          if (particle.life <= 0) {
            explosionParticles.splice(index, 1);
          } else {
            particle.x += particle.speed.x;
            particle.y += particle.speed.y;
            particle.life--;
          }
        });
      } else {
        canvas.parentNode.removeChild(canvas); // Remove the canvas after fireworksDuration
      }
  
      requestAnimationFrame(draw);
    }
  
    draw();
  }
  
  // Initial call to start the countdown
  calculateCountdown();
  
  // Update the countdown every second
  const countdown = setInterval(calculateCountdown, 1000);  