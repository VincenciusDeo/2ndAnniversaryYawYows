/* ============================================
   Anniversary Website JS
   - Section flow control
   - Audio crossfade
   - Animations
   ============================================ */

// ====== KONFIGURASI MUDAH DIUBAH ======
const TYPING_TEXT = "Hai Sayangku Tia, bukaa ini yaaa...";

// Pesan cinta panjang (BAGIAN 4) — ganti sesuai keinginan
const LOVE_LETTER = `Halo sayangku,

Makasih ya sayangg udah mauu bukaa, bernostalgia, dann baca semua web ini sampaii bagian ini, tolong baca setiap kata di bawah ini ya sayangg, pelan pelann aja bacanyaa.

Dua tahun. 731 hari. Rasanya baru kemarin kita pertama bertemu, tapi rasanya juga sudah selamanya kita bersama.

Di awal kita dipertemukan dengan menjadi ketua dan wakil ketua PLS 2

Berbagai hal dan masa telah kita lalui bersama sayangg, mulai dari MPK, TJRC, Sarasehan, dan semua event di Teladan kita bisa lalui bersama

Aku minta maaf ya sayang, aku rasa aku belum bisa bahagiain kamu selama 2 tahun ini, lebih sering aku buat kamu sedih

Aku sering buat kamu kecewa, sering buat kamu ngerasa kangen karena kita jarang ketemu, aku gamau itu tapi aku saat ini belum bisa wujudin huhu

Terima kasih ya sayang sudah jadii pasangan hidupku selama 2 tahun ini, kamu selalu baikk dan care sama aku, aku sangat bersyukur bisa dipertemukan dengan kamu sayang

Terima kasih sudah menjadi rumah di saat aku lelah, menjadi pelangi di saat hariku mendung, dan menjadi alasan untukku tetap tersenyum setiap pagi.

Mencintaimu itu seperti hal paling mudah yang pernah aku lakukan. Semua yang kita lakukan bersama, sekecil apapun, selalu berhasil membuat hatiku nyaman.

Aku tahu sayang, perjalanan kita tidak selalu mulus. Ada tawa, ada tangis, ada amarah, bahkan ego, tapi kita selalu memilih untuk kembali, untuk saling memeluk, untuk tetap bertahan.

Pasti kedepannya akan ada banyak rintangan dan masalah, semoga kita bisa tetap lewatin ini bareng-bareng yaa sayangg

Di anniversary kedua ini, aku ingin bilang, terima kasih sudah memilih aku ya sayang, aku sangat bersyukur dipertemukan dengan kamu sayang. 

Aku janji sayanggg, aku akan terus berusaha menjadi versi terbaikku, untuk kamu, untuk aku, dan untuk kita.

I love you sayanggg, terima kasih sudahh setia dan selalu menemaniku selama 2 tahun yang amat berarti ini.

Kalau harus hidup 1000 kali pun aku akan tetap memilih kamu sayanggku, cantikku, duniakuu, bahagiakuu

Selamanya milikmu,


- yowwws (pasanganmu selamanya) 💗


💖`;

// ====== TYPING ANIMATION (Bagian 0) ======
const typingEl = document.getElementById('typingText');
let typeIdx = 0;
function typeChar() {
  if (typeIdx <= TYPING_TEXT.length) {
    typingEl.textContent = TYPING_TEXT.slice(0, typeIdx++);
    setTimeout(typeChar, 80);
  } else {
    typingEl.style.borderRight = 'none';
  }
}
typeChar();

// ====== BG DECOR (floating hearts/sparkles) ======
const decor = document.getElementById('bgDecor');
const symbols = ['💖','✨','💕','⭐','🌸','💗'];
for (let i = 0; i < 18; i++) {
  const s = document.createElement('span');
  s.textContent = symbols[Math.floor(Math.random()*symbols.length)];
  s.style.left = Math.random()*100 + 'vw';
  s.style.animationDuration = (8 + Math.random()*10) + 's';
  s.style.animationDelay = (Math.random()*10) + 's';
  s.style.fontSize = (0.8 + Math.random()*1.4) + 'rem';
  decor.appendChild(s);
}

// ====== AUDIO CONTROL ======
const audios = [0,1,2,3,4,5].map(i => document.getElementById('audio-' + i));
audios.forEach((a, i) => {
  a.volume = 0;
  a.muted = false;
  a.addEventListener('error', () => {
    console.error('[AUDIO] Gagal memuat audio-' + i + ' (' + a.currentSrc + '). Pastikan file mp3 ada di folder audio/.');
  });
});
let muted = false;
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.textContent = muted ? '🔇' : '🔊';
  audios.forEach(a => a.muted = muted);
});

let currentAudio = null;
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  // "Sentuh" semua audio dalam user gesture supaya browser mengizinkan play berikutnya
  audios.forEach(a => {
    a.muted = false;
    const p = a.play();
    if (p && p.then) {
      p.then(() => { a.pause(); a.currentTime = 0; }).catch(err => {
        console.warn('[AUDIO] Autoplay diblokir untuk', a.id, err);
      });
    }
  });
}

function playAudio(idx) {
  const target = audios[idx];
  if (!target) return;
  // Fade out current
  if (currentAudio && currentAudio !== target) {
    const prev = currentAudio;
    fadeAudio(prev, 0, 600, () => prev.pause());
  }
  // Pastikan tidak muted dan coba play
  target.muted = muted;
  try {
    const p = target.play();
    if (p && p.catch) {
      p.catch(err => {
        console.warn('[AUDIO] play() gagal untuk', target.id, '-', err.message);
        // Coba sekali lagi setelah user gesture berikutnya
        document.addEventListener('click', () => target.play().catch(()=>{}), { once: true });
      });
    }
  } catch(e) { console.warn(e); }
  fadeAudio(target, 0.6, 800);
  currentAudio = target;
}

function fadeAudio(audio, to, ms, cb) {
  const from = audio.volume;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / ms, 1);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * t));
    if (t < 1) requestAnimationFrame(step);
    else if (cb) cb();
  }
  requestAnimationFrame(step);
}

// ====== SECTION NAVIGATION ======
const sections = document.querySelectorAll('.section');
function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const idx = parseInt(id.split('-')[1], 10);
  playAudio(idx);

  // trigger section-specific animations
  if (id === 'section-1') triggerStory();
  if (id === 'section-3') triggerUniverse();
  if (id === 'section-4') triggerLetter();
  if (id === 'section-5') triggerConfetti();
}

document.getElementById('startBtn').addEventListener('click', () => {
  unlockAudio();
  // Mulai musik opening dulu sebagai test, lalu lanjut ke section-1
  playAudio(0);
  setTimeout(() => showSection('section-1'), 50);
});

document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    unlockAudio();
    const next = btn.dataset.next;
    if (next) showSection(next);
  });
});

document.getElementById('surpriseBtn').addEventListener('click', () => {
  showSection('section-5');
});

// ====== BAGIAN 1: STORY REVEAL ======
function triggerStory() {
  const blocks = document.querySelectorAll('#section-1 .story-block, #section-1 .story-photo');
  blocks.forEach((b, i) => {
    setTimeout(() => b.classList.add('show'), 400 + i * 700);
  });
}

// ====== BAGIAN 3: UNIVERSE ======
function triggerUniverse() {
  const sec = document.getElementById('section-3');
  // generate stars bg once
  const bg = document.getElementById('starsBg');
  if (!bg.children.length) {
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random()*100 + '%';
      s.style.top = Math.random()*100 + '%';
      s.style.animationDelay = (Math.random()*3) + 's';
      bg.appendChild(s);
    }
  }
  sec.classList.remove('merged','show-text-1','show-text-2');
  setTimeout(() => sec.classList.add('show-text-1'), 800);
  setTimeout(() => sec.classList.add('merged'), 2000);
  setTimeout(() => sec.classList.add('show-text-2'), 6500);
}

// ====== BAGIAN 4: LETTER (word by word) ======
function triggerLetter() {
  const el = document.getElementById('letterText');
  el.innerHTML = '';
  const words = LOVE_LETTER.split(/(\s+)/); // keep spaces/newlines
  words.forEach(w => {
    if (/\n/.test(w)) {
      el.appendChild(document.createElement('br'));
      return;
    }
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = w;
    el.appendChild(span);
  });
  const wordEls = el.querySelectorAll('.word');
  wordEls.forEach((w, i) => {
    setTimeout(() => w.classList.add('show'), i * 90);
  });
}

// ====== BAGIAN 5: CONFETTI ======
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#ff6fa3','#ffafcc','#ffc8dd','#e0c3fc','#ffd6c0','#fff'];
  const shapes = ['❤','💖','✨','●'];
  const parts = [];
  for (let i = 0; i < 140; i++) {
    parts.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      vy: 1 + Math.random() * 3,
      vx: -1 + Math.random() * 2,
      size: 10 + Math.random() * 18,
      color: colors[Math.floor(Math.random()*colors.length)],
      shape: shapes[Math.floor(Math.random()*shapes.length)],
      rot: Math.random() * 360,
      vr: -3 + Math.random() * 6
    });
  }
  let running = true;
  function tick() {
    if (!running) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random()*canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.font = p.size + 'px serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.shape, 0, 0);
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  tick();
  // stop after a while to save battery
  setTimeout(() => { running = false; ctx.clearRect(0,0,canvas.width,canvas.height); }, 12000);
}
