// script.js
(function() {
  const script = document.createElement('script');
  script.src = 'https://vercel.live/analytics/script.js';
  script.defer = true;
  document.head.appendChild(script);
})();


const canvas = document.getElementById('hero-particles');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const colors = ['#FFFFFF','#FAFAFA','#CCCCCC'];
const maxDistance = 120;

const mouse = { x: null, y: null, radius: 150 };

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

function resizeCanvas() {
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  init();
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    // interacción con mouse
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        let angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 3;
        this.y += Math.sin(angle) * force * 3;
      }
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  const count = Math.floor((canvas.width * canvas.height) / 15000);
  for (let i = 0; i < count; i++) {
    particlesArray.push(new Particle());
  }
}

function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < maxDistance) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / maxDistance})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }

    // línea al mouse
    if (mouse.x !== null && mouse.y !== null) {
      let dx = particlesArray[a].x - mouse.x;
      let dy = particlesArray[a].y - mouse.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < mouse.radius) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / mouse.radius})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => { p.update(); p.draw(); });
  connect();
  requestAnimationFrame(animate);
}

init();
animate();

