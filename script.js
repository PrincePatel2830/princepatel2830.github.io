// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initNeuralCanvas();
  initMobileMenu();
  initCopyEmail();
});

/* ===================================================
   1. Interactive Neural Network / Constellation Canvas
   =================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  const maxParticles = window.innerWidth < 768 ? 35 : 70;
  const connectionDistance = 120;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.18;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();
}

/* ===================================================
   2. Mobile Menu Toggle
   =================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* ===================================================
   3. Copy Email to Clipboard with Toast Notification
   =================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const toast = document.getElementById('toast');
  const email = 'patelp8349@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(email).then(() => {
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      if (toast) {
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
          toast.classList.add('translate-y-20', 'opacity-0');
          toast.classList.remove('translate-y-0', 'opacity-100');
          if (copyBtnText) copyBtnText.textContent = 'Copy Email';
        }, 2500);
      }
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
}
