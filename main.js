// ═══════════════════════════════════════════════════════════
// MAIN.JS — Renders content from data.js and handles UI
// ═══════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  renderContent();
  initNavigation();
  initScrollReveal();
  initContactForm();
  setFooterYear();
});

// ── Render Content from data.js ───────────────────────────
function renderContent() {
  const d = siteData;

  // Hero
  setText("hero-name", d.personal.name);
  setText("hero-tagline", d.personal.tagline);
  setText("hero-intro", d.personal.heroIntro);

  // About
  setText("about-headline", d.about.headline);
  setText("about-description", d.about.description);

  // Highlights
  const highlightsEl = document.getElementById("about-highlights");
  if (highlightsEl) {
    highlightsEl.innerHTML = d.about.highlights
      .map((h) => `<div class="about__highlight">${h}</div>`)
      .join("");
  }

  // Skills
  const skillsEl = document.getElementById("skills-list");
  if (skillsEl) {
    skillsEl.innerHTML = d.skills
      .map((s) => `<span class="about__tag">${s}</span>`)
      .join("");
  }

  // Languages
  const langsEl = document.getElementById("languages-list");
  if (langsEl) {
    langsEl.innerHTML = d.languages
      .map(
        (l) => `
        <div class="about__language">
          <span class="about__lang-name">${l.name}</span>
          <span class="about__lang-level">${l.level}</span>
        </div>`
      )
      .join("");
  }

  // Certifications
  const certEl = document.getElementById("cert-list");
  if (certEl) {
    certEl.innerHTML = d.certifications
      .map((c) => `<li>${c}</li>`)
      .join("");
  }

  // Timeline
  const timelineEl = document.getElementById("timeline");
  if (timelineEl) {
    timelineEl.innerHTML = d.experience
      .map(
        (e) => `
        <div class="timeline__item reveal">
          <div class="timeline__dot"></div>
          <h4 class="timeline__role">${e.role}</h4>
          <p class="timeline__company">${e.company}</p>
          <p class="timeline__meta">${e.period} · ${e.location}</p>
          <p class="timeline__desc">${e.description}</p>
        </div>`
      )
      .join("");
  }

  // Education
  const eduEl = document.getElementById("education-grid");
  if (eduEl) {
    eduEl.innerHTML = d.education
      .map(
        (e) => `
        <div class="education__card reveal">
          <h4 class="education__school">${e.school}</h4>
          <p class="education__degree">${e.degree}</p>
          <p class="education__period">${e.period}</p>
        </div>`
      )
      .join("");
  }

  // Projects
  const projEl = document.getElementById("projects-grid");
  if (projEl) {
    projEl.innerHTML = d.projects
      .map(
        (p) => `
        <div class="project-card reveal">
          <div class="project-card__visual" style="${p.bgColor ? `background-color: ${p.bgColor};` : ''}">
            ${
              p.image
                ? `<img src="${p.image}" alt="${p.title}" class="project-card__image" />`
                : `<div class="project-card__image-placeholder">${p.title.charAt(0)}</div>`
            }
          </div>
          <div class="project-card__body">
            <h3 class="project-card__title">${p.title}</h3>
            <p class="project-card__subtitle">${p.subtitle}</p>
            <p class="project-card__desc">${p.description}</p>
            <div class="project-card__tags">
              ${p.tags.map((t) => `<span class="project-card__tag">${t}</span>`).join("")}
            </div>
          </div>
        </div>`
      )
      .join("");
  }

  // Contact info
  setText("contact-location", d.personal.location);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── Navigation ────────────────────────────────────────────
function initNavigation() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]");

  // Scroll effect
  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 40);

    // Active link highlight
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  });

  // Mobile toggle
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    const spans = toggle.querySelectorAll("span");
    toggle.classList.toggle("active");
  });

  // Close mobile menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
    });
  });
}

// ── Scroll Reveal ─────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ── Contact Form (Formspree) ──────────────────────────────
async function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Check if the user has updated the Formspree URL
    if (form.action.includes("YOUR_FORM_ID")) {
      statusEl.style.display = "block";
      statusEl.style.color = "#C4956A";
      statusEl.innerHTML = "<strong>Setup Required:</strong> Please replace 'YOUR_FORM_ID' in index.html with your actual Formspree ID.";
      return;
    }

    const data = new FormData(form);
    const button = document.getElementById("form-submit");
    const originalBtnText = button.textContent;
    
    button.textContent = "Sending...";
    button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        form.reset();
        statusEl.style.display = "block";
        statusEl.style.color = "var(--clr-text)";
        statusEl.innerText = "Thanks for your message! I'll get back to you soon.";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.map(e => e.message).join(", ") : "Error sending message");
      }
    } catch (error) {
      statusEl.style.display = "block";
      statusEl.style.color = "red";
      statusEl.innerText = "Oops! There was a problem sending your message.";
      console.error(error);
    } finally {
      button.textContent = originalBtnText;
      button.disabled = false;
    }
  });
}

// ── Footer Year ───────────────────────────────────────────
function setFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}
