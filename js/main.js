/* ═══════════════════════════════════════════════════════
   CORAZON — main.js
═══════════════════════════════════════════════════════ */

// ── TYPING EFFECT ──────────────────────────────────────
const typingWords = [
  'Valorant',
  'Montage',
  'Just Chatting',
  'des moments épiques',
  'avec ma communauté'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const current = typingWords[wordIndex];

  if (isDeleting) {
    el.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    el.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

// ── PARTICLES ──────────────────────────────────────────
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.7
      ? `rgba(145, 71, 255, ${this.opacity})`
      : Math.random() > 0.5
        ? `rgba(0, 245, 212, ${this.opacity})`
        : `rgba(255, 255, 255, ${this.opacity})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > this.canvas.width ||
        this.y < 0 || this.y > this.canvas.height) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.animId = null;

    this.resize();
    this.spawnParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.particles.length === 0) return;
    this.particles.forEach(p => p.reset());
  }

  spawnParticles() {
    const count = Math.min(Math.floor(window.innerWidth / 12), 120);
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(145, 71, 255, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.update();
      p.draw(this.ctx);
    });
    this.drawConnections();
    this.animId = requestAnimationFrame(() => this.animate());
  }
}

// ── CUSTOM CURSOR ──────────────────────────────────────
class CustomCursor {
  constructor() {
    this.dot    = document.getElementById('cursorDot');
    this.ring   = document.getElementById('cursorRing');
    if (!this.dot || !this.ring) return;

    this.ringX = 0; this.ringY = 0;
    this.dotX  = 0; this.dotY  = 0;
    this.targetX = 0; this.targetY = 0;

    document.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    });

    document.querySelectorAll('a, button, .game-card, .clip-card, .social-card').forEach(el => {
      el.addEventListener('mouseenter', () => this.ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => this.ring.classList.remove('hovering'));
    });

    this.animate();
  }

  animate() {
    this.dotX  += (this.targetX - this.dotX)  * 0.9;
    this.dotY  += (this.targetY - this.dotY)  * 0.9;
    this.ringX += (this.targetX - this.ringX) * 0.15;
    this.ringY += (this.targetY - this.ringY) * 0.15;

    this.dot.style.left  = this.dotX  + 'px';
    this.dot.style.top   = this.dotY  + 'px';
    this.ring.style.left = this.ringX + 'px';
    this.ring.style.top  = this.ringY + 'px';

    requestAnimationFrame(() => this.animate());
  }
}

// ── SCROLL REVEAL ──────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// ── COUNTERS ───────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const formatNum = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1)    + 'K';
    return Math.round(n).toString();
  };

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 4);
    el.textContent = formatNum(Math.round(ease * target));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const val = parseInt(el.dataset.count, 10);
        animateCounter(el, val);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));
}

// ── GAME BARS ──────────────────────────────────────────
function initGameBars() {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.game-bar-fill').forEach(el => barObs.observe(el));
}

// ── NAVBAR ─────────────────────────────────────────────
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links    = document.querySelectorAll('.nav-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile menu
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const activateLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h   = sec.offsetHeight;
      const id  = sec.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });
}

// ── SCROLL PROGRESS ────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

// ── BACK TO TOP ────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── LOADER ─────────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Remove after animation
  setTimeout(() => {
    loader.classList.add('hidden');
    // Kick off hero animations
    document.querySelectorAll('#hero [data-reveal]').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 150);
    });
    document.querySelector('.live-badge')?.classList.add('visible');
    // Start typing
    setTimeout(typeLoop, 600);
  }, 2400);
}

// ── LIVE BADGE (simulated) ─────────────────────────────
// Replace this with a real Twitch Helix API call in production
function checkLiveStatus() {
  // CUSTOMIZE: Pour un vrai check, utilise l'API Twitch Helix
  // https://dev.twitch.tv/docs/api/reference/#get-streams
  // Pour l'instant, on simule selon l'heure (optionnel)
  const liveBtn  = document.getElementById('liveBtn');
  const liveText = liveBtn?.querySelector('.live-text');

  // Exemple: activer manuellement avec: setLive(true)
  window.setLive = (isLive) => {
    liveBtn?.classList.toggle('is-live', isLive);
    if (liveText) liveText.textContent = isLive ? 'EN DIRECT' : 'SUIVRE';
  };
}

// ── SMOOTH SECTION SCROLL ──────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ── CLIP MODAL ─────────────────────────────────────────
function initClipCards() {
  const modal    = document.getElementById('clipModal');
  const iframe   = document.getElementById('clipModalIframe');
  const title    = document.getElementById('clipModalTitle');
  const closeBtn = document.getElementById('clipModalClose');
  const backdrop = modal?.querySelector('.clip-modal-backdrop');
  if (!modal) return;

  function openModal(clipId, clipTitle) {
    // Twitch nécessite le domaine exact dans "parent"
    const host = window.location.hostname || 'localhost';
    // Pour GitHub Pages le host sera ex: username.github.io
    const src  = `https://clips.twitch.tv/embed?clip=${clipId}&parent=${host}&autoplay=true`;
    iframe.src = src;
    title.textContent = clipTitle || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Stop la vidéo en vidant le src
    setTimeout(() => { iframe.src = ''; }, 300);
  }

  // Clic sur une carte
  document.querySelectorAll('.clip-card[data-clip]').forEach(card => {
    card.addEventListener('click', () => {
      const clipId    = card.dataset.clip;
      const clipTitle = card.dataset.title;
      if (!clipId || clipId.startsWith('CLIP_ID_')) {
        // Pas encore configuré — ouvre Twitch à la place
        window.open('https://twitch.tv/gg_corazon/clips', '_blank');
        return;
      }
      openModal(clipId, clipTitle);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // Echap pour fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

// ── PARALLAX SUBTLE ────────────────────────────────────
function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const y = scrollY * 0.3;
      hero.style.setProperty('--parallax-y', `${y}px`);
    }
  }, { passive: true });
}

// ── TILT EFFECT ON CARDS ───────────────────────────────
function initTilt() {
  document.querySelectorAll('.game-card, .about-card, .support-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -6;
      const tiltY  = dx *  6;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── TODAY HIGHLIGHT ────────────────────────────────────
function highlightToday() {
  const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  const today = days[new Date().getDay()];

  document.querySelectorAll('.schedule-day').forEach(dayEl => {
    const nameEl = dayEl.querySelector('.day-name');
    if (!nameEl) return;
    const dayName = nameEl.textContent.trim().toLowerCase();
    if (dayName === today) {
      dayEl.style.borderColor = 'rgba(145, 71, 255, 0.6)';
      dayEl.style.boxShadow   = '0 0 20px rgba(145, 71, 255, 0.2)';
      const badge = document.createElement('div');
      badge.textContent = "📍 Aujourd'hui";
      badge.style.cssText = `
        font-size: 0.65rem; color: var(--accent-cyan);
        font-weight: 600; letter-spacing: 0.05em;
        margin-top: 4px;
      `;
      dayEl.querySelector('.day-header')?.appendChild(badge);
    }
  });
}

// ── DISCORD STATS EN TEMPS RÉEL ────────────────────────
async function fetchDiscordStats() {
  // Utilise l'API publique Discord via le lien d'invitation (pas besoin de clé)
  const inviteCode = 'UURcrf9YyC'; // CUSTOMIZE: ton code d'invitation Discord
  try {
    const res  = await fetch(`https://discord.com/api/invites/${inviteCode}?with_counts=true`);
    const data = await res.json();

    const totalEl  = document.getElementById('discordMembers');
    const onlineEl = document.getElementById('discordOnline');

    if (totalEl)  animateCounter(totalEl,  data.approximate_member_count,   1200);
    if (onlineEl) animateCounter(onlineEl, data.approximate_presence_count, 1200);
  } catch {
    // Si l'API est inaccessible, on garde les tirets
    console.warn('Discord stats: impossible de récupérer les données.');
  }
}

// ── MODAL RÈGLEMENT (chargé depuis rules-modal.html) ───
async function initRulesModal() {
  try {
    const res  = await fetch('rules-modal.html');
    const html = await res.text();
    document.body.insertAdjacentHTML('beforeend', html);

    const modal    = document.getElementById('rulesModal');
    const openBtn  = document.getElementById('openRulesModal');
    const closeBtn = document.getElementById('closeRulesModal');
    const backdrop = modal?.querySelector('.rules-backdrop');
    if (!modal) return;

    const open  = () => { modal.classList.add('open');    document.body.style.overflow = 'hidden'; };
    const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
    openBtn?.addEventListener('click',  (e) => { e.preventDefault(); open(); });
    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  } catch {
    console.warn('rules-modal.html introuvable.');
  }
}

function initStreamEmbed() {
  if (typeof Twitch === 'undefined') return;

  const embed = new Twitch.Embed('twitch-embed', {
    width:    '100%',
    height:   '100%',
    channel:  'gg_corazon',
    layout:   'video',
    autoplay: false,
  });

  // Affiche la section si le stream est en ligne
  embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    const player = embed.getPlayer();
    player.addEventListener(Twitch.Player.ONLINE, () => {
      document.getElementById('live-stream').style.display = 'block';
    });
    player.addEventListener(Twitch.Player.OFFLINE, () => {
      document.getElementById('live-stream').style.display = 'none';
    });
  });
}

// ── INIT ALL ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollProgress();
  initNavbar();
  initScrollReveal();
  initCounters();
  initGameBars();
  initBackToTop();
  initSmoothScroll();
  initClipCards();
  initParallax();
  initTilt();
  highlightToday();
  checkLiveStatus();
  fetchDiscordStats();
  initRulesModal();
  initStreamEmbed();

  // Cursor (desktop only)
  if (window.matchMedia('(pointer: fine)').matches) {
    new CustomCursor();
  }

  // Particles
  new ParticleSystem();
});
