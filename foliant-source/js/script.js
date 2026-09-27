(() => {
  "use strict";

  /* ============================================================
     Data: the plant catalog
     Each plant carries one or more care tags used by the filter bar.
     ============================================================ */
  const PLANTS = [
    { name: "Pothos 'Marble Queen'", latin: "Epipremnum aureum", price: "£14", tags: ["low-light", "pet-safe"], glyph: "🌿",
      desc: "Trails from a shelf or climbs a pole moss — either way it forgives missed waterings and dim corners better than almost anything we stock." },
    { name: "ZZ Plant", latin: "Zamioculcas zamiifolia", price: "£22", tags: ["low-light"], glyph: "🪴",
      desc: "Stores water in its rhizomes, so a fortnight away is nothing to it. The one plant we recommend without asking a single follow-up question." },
    { name: "Snake Plant", latin: "Dracaena trifasciata", price: "£18", tags: ["low-light", "statement"], glyph: "🗡️",
      desc: "Upright, architectural, and slow enough growing that it looks the same in a flat you've just moved into as one you're about to leave." },
    { name: "Calathea Orbifolia", latin: "Goeppertia orbifolia", price: "£26", tags: ["pet-safe"], glyph: "🍃",
      desc: "Striped leaves that fold up at night. Wants humidity and no direct sun — a bathroom windowsill suits it better than a living room." },
    { name: "Fiddle Leaf Fig", latin: "Ficus lyrata", price: "£58", tags: ["statement"], glyph: "🌳",
      desc: "The plant people buy for a corner that needs presence. Keep it out of draughts and don't rotate it too often — it sulks when moved." },
    { name: "Boston Fern", latin: "Nephrolepis exaltata", price: "£16", tags: ["pet-safe", "low-light"], glyph: "🌱",
      desc: "Wants more water than most of this list — check it twice a week, not once. Rewards that attention with genuinely lush, fast growth." },
    { name: "Rubber Plant", latin: "Ficus elastica", price: "£32", tags: ["statement"], glyph: "🌲",
      desc: "Glossy, upright leaves and a growth habit that's easy to shape. More light-tolerant than a fiddle leaf fig, and considerably less fussy." },
    { name: "Peperomia Hope", latin: "Peperomia tetraphylla", price: "£13", tags: ["pet-safe", "low-light"], glyph: "🍀",
      desc: "Small, trailing, and genuinely hard to overwater badly enough to lose. A good first plant for a desk with middling light." },
    { name: "Monstera Deliciosa", latin: "Monstera deliciosa", price: "£38", tags: ["statement"], glyph: "🌴",
      desc: "The one everyone asks for by name. Needs a pole to climb eventually and bright, indirect light to split its leaves properly." },
  ];

  const state = { filter: "all", testimonialIndex: 0 };

  /* ============================================================
     Plant grid: render + filter
     ============================================================ */
  const grid = document.getElementById("plant-grid");

  function tagLabel(tag) {
    return { "low-light": "Low light", "pet-safe": "Pet-safe", "statement": "Statement size" }[tag] || tag;
  }

  function renderGrid() {
    grid.innerHTML = "";
    const visible = PLANTS.filter(p => state.filter === "all" || p.tags.includes(state.filter));

    if (visible.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty-state";
      empty.textContent = "Nothing in this category right now — check back after the next restock.";
      grid.appendChild(empty);
      return;
    }

    visible.forEach((plant, i) => {
      const li = document.createElement("li");
      li.className = "plant-card";
      li.tabIndex = 0;
      li.setAttribute("role", "button");
      li.setAttribute("aria-label", `View details for ${plant.name}`);
      li.innerHTML = `
        <div class="glyph" aria-hidden="true">${plant.glyph}</div>
        <h3>${plant.name}</h3>
        <p class="latin">${plant.latin}</p>
        <div class="tags">${plant.tags.map(t => `<span class="tag">${tagLabel(t)}</span>`).join("")}</div>
        <p class="price">${plant.price}</p>
      `;
      li.addEventListener("click", () => openModal(plant));
      li.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(plant); }
      });
      grid.appendChild(li);
    });
  }

  document.getElementById("filter-bar").addEventListener("click", e => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.filter = btn.dataset.filter;
    renderGrid();
  });

  renderGrid();

  /* ============================================================
     Modal: plant quick view
     ============================================================ */
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalBody = document.getElementById("modal-body");
  let lastFocused = null;

  function openModal(plant) {
    modalBody.innerHTML = `
      <h3>${plant.name}</h3>
      <p class="latin">${plant.latin}</p>
      <div class="tags">${plant.tags.map(t => `<span class="tag">${tagLabel(t)}</span>`).join("")}</div>
      <p>${plant.desc}</p>
      <p class="price">${plant.price}</p>
    `;
    lastFocused = document.activeElement;
    modalBackdrop.classList.add("is-open");
    document.getElementById("modal-close").focus();
    document.addEventListener("keydown", onModalKeydown);
  }

  function closeModal() {
    modalBackdrop.classList.remove("is-open");
    document.removeEventListener("keydown", onModalKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onModalKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", e => {
    if (e.target === modalBackdrop) closeModal();
  });

  /* ============================================================
     Accordion: care notes
     ============================================================ */
  document.querySelectorAll(".accordion-item").forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      // Close every item first (single-open accordion).
      document.querySelectorAll(".accordion-item").forEach(other => {
        other.classList.remove("is-open");
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
  // First item open by default, matching its aria-expanded="true" markup.
  document.querySelector(".accordion-item").classList.add("is-open");

  /* ============================================================
     Testimonial carousel
     ============================================================ */
  const TESTIMONIALS = [
    { quote: "\u201cI'd killed three pothos before I understood I was watering on a Sunday habit, not on what the plant needed. Twenty minutes at the bench fixed more than a year of guessing.\u201d", name: "Priya N.", role: "Repotting Basics, March" },
    { quote: "\u201cThe propagation class finally explained why my cuttings kept rotting instead of rooting. Turns out I was using a jar that was too deep and too dark.\u201d", name: "Sam O.", role: "Propagation Night, April" },
    { quote: "\u201cI came in for one terrarium and left with an actual understanding of drainage layers. My closed jar is still going eight months later, no watering at all.\u201d", name: "Beth R.", role: "Closed Terrariums, May" },
  ];

  const testimonialQuote = document.getElementById("testimonial-quote");
  const testimonialName = document.getElementById("testimonial-name");
  const testimonialRole = document.getElementById("testimonial-role");
  const dotsWrap = document.getElementById("testimonial-dots");

  function renderDots() {
    dotsWrap.innerHTML = "";
    TESTIMONIALS.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
      if (i === state.testimonialIndex) dot.classList.add("is-active");
      dot.addEventListener("click", () => { state.testimonialIndex = i; renderTestimonial(); });
      dotsWrap.appendChild(dot);
    });
  }

  function renderTestimonial() {
    const t = TESTIMONIALS[state.testimonialIndex];
    testimonialQuote.textContent = t.quote;
    testimonialName.textContent = t.name;
    testimonialRole.textContent = t.role;
    renderDots();
  }

  document.getElementById("testimonial-prev").addEventListener("click", () => {
    state.testimonialIndex = (state.testimonialIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    renderTestimonial();
  });
  document.getElementById("testimonial-next").addEventListener("click", () => {
    state.testimonialIndex = (state.testimonialIndex + 1) % TESTIMONIALS.length;
    renderTestimonial();
  });
  renderTestimonial();

  /* ============================================================
     Mobile nav toggle
     ============================================================ */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });

  /* ============================================================
     Theme toggle (light/dark), persisted in localStorage
     ============================================================ */
  const THEME_KEY = "foliant-theme";
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-pressed", "true");
      themeToggle.setAttribute("aria-label", "Switch to light theme");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-pressed", "false");
      themeToggle.setAttribute("aria-label", "Switch to dark theme");
    }
  }

  let storedTheme = null;
  try { storedTheme = localStorage.getItem(THEME_KEY); } catch (err) { /* storage unavailable — default to light */ }

  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* storage unavailable — theme just won't persist */ }
  });

  /* ============================================================
     Reservation form: client-side validation
     ============================================================ */
  const form = document.getElementById("reserve-form");
  const status = document.getElementById("form-status");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = {
    name: { input: document.getElementById("f-name"), error: document.getElementById("err-name") },
    email: { input: document.getElementById("f-email"), error: document.getElementById("err-email") },
    workshop: { input: document.getElementById("f-workshop"), error: document.getElementById("err-workshop") },
  };

  function setFieldError(key, message) {
    const { input, error } = fields[key];
    error.textContent = message || "";
    input.closest(".form-row").classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(key) {
    const value = fields[key].input.value.trim();
    if (key === "name") {
      if (!value) return setFieldError("name", "Tell us who's reserving the seat."), false;
      if (value.length < 2) return setFieldError("name", "That name looks too short."), false;
      setFieldError("name", "");
      return true;
    }
    if (key === "email") {
      if (!value) return setFieldError("email", "We need an email to confirm the seat."), false;
      if (!EMAIL_RE.test(value)) return setFieldError("email", "That doesn't look like a valid email."), false;
      setFieldError("email", "");
      return true;
    }
    if (key === "workshop") {
      if (!value) return setFieldError("workshop", "Pick a session to reserve."), false;
      setFieldError("workshop", "");
      return true;
    }
    return true;
  }

  Object.keys(fields).forEach(key => {
    fields[key].input.addEventListener("blur", () => validateField(key));
    fields[key].input.addEventListener("input", () => {
      if (fields[key].input.closest(".form-row").classList.contains("has-error")) validateField(key);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields before reserving.";
      status.classList.remove("is-success");
      const firstInvalid = Object.keys(fields).find((key, i) => !results[i]);
      fields[firstInvalid].input.focus();
      return;
    }

    const name = fields.name.input.value.trim().split(" ")[0];
    status.textContent = `Thanks, ${name} — your seat is held for 48 hours. Check your email for confirmation.`;
    status.classList.add("is-success");
    form.reset();
    Object.keys(fields).forEach(key => setFieldError(key, ""));
  });

  /* ============================================================
     Footer year
     ============================================================ */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
