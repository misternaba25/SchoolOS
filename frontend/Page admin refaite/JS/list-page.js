/**
 * list-page.js
 * ------------------------------------------------------------------
 * Moteur générique utilisé par toutes les pages "liste" (élèves,
 * professeurs, parents, classes, matières, notes, absences, paiements,
 * utilisateurs...).
 *
 * Chaque page définit un objet `window.PAGE_CONFIG` (voir le <script>
 * en bas de chaque fichier pages/*.html) puis appelle :
 *   document.addEventListener("DOMContentLoaded", () => initListPage(PAGE_CONFIG));
 *
 * Ce fichier se charge de :
 *  1. Appeler l'API pour récupérer la liste (avec repli silencieux sur
 *     l'état vide déjà présent dans le HTML si l'API n'est pas dispo)
 *  2. Remplir le <tbody>, cacher/afficher le message "Aucune donnée"
 *  3. Mettre à jour le total en bas du tableau (pagination)
 *  4. Mettre à jour les cartes statistiques en haut de page (si l'API
 *     renvoie un objet "stats")
 *  5. Ouvrir la modale de création quand on clique sur le bouton "+ Ajouter..."
 *  6. Gérer la suppression d'une ligne (bouton 🗑️ avec data-action="delete")
 * ------------------------------------------------------------------
 */

async function initListPage(config) {
  const tbody = document.getElementById(config.tbodyId);
  if (!tbody) return; // page sans tableau (ex: annonces, rapports) -> rien à faire ici

  const card = tbody.closest(".card");
  const emptyState = card ? card.querySelector(".empty-state") : null;
  const paginationSpan = card ? card.querySelector(".table-pagination span") : null;

  wireAddButton(config);
  await loadListData(config, tbody, emptyState, paginationSpan);
}

function wireAddButton(config) {
  if (!config.addButtonId || !config.formFields) return;
  const btn = document.getElementById(config.addButtonId);
  if (!btn) return;

  btn.addEventListener("click", () => {
    openModal({
      title: config.modalTitle || "Ajouter",
      fields: config.formFields,
      onSubmit: async (values) => {
        // TODO backend: adapter le payload envoyé si l'API attend un format différent
        await apiPost(config.createEndpoint, values);
        const tbody = document.getElementById(config.tbodyId);
        const card = tbody.closest(".card");
        const emptyState = card ? card.querySelector(".empty-state") : null;
        const paginationSpan = card ? card.querySelector(".table-pagination span") : null;
        await loadListData(config, tbody, emptyState, paginationSpan);
      },
    });
  });
}

async function loadListData(config, tbody, emptyState, paginationSpan) {
  try {
    const response = await apiGet(config.listEndpoint);
    // Formats acceptés : tableau brut, ou { data: [...], total, stats }
    const items = Array.isArray(response) ? response : response.data || [];
    const total = Array.isArray(response) ? items.length : response.total ?? items.length;

    if (!items.length) {
      showEmpty(tbody, emptyState);
    } else {
      tbody.innerHTML = items.map((item) => config.rowTemplate(item)).join("");
      if (emptyState) emptyState.style.display = "none";
      wireRowActions(tbody, config);
    }

    if (paginationSpan) {
      paginationSpan.textContent = `${total} ${config.countLabel || "élément(s)"} au total`;
    }

    if (config.statsKeys && response.stats) {
      applyStatCards(config.statsKeys, response.stats);
    }
  } catch (err) {
    // Le backend n'est pas encore branché (ou l'appel a échoué) :
    // on reste sagement sur l'état vide déjà présent dans le HTML.
    console.warn(`[${config.pageName || config.listEndpoint}] API indisponible :`, err.message);
    showEmpty(tbody, emptyState);
  }
}

function showEmpty(tbody, emptyState) {
  tbody.innerHTML = "";
  if (emptyState) emptyState.style.display = "flex";
}

function applyStatCards(keys, stats) {
  const cards = document.querySelectorAll(".stat-card__value");
  cards.forEach((el, index) => {
    const key = keys[index];
    if (key && stats[key] !== undefined) {
      el.dataset.counter = stats[key];
      animateCounter(el, Number(stats[key]) || 0);
    }
  });
}

function wireRowActions(tbody, config) {
  tbody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Confirmer la suppression ? Cette action est irréversible.")) return;
      try {
        await apiDelete(config.deleteEndpoint(id));
        btn.closest("tr").remove();
      } catch (err) {
        alert(err.message || "Suppression impossible.");
      }
    });
  });

  // Les boutons "voir" (👁️) et "modifier" (✏️) sont prêts pour être branchés
  // sur une page de détail / une modale d'édition dès que le backend expose
  // les routes GET/PUT correspondantes (voir config.detailEndpoint / updateEndpoint).
}
