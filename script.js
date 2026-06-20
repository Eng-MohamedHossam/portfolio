/* ============================================================
   PORTFOLIO — Mohamed Hossam
   script.js — All Interactions, Animations & Logic
   ============================================================ */

"use strict";

/* ============================================================
   1. THEME TOGGLE (Dark / Light)
============================================================ */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
  themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

// Load saved theme (default: dark)
const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ============================================================
   2. NAVIGATION — Scroll, Active Highlight, Sticky
============================================================ */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

// Scroll-based nav effects
window.addEventListener(
  "scroll",
  () => {
    // Scrolled class for nav shadow
    navbar.classList.toggle("scrolled", window.scrollY > 60);

    // Active section highlight
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute("id");
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === current);
    });

    // Back-to-top visibility
    backToTop.classList.toggle("visible", window.scrollY > 500);
  },
  { passive: true },
);

/* ============================================================
   3. MOBILE HAMBURGER MENU
============================================================ */
const hamburger = document.getElementById("hamburger");
const mobileLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  mobileLinks.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Close menu when a link is clicked
mobileLinks.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

// Close on outside click
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove("open");
    mobileLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
});

/* ============================================================
   4. HERO CANVAS — Particle Network Background
============================================================ */
(function initCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particles = [];
  let animFrame;
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      // Use accent color based on theme
      const isDark = html.getAttribute("data-theme") === "dark";
      const color = isDark ? "124,58,237" : "109,40,217";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    const isDark = html.getAttribute("data-theme") === "dark";
    const color = isDark ? "124,58,237" : "109,40,217";

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawLines();
    animFrame = requestAnimationFrame(animate);
  }

  // Pause when tab not visible (performance)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else animate();
  });

  resize();
  init();
  animate();

  window.addEventListener(
    "resize",
    () => {
      resize();
      particles.forEach((p) => p.reset());
    },
    { passive: true },
  );
})();

/* ============================================================
   5. TYPED TEXT — Hero Subtitle Typewriter Effect
============================================================ */
(function initTyped() {
  const el = document.getElementById("typedText");
  if (!el) return;

  const phrases = [
    "Software Engineering Student",
    "Aspiring Front-End Developer",
    "Problem Solver",
    "Fast Learner",
    "Building the Web, One Line at a Time",
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => {
          pause = false;
          deleting = true;
          type();
        }, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    if (!pause) setTimeout(type, deleting ? 45 : 80);
  }

  // Small start delay for polish
  setTimeout(type, 1000);
})();

/* ============================================================
   6. SCROLL REVEAL — Intersection Observer
============================================================ */
(function initReveal() {
  const els = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings within the same parent
          const siblings = [...entry.target.parentElement.children].filter(
            (c) =>
              c.classList.contains("reveal-up") ||
              c.classList.contains("reveal-left") ||
              c.classList.contains("reveal-right"),
          );
          const idx = siblings.indexOf(entry.target);
          const delay = idx * 80;

          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
  );

  els.forEach((el) => observer.observe(el));
})();

/* ============================================================
   7. ANIMATED COUNTERS — About Stats
============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = +el.dataset.target;
        const dur = 1800;
        const step = 16;
        const inc = target / (dur / step);
        let current = 0;

        const timer = setInterval(() => {
          current += inc;
          if (current >= target) {
            el.textContent = target + "+";
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, step);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
})();

/* ============================================================
   8. SKILL BAR ANIMATION — Fills on scroll into view
============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const w = bar.dataset.width;
        // Small delay for visual polish
        setTimeout(() => {
          bar.style.width = w + "%";
        }, 200);
        observer.unobserve(bar);
      });
    },
    { threshold: 0.3 },
  );

  bars.forEach((b) => observer.observe(b));
})();

/* ============================================================
   9. PROJECT FILTERING
============================================================ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll("#projects .filter-btn");
  const cards = document.querySelectorAll("#projectsGrid .project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active state & aria
      filterBtns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn);
      });

      // Filter cards with fade
      cards.forEach((card) => {
        const tags = card.dataset.tags || "";

        if (filter === "all" || tags.includes(filter)) {
          card.classList.remove("hidden");
          card.style.animation = "fadeIn 0.4s ease";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

/* ============================================================
   10. CERTIFICATION FILTERING
============================================================ */
(function initCertFilter() {
  const filterBtns = document.querySelectorAll("#certifications .filter-btn");
  const cards = document.querySelectorAll("#certsGrid .cert-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn);
      });

      cards.forEach((card) => {
        const tag = card.dataset.certTag || "";
        const show = filter === "all-certs" || tag === filter;
        card.classList.toggle("hidden", !show);
        if (show) card.style.animation = "fadeIn 0.4s ease";
      });
    });
  });
})();

/* ============================================================
   11. CONTACT FORM — Validation & Simulated Submit
============================================================ */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMsg = document.getElementById("formSuccess");
  if (!form) return;

  function validate(field) {
    const errorEl = field.closest(".form-group")?.querySelector(".form-error");
    let msg = "";

    if (field.required && !field.value.trim()) {
      msg = "This field is required.";
    } else if (field.type === "email" && field.value.trim()) {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(field.value.trim()))
        msg = "Please enter a valid email address.";
    }

    if (errorEl) errorEl.textContent = msg;
    field.classList.toggle("error", !!msg);
    return !msg;
  }

  // Live validation on blur
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validate(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("error")) validate(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = [
      ...form.querySelectorAll("input[required], textarea[required]"),
    ];
    const allValid = fields.map((f) => validate(f)).every(Boolean);
    if (!allValid) return;

    // Simulate sending (replace with real API later)
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> <span>Sending...</span>';

    setTimeout(() => {
      form.reset();
      successMsg.classList.add("show");
      successMsg.setAttribute("aria-hidden", "false");
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-paper-plane" aria-hidden="true"></i> <span>Send Message</span>';

      setTimeout(() => {
        successMsg.classList.remove("show");
        successMsg.setAttribute("aria-hidden", "true");
      }, 5000);
    }, 1500);
  });
})();

/* ============================================================
   12. BACK TO TOP BUTTON
============================================================ */
const backToTop = document.getElementById("backToTop");

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Keyboard support
backToTop.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

/* ============================================================
   13. FOOTER YEAR — Auto-updates
============================================================ */
const yearEl = document.getElementById("currentYear");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   14. DOWNLOAD CV — Placeholder handler
============================================================ */
document.getElementById("downloadCV")?.addEventListener("click", (e) => {
  e.preventDefault();
  const link = document.createElement("a");
  link.href = "Mohamed_Hossam_CV.pdf";
  link.download = "Mohamed_Hossam_CV.pdf";
  link.click();
});

/* ============================================================
   15. CSS ANIMATION KEYFRAMES (injected for filter fade)
============================================================ */
(function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   16. SMOOTH ANCHOR SCROLL — Offset for fixed nav
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const top =
      target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ============================================================
   17. PROJECT CARD — Keyboard accessibility
   Cards aren't links but contain links; ensure tab order is correct
============================================================ */
document.querySelectorAll(".project-card").forEach((card) => {
  // Subtle tilt on mouse move for featured card
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 4;
    const tiltY = ((x - cx) / cx) * -4;

    card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ============================================================
   18. PERFORMANCE — Debounce resize events
============================================================ */
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

window.addEventListener(
  "resize",
  debounce(() => {
    // Re-check active section on resize
    navLinks.forEach((link) => {
      let current = "";
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
      });
      link.classList.toggle("active", link.dataset.section === current);
    });
  }, 200),
  { passive: true },
);

/* ============================================================
   19. ACCESSIBILITY — Respect reduced motion preference
============================================================ */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function handleReducedMotion(mq) {
  if (mq.matches) {
    // Kill canvas animation, blobs, etc.
    document
      .querySelectorAll(".blob")
      .forEach((b) => (b.style.animation = "none"));
    document
      .querySelectorAll(".tech-float")
      .forEach((f) => (f.style.animation = "none"));
    document
      .querySelectorAll(".photo-ring")
      .forEach((r) => (r.style.animation = "none"));
    document
      .querySelectorAll(".badge-dot")
      .forEach((d) => (d.style.animation = "none"));
    document
      .querySelectorAll(".cursor")
      .forEach((c) => (c.style.animation = "none"));
  }
}

handleReducedMotion(prefersReducedMotion);
prefersReducedMotion.addEventListener("change", handleReducedMotion);

/* ============================================================
   20. HERO REVEAL — Staggered on load
============================================================ */
window.addEventListener("load", () => {
  const heroEls = document.querySelectorAll(
    ".hero .reveal-left, .hero .reveal-right",
  );
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 200 + i * 150);
  });
});

/* LIGHTBOX — Certificate Viewer */
(function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  if (!lightbox) return;

  document.querySelectorAll(".cert-card[data-cert-img]").forEach((card) => {
    card.addEventListener("click", () => {
      const src = card.dataset.certImg;
      const alt =
        card.querySelector(".cert-title")?.textContent || "Certificate";
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open"))
      closeLightbox();
  });
})();

/* ============================================================
    FLIP CARDS — Tech Skill Cards
    ──────────────────────────────────────────────────────────
============================================================ */
(function initFlipCards() {
  const grid = document.getElementById("techSkillsGrid");
  if (!grid) return;

  // ── TO ENABLE: uncomment this line ──
  grid.classList.add("flip-enabled");

  // Early exit while flip is disabled
  if (!grid.classList.contains("flip-enabled")) return;

  const cards = grid.querySelectorAll(".tech-skill-card");

  cards.forEach((card) => {
    // Click to flip / unflip
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });

    // Keyboard support — Enter or Space to flip
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });

    // Optional: unflip when focus leaves the card
    card.addEventListener("focusout", () => {
      card.classList.remove("is-flipped");
    });
  });
})();
