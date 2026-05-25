/* === Particles === */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

class Particle {
  constructor() {
    this.reset(true);
  }
  reset(init) {
    this.x = init ? Math.random() * canvas.width : Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : canvas.height + 20;
    this.size = Math.random() * 2.5 + 0.8;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.15;
    this.hue = [99, 168, 236, 270, 339][Math.floor(Math.random() * 5)];
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y < -20) this.reset(false);
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.x > canvas.width + 20) this.x = -20;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 15000);
  particles = Array.from({ length: Math.min(count, 100) }, () => new Particle());
}
initParticles();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => { p.update(); p.draw(ctx); });
  animationId = requestAnimationFrame(animate);
}
animate();

/* === Mobile Nav === */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinks?.classList.toggle("open");
});
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.classList.remove("active");
    navLinks?.classList.remove("open");
  });
});

/* === Scroll Reveal === */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(
  ".timeline-item, .wish-card, .story-content, .story-visual, .gallery-item"
).forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

/* === Counter Animation === */
function animateCounters() {
  document.querySelectorAll(".stat-num:not(.infinite)").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    if (!target || el.dataset.animated) return;
    el.dataset.animated = "1";
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}
const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);
const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

/* === Nav scroll effect === */
const nav = document.querySelector(".nav");
let lastScrollY = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (y > 100) {
    nav.style.background = "rgba(6,6,14,0.92)";
  } else {
    nav.style.background = "rgba(6,6,14,0.8)";
  }
  lastScrollY = y;
});

/* === Lightbox === */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".gallery-item.feature").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (!img || !lightbox || !lightboxCaption) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.hidden = false;
    lightboxCaption.textContent = item.dataset.caption || "";
    const originalLink = document.getElementById("lightboxOriginal");
    if (originalLink) originalLink.href = img.src;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  lightboxImg.hidden = true;
  lightboxImg.removeAttribute("src");
  document.body.style.overflow = "";
}
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

/* === Wish Form === */
const wishForm = document.getElementById("wishForm");
const wishWall = document.getElementById("wishWall");
wishForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get("name")?.toString().trim();
  const wish = fd.get("wish")?.toString().trim();
  if (!name || !wish || !wishWall) return;
  const li = document.createElement("li");
  li.innerHTML = `<div class="w-name">${escapeHtml(name)}</div><div class="w-text">${escapeHtml(wish)}</div>`;
  wishWall.prepend(li);
  e.target.reset();
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
