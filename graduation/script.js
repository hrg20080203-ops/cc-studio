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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(
  ".timeline-item, .wish-card, .story-text, .story-visual, .gallery-item"
).forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

const lightbox = document.getElementById("lightbox");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxCaption) return;
    const img = item.querySelector(".gallery-photo");
    lightboxCaption.textContent = item.dataset.caption || "";
    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.hidden = false;
    } else if (lightboxImg) {
      lightboxImg.hidden = true;
      lightboxImg.removeAttribute("src");
    }
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lightboxImg) {
    lightboxImg.hidden = true;
    lightboxImg.removeAttribute("src");
  }
  document.body.style.overflow = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

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

function createConfettiPiece() {
  const piece = document.createElement("div");
  const colors = ["#c9a227", "#d4847a", "#1a2744", "#e8c547", "#e8a598"];
  piece.style.cssText = `
    position: fixed;
    width: ${6 + Math.random() * 8}px;
    height: ${6 + Math.random() * 8}px;
    background: ${colors[Math.floor(Math.random() * colors.length)]};
    top: -10px;
    left: ${Math.random() * 100}vw;
    opacity: ${0.6 + Math.random() * 0.4};
    border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
    pointer-events: none;
    z-index: 9998;
    animation: fall ${3 + Math.random() * 4}s linear forwards;
  `;
  document.body.appendChild(piece);
  setTimeout(() => piece.remove(), 7000);
}

const style = document.createElement("style");
style.textContent = `@keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`;
document.head.appendChild(style);

setInterval(createConfettiPiece, 400);
