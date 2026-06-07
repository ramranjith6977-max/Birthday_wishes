/* =========================================================
   RANJITH BIRTHDAY WEBSITE — script.js
   ========================================================= */

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 900, once: true, offset: 80 });

  buildGallery();
  buildSlider();
  buildQuotes();
  startTyping();
  startCountdown();
  spawnBalloons();
  spawnFloatingHearts();
  startParticles();
  startConfetti();

  // Sparkle on mouse move
  document.addEventListener('mousemove', handleSparkle);
});

// ─── PHOTO DATA ──────────────────────────────────────────────
const photos = Array.from({ length: 30 }, (_, i) => ({
  src: `photo${i + 1}.jpg`,
  label: `Memory ${i + 1}`
}));

// ─── GALLERY ─────────────────────────────────────────────────
let currentLightbox = 0;

function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  photos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-aos', i % 2 === 0 ? 'fade-up' : 'zoom-in');
    item.setAttribute('data-aos-delay', String((i % 4) * 80));
    item.innerHTML = `
      <img src="${photo.src}" alt="${photo.label}" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/${i + 1}/400/400'" />
      <div class="gallery-overlay"><span>${photo.label}</span></div>`;
    item.addEventListener('click', () => openLightbox(i));
    grid.appendChild(item);
  });
}

// ─── LIGHTBOX ─────────────────────────────────────────────────
function openLightbox(index) {
  currentLightbox = index;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  img.src = photos[index].src;
  img.onerror = () => { img.src = `https://picsum.photos/seed/${index + 1}/800/600`; };
  img.alt = photos[index].label;
  counter.textContent = `${index + 1} / ${photos.length}`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxNav(dir, e) {
  e.stopPropagation();
  currentLightbox = (currentLightbox + dir + photos.length) % photos.length;
  openLightbox(currentLightbox);
}

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'ArrowRight') lightboxNav(1, { stopPropagation: () => {} });
  if (e.key === 'ArrowLeft')  lightboxNav(-1, { stopPropagation: () => {} });
  if (e.key === 'Escape') closeLightbox();
});

// ─── SLIDER ───────────────────────────────────────────────────
let sliderIndex = 0;
const sliderVisible = window.innerWidth < 768 ? 1 : 3;

function buildSlider() {
  const track = document.getElementById('sliderTrack');
  photos.slice(0, 15).forEach((photo, i) => {
    const slide = document.createElement('div');
    slide.className = 'slider-slide';
    slide.innerHTML = `<img src="${photo.src}" alt="${photo.label}" loading="lazy"
      onerror="this.src='https://picsum.photos/seed/${i + 50}/300/400'" />`;
    track.appendChild(slide);
  });
}

function slideCarousel(dir) {
  const track = document.getElementById('sliderTrack');
  const slides = track.querySelectorAll('.slider-slide');
  const max = slides.length - sliderVisible;
  sliderIndex = Math.max(0, Math.min(sliderIndex + dir, max));
  const slideWidth = slides[0].offsetWidth + 16;
  track.style.transform = `translateX(-${sliderIndex * slideWidth}px)`;
}

// ─── QUOTES DATA ──────────────────────────────────────────────
const quotesData = [
  { emoji: '💛', text: 'A brother is a friend given by nature, polished by time, and cherished for life.', author: 'Brother Bond' },
  { emoji: '🌟', text: 'Having you as my brother is the greatest adventure my life will ever know.', author: 'Family Love' },
  { emoji: '❤️', text: 'Side by side or miles apart, a brother always holds a piece of our heart.', author: 'Timeless Truth' },
  { emoji: '🎂', text: 'May every candle on your cake represent a wish that will come true this year.', author: 'Birthday Wish' },
  { emoji: '🚀', text: 'You were born with more gifts than you\'ll ever count. Today, the world celebrates them.', author: 'Inspiration' },
  { emoji: '🌸', text: 'Brothers don\'t let each other wander in the dark alone. That\'s the deal — forever.', author: 'Brotherhood' },
  { emoji: '✨', text: 'Wherever you go, go with all your heart. The world needs more of you in it.', author: 'Wisdom' },
  { emoji: '🏆', text: 'Your biggest battles became your greatest strengths. Happy birthday, champion.', author: 'Strength' },
  { emoji: '🌙', text: 'The memories we\'ve made together are the most precious things I own. Thank you.', author: 'Gratitude' },
  { emoji: '💫', text: 'To the world you may be one person, but to our family, you are the world.', author: 'Family Quote' },
  { emoji: '🌊', text: 'You have the kind of soul that makes every room brighter just by walking in.', author: 'Truth' },
  { emoji: '🔥', text: 'Dream bigger, aim higher, burn brighter — because you were made for extraordinary things.', author: 'Birthday Note' },
];

function buildQuotes() {
  const grid = document.getElementById('quotesGrid');
  quotesData.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'quote-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 3) * 100));
    card.innerHTML = `
      <span class="quote-emoji">${q.emoji}</span>
      <p class="quote-text">${q.text}</p>
      <span class="quote-author">— ${q.author}</span>`;
    grid.appendChild(card);
  });
}

// ─── TYPING ANIMATION ─────────────────────────────────────────
const messages = [
  "Wishing you a day as incredible as you are…",
  "May your year be filled with joy and laughter…",
  "You are loved more than words can say…",
  "Today is all about you, dear Ranjith ❤️"
];
let msgIdx = 0, charIdx = 0, typing = true;
const el = document.getElementById('typingText');

function startTyping() {
  if (!el) return;
  function tick() {
    const msg = messages[msgIdx];
    if (typing) {
      el.textContent = msg.slice(0, ++charIdx);
      if (charIdx >= msg.length) { typing = false; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = msg.slice(0, --charIdx);
      if (charIdx <= 0) {
        typing = true;
        msgIdx = (msgIdx + 1) % messages.length;
      }
    }
    setTimeout(tick, typing ? 65 : 35);
  }
  tick();
}

// ─── COUNTDOWN ────────────────────────────────────────────────
function startCountdown() {
  function update() {
    const now = new Date();
    let next = new Date(now.getFullYear(), 5, 20); // June 20
    if (now >= next) next = new Date(now.getFullYear() + 1, 5, 20);
    const diff = next - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdDays').textContent  = String(d).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
    document.getElementById('cdMins').textContent  = String(m).padStart(2, '0');
    document.getElementById('cdSecs').textContent  = String(s).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

// ─── MUSIC PLAYER ─────────────────────────────────────────────
let isPlaying = false;
function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const btn   = document.getElementById('playPauseBtn');
  const disc  = document.getElementById('musicDisc');
  if (audio.src && audio.readyState > 0) {
    if (isPlaying) { audio.pause(); btn.textContent = '▶'; disc.classList.remove('playing'); }
    else           { audio.play(); btn.textContent = '⏸'; disc.classList.add('playing'); }
    isPlaying = !isPlaying;
  } else {
    // No audio file set — animate anyway for demo
    isPlaying = !isPlaying;
    btn.textContent = isPlaying ? '⏸' : '▶';
    disc.classList.toggle('playing', isPlaying);
  }
}
function setVolume(v) {
  const audio = document.getElementById('bgMusic');
  audio.volume = v;
  const pct = v * 100;
  document.getElementById('volumeSlider').style.background =
    `linear-gradient(to right, var(--gold) ${pct}%, rgba(255,255,255,0.2) ${pct}%)`;
}

// ─── SURPRISE ─────────────────────────────────────────────────
function openSurprise() {
  const overlay = document.getElementById('surpriseOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  startFireworks();
  burstPopupHearts();
}
function closeSurprise() {
  document.getElementById('surpriseOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ─── FIREWORKS ────────────────────────────────────────────────
function startFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const particles = [];
  const colors = ['#d4a843','#f0c96a','#2e8bc0','#ff6b8a','#ffd700','#ff4d6d'];

  function createBurst(x, y) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 2 + Math.random() * 3
      });
    }
  }

  let fw_raf;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.08;
      p.life -= 0.018;
      ctx.globalAlpha = p.life;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      if (p.life <= 0) particles.splice(i, 1);
    });
    ctx.globalAlpha = 1;
    fw_raf = requestAnimationFrame(animate);
  }
  animate();

  // Periodic bursts
  const interval = setInterval(() => {
    createBurst(Math.random() * canvas.width, Math.random() * canvas.height * 0.6);
  }, 400);

  // Stop after overlay closes
  const observer = new MutationObserver(() => {
    if (!document.getElementById('surpriseOverlay').classList.contains('active')) {
      cancelAnimationFrame(fw_raf);
      clearInterval(interval);
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('surpriseOverlay'), { attributes: true });
}

// ─── POPUP HEARTS BURST ───────────────────────────────────────
function burstPopupHearts() {
  const container = document.getElementById('popupHearts');
  container.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('div');
    h.style.cssText = `
      position:absolute;
      left:${10 + Math.random()*80}%;
      bottom:${10 + Math.random()*30}%;
      font-size:${14 + Math.random()*18}px;
      animation: floatUp ${1.5 + Math.random()*2}s ease-out ${Math.random() * 0.5}s forwards;
      pointer-events:none;
    `;
    h.textContent = ['❤️','💛','💖','🧡','💝'][Math.floor(Math.random() * 5)];
    container.appendChild(h);
  }
}

// ─── FLOATING HEARTS ──────────────────────────────────────────
function spawnFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['❤️','💛','💖','✨','🌟','💫'];
  setInterval(() => {
    if (document.hidden) return;
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = 12 + Math.random() * 16 + 'px';
    h.style.animationDuration = 6 + Math.random() * 8 + 's';
    h.style.animationDelay    = Math.random() * 2 + 's';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    container.appendChild(h);
    setTimeout(() => h.remove(), 16000);
  }, 800);
}

// ─── BALLOONS ─────────────────────────────────────────────────
function spawnBalloons() {
  const container = document.getElementById('balloons');
  const colors = [
    '#e63946','#2a9d8f','#e9c46a','#457b9d','#f4a261','#a8dadc',
    '#d4a843','#2e8bc0','#ff6b8a','#c77dff'
  ];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left     = 2 + Math.random() * 96 + 'vw';
    b.style.background = colors[Math.floor(Math.random() * colors.length)];
    b.style.animationDuration = 12 + Math.random() * 16 + 's';
    b.style.animationDelay    = Math.random() * 8 + 's';
    container.appendChild(b);
  }
}

// ─── PARTICLES CANVAS ─────────────────────────────────────────
function startParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1 + Math.random() * 2,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    color: Math.random() > 0.5 ? '#d4a843' : '#2e8bc0'
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x = (p.x + p.vx + canvas.width)  % canvas.width;
      p.y = (p.y + p.vy + canvas.height) % canvas.height;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── CONFETTI CANVAS ──────────────────────────────────────────
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: 6 + Math.random() * 8,
    h: 10 + Math.random() * 14,
    color: ['#d4a843','#f0c96a','#2e8bc0','#ff6b8a','#fff','#ff4d6d','#00d4ff'][Math.floor(Math.random()*7)],
    vy: 2 + Math.random() * 3,
    vx: (Math.random() - 0.5) * 2,
    angle: Math.random() * Math.PI * 2,
    spin:  (Math.random() - 0.5) * 0.15
  }));

  let frames = 0;
  function drop() {
    if (frames++ > 220) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.angle += p.spin;
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drop);
  }
  drop();
}

// ─── SPARKLE ON MOUSE MOVE ─────────────────────────────────────
let sparkleThrottle = 0;
function handleSparkle(e) {
  if (Date.now() - sparkleThrottle < 120) return;
  sparkleThrottle = Date.now();
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = e.clientX - 10 + 'px';
  s.style.top  = e.clientY - 10 + 'px';
  s.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random() * 4)];
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1000);
}

// ─── HERO NAME glow data-text ──────────────────────────────────
const heroName = document.getElementById('heroName');
if (heroName) heroName.setAttribute('data-text', heroName.textContent);
