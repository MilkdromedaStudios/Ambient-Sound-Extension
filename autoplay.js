// Try multiple selectors — myNoise uses varying DOM structures.
const PLAY_SELECTORS = [
  "#playButton",
  ".playButton",
  ".buttonPlay",
  "canvas[onmouseover]",      // the canvas with play tooltip
  "canvas#tCanvas",           // commonly used canvas id
  "canvas",                   // fallback for canvas-only UIs
  "button[title*='Play']",
  "img[alt*='Play']",
  "[title*='Play']",
  "[aria-label*='Play']"
];

function simulateClick(el) {
  const rect = el.getBoundingClientRect();
  const x = Math.max(rect.left + rect.width / 2, 5);
  const y = Math.max(rect.top + rect.height / 2, 5);
  const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };

  el.dispatchEvent(new MouseEvent('pointerdown', opts));
  el.dispatchEvent(new MouseEvent('mousedown', opts));
  el.dispatchEvent(new MouseEvent('pointerup', opts));
  el.dispatchEvent(new MouseEvent('mouseup', opts));
  el.dispatchEvent(new MouseEvent('click', opts));
}

function tryPlayOnce() {
  for (const sel of PLAY_SELECTORS) {
    const el = document.querySelector(sel);
    if (el && el instanceof HTMLElement) {
      simulateClick(el);
      return true;
    }
  }
  return false;
}

function attemptPlayWithRetries(maxMs = 8000, intervalMs = 400) {
  const start = performance.now();
  const tick = () => {
    const ok = tryPlayOnce();
    if (ok) return;
    if (performance.now() - start < maxMs) {
      setTimeout(tick, intervalMs);
    }
  };
  tick();
}

// Some generators initialize after specific events — cover both
window.addEventListener('load', () => attemptPlayWithRetries(), { once: true });
document.addEventListener('DOMContentLoaded', () => attemptPlayWithRetries(), { once: true });

// Optional: try again on user interaction within page (in case first clicks didn’t bind yet)
document.addEventListener('mousemove', () => attemptPlayWithRetries(3000, 300), { once: true });
