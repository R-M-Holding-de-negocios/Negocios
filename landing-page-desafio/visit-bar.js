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

  let previousTime = '';
  let digits = [];

  function renderTime(time) {
    timer.setAttribute('aria-label', time);
    if (time.length !== previousTime.length) {
      digits = Array.from(time, character => {
        const cell = document.createElement('span');
        cell.setAttribute('aria-hidden', 'true');
        if (character === ':') {
          cell.className = 'visit-timer-separator';
          cell.textContent = ':';
          return { cell };
        }
        cell.className = 'visit-timer-digit';
        const strip = document.createElement('span');
        strip.className = 'visit-timer-strip';
        for (let number = 0; number <= 10; number++) {
          const digit = document.createElement('span');
          digit.textContent = String(number % 10);
          strip.append(digit);
        }
        strip.style.transform = `translateY(${-Number(character)}em)`;
        cell.append(strip);
        return { cell, strip };
      });
      timer.replaceChildren(...digits.map(digit => digit.cell));
    } else {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      digits.forEach(({ strip }, index) => {
        if (!strip || time[index] === previousTime[index]) return;
        const oldValue = Number(previousTime[index]);
        const value = Number(time[index]);
        strip.style.transform = `translateY(${-value}em)`;
        if (!reducedMotion && !bar.hidden && typeof strip.animate === 'function') {
          strip.animate([
            { transform: `translateY(-${oldValue}em)` },
            { transform: `translateY(-${oldValue === 9 && value === 0 ? 10 : value}em)` }
          ], { duration: 550, easing: 'cubic-bezier(.22, 1, .36, 1)' });
        }
      });
    }
    previousTime = time;
  }

  function updateTimer() {
    const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    renderTime([Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
      .map(value => String(value).padStart(2, '0')).join(':'));
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
