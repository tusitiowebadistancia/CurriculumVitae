// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const navToggle = $("#navToggle");
const navMenu = $("#navMenu");
const toTop = $("#toTop");
const year = $("#year");

// Footer year
year.textContent = new Date().getFullYear();

// Mobile nav
function setMenu(open) {
  navMenu.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    setMenu(!isOpen);
  });
}

// Close menu on link click (mobile)
$$(".nav__link", navMenu).forEach((a) => {
  a.addEventListener("click", () => setMenu(false));
});

// Close menu if click outside
document.addEventListener("click", (e) => {
  const isOpen = navMenu.classList.contains("open");
  if (!isOpen) return;

  const clickedInside = navMenu.contains(e.target) || navToggle.contains(e.target);
  if (!clickedInside) setMenu(false);
});

// Active link highlight (IntersectionObserver)
const sections = ["#inicio", "#diplomas", "#proyectos"]
  .map((id) => $(id))
  .filter(Boolean);

const links = $$(".nav__link");

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((x) => x.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    links.forEach((l) => l.classList.remove("active"));
    const active = links.find((l) => l.getAttribute("href") === `#${visible.target.id}`);
    if (active) active.classList.add("active");
  },
  { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] }
);

sections.forEach((s) => observer.observe(s));

// Scroll to top button
window.addEventListener("scroll", () => {
  const show = window.scrollY > 600;
  toTop.classList.toggle("show", show);
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Optional: small animated counters (feel pro, no libs)
const yearsExp = $("#yearsExp");
const projectsDone = $("#projectsDone");

function animateNumber(el, targetNumber, suffix = "+") {
  if (!el) return;
  const start = 0;
  const duration = 650;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const val = Math.floor(start + (targetNumber - start) * t);
    el.textContent = `${val}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

window.addEventListener("load", () => {
  // Cambiá los números por los reales si querés
  animateNumber(yearsExp, 1, "+");
  animateNumber(projectsDone, 10, "+");
});
