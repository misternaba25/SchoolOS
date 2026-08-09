function animateCounter(el, value, duration = 600) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.round(start + (value - start) * progress);
    el.textContent = current.toLocaleString("fr-FR");
    if (progress < 1) requestfAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/**
 * Applique animateCounter à tous les éléments [data-counter] d'une page.
 * Exemple HTML : <p class="stat-card__value" data-counter="0">0</p>
 */
function initCounters() {
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = Number(el.dataset.counter || 0);
    animateCounter(el, target);
  });
}

document.addEventListener("DOMContentLoaded", initCounters);

