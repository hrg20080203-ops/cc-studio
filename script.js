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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".card, .section-lead, .contact-form").forEach((el) => {
  el.classList.add("fade-in");
  observer.observe(el);
});

document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const note = document.getElementById("formNote");
  if (note) {
    note.textContent = "消息已收到！（演示模式，未实际发送）";
    e.target.reset();
    setTimeout(() => { note.textContent = ""; }, 4000);
  }
});
