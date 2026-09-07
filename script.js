(function () {
  console.log(
    '%c\n' +
    ' ██████╗  █████╗ ████████╗███████╗███████╗██╗\n' +
    ' ██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║\n' +
    ' ██████╔╝███████║   ██║   ███████╗█████╗  ██║\n' +
    ' ██╔══██╗██╔══██║   ██║   ╚════██║██╔══╝  ██║\n' +
    ' ██║  ██║██║  ██║   ██║   ███████║███████╗███████╗\n' +
    ' ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚══════╝\n',
    'color:#00ff66;font-weight:bold;'
  );
  console.log('%cDu bist schon hier. Gut. Der Code liegt offen — lies ihn.', 'color:#8fe6ac;font-size:13px;');
})();

const RAETSEL_KEY = 'raetsel_unlocked';

function getUnlockedLevel() {
  const raw = parseInt(localStorage.getItem(RAETSEL_KEY) || '1', 10);
  return Number.isFinite(raw) && raw >= 1 ? raw : 1;
}

function unlockLevel(n) {
  const current = getUnlockedLevel();
  if (n > current) {
    try { localStorage.setItem(RAETSEL_KEY, String(n)); } catch (e) {}
  }
}

function normalizeCode(str) {
  return String(str || '').trim().toUpperCase().replace(/\s+/g, '');
}

function checkCodeInput(inputEl, expected, onSuccess, msgEl) {
  const value = normalizeCode(inputEl.value);
  if (value === normalizeCode(expected)) {
    if (msgEl) {
      msgEl.textContent = 'ZUGANG GEWÄHRT. Weiterleitung ...';
      msgEl.className = 'msg ok';
    }
    if (onSuccess) onSuccess();
    return true;
  }
  if (msgEl) {
    msgEl.textContent = 'FALSCHER CODE. Sieh dir den Quellcode nochmal genauer an.';
    msgEl.className = 'msg error';
  }
  inputEl.classList.remove('shake');
  void inputEl.offsetWidth;
  inputEl.classList.add('shake');
  return false;
}

function bootLog(el, lines, speed) {
  if (!el) return Promise.resolve();
  speed = speed || 22;
  el.textContent = '';
  let i = 0;
  return new Promise(resolve => {
    function typeLine() {
      if (i >= lines.length) { resolve(); return; }
      const line = lines[i];
      let c = 0;
      const rowEl = document.createElement('div');
      el.appendChild(rowEl);
      const iv = setInterval(() => {
        rowEl.textContent = line.slice(0, c + 1);
        c++;
        if (c >= line.length) {
          clearInterval(iv);
          i++;
          setTimeout(typeLine, 120);
        }
      }, speed);
    }
    typeLine();
  });
}

function initMatrixRain() {
  const canvas = document.getElementById('matrixRain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = 'アイウエオカキクケコサシスセソ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let cols, drops, fontSize;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fontSize = 16;
    cols = Math.floor(canvas.width / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);

  let frameCount = 0;
  const FRAME_SKIP = 5;
  function draw() {
    frameCount++;
    if (frameCount % FRAME_SKIP === 0) {
      ctx.fillStyle = 'rgba(4, 8, 6, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff66';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', initMatrixRain);
