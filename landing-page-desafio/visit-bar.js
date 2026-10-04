'use strict';

(() => {
  const bar = document.querySelector('.visit-bar');
  const timer = document.querySelector('.visit-timer');
  const storageKey = 'desafio-first-visit-at';
  const now = Date.now();
  let startedAt = now;
  let returningVisit = false;

  try {
    const saved = Number(window.localStorage.getItem(storageKey));
    if (Number.isFinite(saved) && saved > 0 && saved <= now) {
      startedAt = saved;
      returningVisit = true;
    } else {
      window.localStorage.setItem(storageKey, String(startedAt));
    }
  } catch {
    // Se o navegador bloquear o armazenamento, conta durante esta visita.
  }

  function updateTimer() {
    const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    timer.textContent = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
      .map(value => String(value).padStart(2, '0')).join(':');
  }

  function updateSpace() {
    if (!bar.hidden) {
      document.documentElement.style.setProperty('--visit-bar-height', `${bar.getBoundingClientRect().height}px`);
    }
  }

  function showBar() {
    updateTimer();
    bar.hidden = false;
    updateSpace();
  }

  updateTimer();
  setInterval(updateTimer, 1000);
  if (returningVisit) showBar();
  else setTimeout(showBar, 10000);

  window.addEventListener('resize', updateSpace);
  window.addEventListener('pageshow', updateTimer);
  document.addEventListener('visibilitychange', updateTimer);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(updateSpace).observe(bar);
})();
