// ============================================================
//  SCRIPT.JS — LinkTree Streamer
//  Ne modifie pas ce fichier directement.
//  Toute personnalisation se fait dans config.js
// ============================================================

(function () {
  "use strict";

  // ── 1. Injecter les variables CSS depuis CONFIG.theme ──────
  function applyTheme() {
    const t = CONFIG.theme;
    const r = document.documentElement.style;
    r.setProperty("--primary",    t.primaryColor);
    r.setProperty("--secondary",  t.secondaryColor);
    r.setProperty("--accent",     t.accentColor);
    r.setProperty("--bg",         t.bgColor);
    r.setProperty("--card-bg",    t.cardBg);
    r.setProperty("--font-title", t.fontTitle);
    r.setProperty("--font-body",  t.fontBody);
  }

  // ── 2. SEO & métadonnées ───────────────────────────────────
  function applyMeta() {
    const m = CONFIG.meta;
    document.title = m.title;
    setMeta("description",    m.description);
    setMeta("theme-color",    m.themeColor);
    setOg("og:title",         m.title);
    setOg("og:description",   m.description);
    setOg("og:url",           m.url);
  }

  function setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute("content", content);
  }

  function setOg(prop, content) {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (el) el.setAttribute("content", content);
  }

  // ── 3. Avatar ──────────────────────────────────────────────
  function renderAvatar() {
    const avatarEl = document.getElementById("avatar-el");
    const glitchEl = document.getElementById("avatar-glitch");
    const src = CONFIG.streamer.avatar;

    if (src && src.trim() !== "") {
      // Essaie de charger l'image
      const img = new Image();
      img.src = src;
      img.onload = () => {
        avatarEl.style.backgroundImage = `url('${src}')`;
        avatarEl.textContent = "";
        glitchEl.style.backgroundImage = `url('${src}')`;
        glitchEl.style.backgroundSize = "cover";
        glitchEl.style.backgroundPosition = "center";
      };
      img.onerror = () => {
        // Si l'image n'existe pas → initiales
        setAvatarInitials(avatarEl);
      };
    } else {
      setAvatarInitials(avatarEl);
    }
  }

  function setAvatarInitials(el) {
    const initials = CONFIG.streamer.pseudo
      .split(/[\s_-]/)
      .slice(0, 2)
      .map(w => w[0] || "")
      .join("")
      .toUpperCase();
    el.textContent = initials || "S";
  }

  // ── 4. Textes profil ───────────────────────────────────────
  function renderProfile() {
    const pseudo  = CONFIG.streamer.pseudo;
    const tagline = CONFIG.streamer.tagline;
    const pseudoEl  = document.getElementById("pseudo-el");
    const taglineEl = document.getElementById("tagline-el");

    pseudoEl.textContent       = pseudo;
    pseudoEl.setAttribute("data-text", pseudo); // pour l'effet glitch CSS
    taglineEl.textContent      = tagline;
  }

  // ── 5. Badge Live ──────────────────────────────────────────
  function renderLiveBadge() {
    const badge   = document.getElementById("live-badge");
    const textEl  = document.getElementById("live-text");
    const live    = CONFIG.live;

    if (live.isLive) {
      badge.classList.add("is-live");
      textEl.textContent = live.liveLabel;
      badge.setAttribute("aria-label", "Statut : en live");
    } else {
      badge.classList.remove("is-live");
      textEl.textContent = live.offlineLabel;
      badge.setAttribute("aria-label", "Statut : hors ligne");
    }
  }

  // ── 6. SVG Icons map ──────────────────────────────────────
  const ICONS = {
    twitch:    { fa: "fab fa-twitch",    },
    discord:   { fa: "fab fa-discord",   },
    youtube:   { fa: "fab fa-youtube",   },
    tiktok:    { fa: "fab fa-tiktok",    },
    instagram: { fa: "fab fa-instagram", },
    twitter:   { fa: "fab fa-x-twitter", },
    kofi:      { fa: "fas fa-mug-hot",   },
    tipee:     { fa: "fas fa-hand-holding-heart", },
    twitch_live: { fa: "fas fa-circle-dot", },
    setup:     { fa: "fas fa-computer", },
    tips:      { fa: "fas fa-credit-card", },
  };

  // ── 7. Rendu des liens ─────────────────────────────────────
  function renderLinks() {
    const container = document.getElementById("links-container");
    container.innerHTML = "";

    CONFIG.links.forEach((link, i) => {
      if (!link.url || link.url.trim() === "") return;

      const iconInfo = ICONS[link.icon] || { fa: "fas fa-link" };
      const accentColor = link.color || CONFIG.theme.primaryColor;

      const card = document.createElement("a");
      card.href       = link.url;
      card.target     = "_blank";
      card.rel        = "noopener noreferrer";
      card.className  = "link-card";
      card.setAttribute("data-id", link.id);
      card.setAttribute("aria-label", `${link.label} — ${link.sublabel}`);

      // CSS custom property pour la couleur d'accent de la carte
      card.style.setProperty("--card-accent-color", accentColor);
      card.style.setProperty("--card-accent", hexToRgba(accentColor, 0.08));

      // Animation en cascade
      card.style.animation = `fadeInUp 0.5s ${0.6 + i * 0.08}s cubic-bezier(0.34,1.56,0.64,1) forwards`;

      card.innerHTML = `
        <div class="link-icon" style="color:${accentColor}; box-shadow: 0 0 14px ${hexToRgba(accentColor, 0.3)}; border-color: ${hexToRgba(accentColor, 0.25)};">
          <i class="${iconInfo.fa}" aria-hidden="true"></i>
        </div>
        <div class="link-text">
          <span class="link-label">${escapeHtml(link.label)}</span>
          <span class="link-sublabel">${escapeHtml(link.sublabel)}</span>
        </div>
        <span class="link-arrow" aria-hidden="true">›</span>
        <div class="scan-line"></div>
      `;

      // Effet clic ripple
      card.addEventListener("click", (e) => ripple(e, card, accentColor));

      container.appendChild(card);
    });
  }

  // ── 8. Effet Ripple ────────────────────────────────────────
  function ripple(e, el, color) {
    const r = document.createElement("span");
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    Object.assign(r.style, {
      position:   "absolute",
      width:      size + "px",
      height:     size + "px",
      left:       x + "px",
      top:        y + "px",
      background: hexToRgba(color, 0.25),
      borderRadius: "50%",
      transform:  "scale(0)",
      pointerEvents: "none",
      zIndex:     "5",
    });

    r.animate([
      { transform: "scale(0)", opacity: 1 },
      { transform: "scale(2.5)", opacity: 0 },
    ], { duration: 500, easing: "ease-out" }).onfinish = () => r.remove();

    el.style.position = "relative";
    el.appendChild(r);
  }

  // ── 9. Curseur personnalisé ────────────────────────────────
  function initCursor() {
    // Pas sur mobile/tactile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = document.createElement("div");
    const ring = document.createElement("div");
    dot.className  = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
    });

    // Ring avec lag
    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      requestAnimationFrame(animRing);
    })();

    // Agrandir sur les liens
    document.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("mouseenter", () => {
        dot.style.width  = "14px";
        dot.style.height = "14px";
        ring.style.width  = "48px";
        ring.style.height = "48px";
        ring.style.opacity = "0.8";
      });
      el.addEventListener("mouseleave", () => {
        dot.style.width  = "8px";
        dot.style.height = "8px";
        ring.style.width  = "32px";
        ring.style.height = "32px";
        ring.style.opacity = "0.5";
      });
    });
  }

  // ── 10. Particules ────────────────────────────────────────
  function initParticles() {
    if (!CONFIG.particles.enabled) return;

    const canvas = document.getElementById("particles-canvas");
    const ctx    = canvas.getContext("2d");
    const cfg    = CONFIG.particles;
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", () => { resize(); initParticlesList(); });

    function Particle() {
      this.reset = function () {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * cfg.speed * 2;
        this.vy = (Math.random() - 0.5) * cfg.speed * 2;
        this.r  = Math.random() * cfg.size + 0.5;
        this.alpha = Math.random() * 0.6 + 0.2;
      };
      this.reset();
    }

    function initParticlesList() {
      particles = Array.from({ length: cfg.count }, () => new Particle());
    }
    initParticlesList();

    const [r, g, b] = hexToRgbArr(cfg.color);

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Mettre à jour positions
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // Dessiner point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
      });

      // Liaisons
      if (cfg.linked) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < cfg.linkDist) {
              const a = (1 - dist / cfg.linkDist) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
              ctx.lineWidth   = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── Helpers ───────────────────────────────────────────────
  function hexToRgba(hex, alpha) {
    const [r, g, b] = hexToRgbArr(hex);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function hexToRgbArr(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    applyTheme();
    applyMeta();
    renderAvatar();
    renderProfile();
    renderLiveBadge();
    renderLinks();
    initCursor();
    initParticles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();