/**
 * app.js
 * ------------------------------------------------------------------
 * Utilitaires partagés par toutes les pages :
 *  - animation simple des compteurs (actuellement tous à 0)
 *  - helper pour brancher facilement un futur fetch() vers l'API
 *
 * NOTE BACKEND :
 * Toutes les données de ce front sont statiques / à zéro. Le dev backend
 * doit remplacer les fonctions "load*()" ci-dessous (et dans chaque
 * fichier pages/*.js) par de vrais appels fetch() vers l'API REST.
 * Un fichier `js/api.js` (voir ce fichier) centralise déjà les endpoints
 * attendus : il suffit de le compléter avec la vraie base URL.
 * ------------------------------------------------------------------
 */

/**
 * Anime un compteur de 0 jusqu'à `value`. Actuellement value = 0 partout,
 * donc cette fonction ne fait qu'afficher "0", mais elle est prête à
 * recevoir de vraies données une fois l'API branchée.
 */
function animateCounter(el, value, duration = 600) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.round(start + (value - start) * progress);
    el.textContent = current.toLocaleString("fr-FR");
    if (progress < 1) requestAnimationFrame(tick);
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
