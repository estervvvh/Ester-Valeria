/* =======================================================
   Portfolio — Ester Valeria Hutajulu
   script.js (full)
   Tip: ubah link/linkedin/nomor WA di bagian CONFIG
======================================================= */

/* -------- CONFIG (edit sesuai punyamu) -------- */
const CONFIG = {
  // CV Google Drive share link (SUDAH DIISI SESUAI PERMINTAAN)
  cvDriveLink:
    "https://drive.google.com/file/d/1DAVrsj6pzdGUNT61jIlyWkts0wIW5kGq/view?usp=drive_link",

  linkedinUrl: "https://www.linkedin.com/in/ester-valeria-hutajulu-87b6b3376",
  whatsappNumber: "6285762016183",
  instagramUsername: "waaashii___",
  emailAddress: "estervhutajulu@gmail.com",

  // Sertifikat yang ada di folder yang sama dengan website
  certificateFiles: [
    "CERTIFICATE PROGRAMMING WITH JAVA.pdf",
    "CERTIFICATE PROGRAMMING WITH C.pdf",
    "CERTIFICATE PROJECT MANAGEMENT.pdf",
  ],
  // Opsional: mapping thumbnail gambar (jpg/png) untuk tiap PDF
  certificateThumbnails: {
    "CERTIFICATE PROGRAMMING WITH JAVA.pdf": "java.jpg",
    "CERTIFICATE PROGRAMMING WITH C.pdf": "C.jpg",
    "CERTIFICATE PROJECT MANAGEMENT.pdf": "m.jpg",
  },
};

/* -------- Helpers -------- */
const $ = (sel, c = document) => c.querySelector(sel);
const $$ = (sel, c = document) => Array.from(c.querySelectorAll(sel));

const drivePreview = (url) => {
  if (!url) return "";
  // support link Drive: /d/<id>/view atau ?id=<id>
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([^&]+)/);
  const id = m ? m[1] : null;
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
};

const whatsAppUrl = (number, text = "") => {
  if (!number) return "#";
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${number}${q}`;
};

/* =======================================================
   NAV + SMOOTH SCROLL
======================================================= */
const navToggle = $(".nav-toggle");
const navMenu = $("#nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // close menu when link clicked
  navMenu.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// smooth scroll for intra-page anchors
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 72; // offset nav
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

/* =======================================================
   FOOTER YEAR
======================================================= */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =======================================================
   REVEAL ON SCROLL
======================================================= */
const reveals = $$(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          obs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* =======================================================
   HERO PARALLAX ORBS
======================================================= */
const orbs = $$("[data-parallax]");
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    orbs.forEach((el) => {
      const f = Number(el.getAttribute("data-parallax")) || 0;
      el.style.transform = `translateY(${(y * f) / 100}px)`;
    });
  },
  { passive: true }
);

/* =======================================================
   CV – PREVIEW & OPEN
======================================================= */
const cvLink = $("#cv-link");
const cvPrev = $("#cv-preview");
const cvModal = $("#cv-modal");
const cvIframe = $("#cv-iframe");

const openDialog = (dlg) =>
  dlg?.showModal ? dlg.showModal() : dlg?.setAttribute("open", "open");
const closeDialog = (dlg) =>
  dlg?.close ? dlg.close() : dlg?.removeAttribute("open");

// Set link tombol "Open in New Tab"
if (cvLink) cvLink.href = CONFIG.cvDriveLink || "#";

// Preview modal
if (cvPrev && cvModal && cvIframe) {
  cvPrev.addEventListener("click", () => {
    const url = drivePreview(CONFIG.cvDriveLink);
    if (!url) return;
    cvIframe.src = url;
    openDialog(cvModal);
  });

  cvModal.addEventListener("close", () => (cvIframe.src = ""));
  cvModal.addEventListener("click", (e) => {
    const r = cvModal.getBoundingClientRect();
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;
    if (!inside) closeDialog(cvModal);
  });
}

// BONUS: klik thumbnail CV (kalau ada di DOM) juga buka preview
(() => {
  const cvThumb = $('#cv .cert-card .cert-media img');
  if (cvThumb && cvPrev) {
    cvThumb.style.cursor = 'pointer';
    cvThumb.addEventListener('click', () => cvPrev.click());
  }
})();

/* =======================================================
   CERTIFICATES – RENDER GRID + ACTION BUTTONS
======================================================= */
const certOpenBtn = $("#cert-open");
const certTabBtn = $("#cert-download");
const firstCert = CONFIG.certificateFiles?.[0] || "";

if (certOpenBtn && cvModal && cvIframe) {
  certOpenBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!firstCert) return;
    cvIframe.src = firstCert;
    openDialog(cvModal);
  });
}
if (certTabBtn) certTabBtn.href = firstCert || "#";

// Render grid cards
(() => {
  // sisipkan ke panel/container certificates
  const container =
    $("#certificates .container.panel") ||
    $("#certificates .panel") ||
    $("#certificates .container");
  if (
    !container ||
    !Array.isArray(CONFIG.certificateFiles) ||
    CONFIG.certificateFiles.length === 0
  )
    return;

  const grid = document.createElement("div");
  grid.className = "cert-grid";

  CONFIG.certificateFiles.forEach((file) => {
    const card = document.createElement("article");
    card.className = "cert-card";
    const media = document.createElement("div");
    media.className = "cert-media";
    const img = document.createElement("img");

    const mapped = CONFIG.certificateThumbnails[file];
    const base = mapped
      ? mapped.replace(/\.(jpg|png)$/i, "")
      : file.replace(/\.pdf$/i, "");

    img.alt = `Preview ${file}`;
    img.src = mapped ? mapped : `${base}.jpg`;
    img.addEventListener("error", () => {
      if (!img.dataset.triedPng) {
        img.dataset.triedPng = "1";
        img.src = `${base}.png`;
      } else {
        media.innerHTML = "";
        const fb = document.createElement("div");
        fb.className = "fallback";
        fb.textContent = "Preview not available";
        media.appendChild(fb);
      }
    });

    media.appendChild(img);

    const content = document.createElement("div");
    content.className = "cert-content";
    const title = document.createElement("h3");
    title.className = "cert-title";
    title.textContent = file;

    const controls = document.createElement("div");
    controls.className = "cert-controls";
    const btnPrev = document.createElement("button");
    btnPrev.type = "button";
    btnPrev.className = "btn small";
    btnPrev.textContent = "Preview";
    btnPrev.addEventListener("click", () => {
      if (!cvModal || !cvIframe) return;
      cvIframe.src = file;
      openDialog(cvModal);
    });

    const aOpen = document.createElement("a");
    aOpen.className = "btn ghost small";
    aOpen.href = file;
    aOpen.target = "_blank";
    aOpen.rel = "noopener";
    aOpen.textContent = "Open in New Tab";

    controls.append(btnPrev, aOpen);
    content.append(title, controls);
    card.append(media, content);
    grid.appendChild(card);
  });

  container.appendChild(grid);
})();

/* =======================================================
   CONTACT FORM (Dummy handler)
======================================================= */
const form = $("#contact-form");
if (form) {
  const note = form.querySelector(".form-note");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const msg = String(fd.get("message") || "").trim();
    if (!name || !email || !msg) {
      if (note) note.textContent = "Please complete all fields.";
      return;
    }
    if (note) note.textContent = "Thank you! Your message has been sent.";
    form.reset();
  });
}

/* =======================================================
   SOCIAL LINKS
======================================================= */
const waLinkEl = $("#wa-link");
const igLinkEl = $("#ig-link");
const lnLinkEl = $("#linkedin-btn");
const mailLink = $("#email-link");

if (waLinkEl)
  waLinkEl.href = whatsAppUrl(
    CONFIG.whatsappNumber,
    "Hi Ester, I saw your portfolio website."
  );
if (igLinkEl)
  igLinkEl.href = CONFIG.instagramUsername
    ? `https://instagram.com/${CONFIG.instagramUsername}`
    : "#";
if (lnLinkEl) lnLinkEl.href = CONFIG.linkedinUrl || "#";
if (mailLink) mailLink.href = CONFIG.emailAddress ? `mailto:${CONFIG.emailAddress}` : "#";

/* =======================================================
   CURSOR GLOW + TILT HOVER
======================================================= */
(function cursorAndTilt() {
  // 1) Cursor Glow (div mengikuti cursor)
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let x = 0,
    y = 0,
    tx = 0,
    ty = 0;
  const lerp = (a, b, t) => a + (b - a) * t;

  function tick() {
    tx = lerp(tx, x, 0.18);
    ty = lerp(ty, y, 0.18);
    glow.style.left = `${tx}px`;
    glow.style.top = `${ty}px`;
    requestAnimationFrame(tick);
  }
  window.addEventListener(
    "mousemove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
    },
    { passive: true }
  );
  tick();

  // 2) Tilt efek pada kartu
  const MAX = 10; // derajat
  const cards = $$(".skill-card, .project-card, .cert-card, .edu-card");
  cards.forEach((el) => {
    let raf;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-py * MAX).toFixed(2);
      const ry = (px * MAX).toFixed(2);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    };
    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
  });
})();

