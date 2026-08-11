/**
 * dashboard.js
 * ------------------------------------------------------------------
 * Initialise les 3 graphiques du tableau de bord avec Chart.js.
 * Toutes les séries sont actuellement à 0 (placeholder).
 *
 * NOTE BACKEND :
 *  - Évolution des inscriptions -> GET /api/dashboard/inscriptions-evolution
 *  - Répartition par classe     -> GET /api/dashboard/repartition-classes
 *  - Paiements mensuels         -> GET /api/dashboard/paiements-mensuels
 *  - Cartes statistiques + delta -> GET /api/dashboard/stats
 *  - Activité récente            -> GET /api/dashboard/activity
 * Il suffit de remplacer les tableaux ZERO_* ci-dessous par le résultat
 * des appels apiGet(API_ENDPOINTS.dashboard.xxx).
 * ------------------------------------------------------------------
 */

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const CLASS_LEVELS = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Tle"];

const ZERO_INSCRIPTIONS = MONTHS.map(() => 0);
const ZERO_REPARTITION = CLASS_LEVELS.map(() => 0);
const ZERO_PAIEMENTS = {
  labels: ["Frais de scolarité", "Cantine", "Transport", "Uniforme", "Examens"],
  values: [0, 0, 0, 0, 0],
  colors: ["#7c3aed", "#3b82f6", "#17b26a", "#f59e0b", "#ef4444"],
};

const CHART_DEFAULTS = {
  plugins: { legend: { display: false } },
  responsive: true,
  maintainAspectRatio: false,
};

function initInscriptionsChart() {
  const ctx = document.getElementById("inscriptionsChart");
  if (!ctx || typeof Chart === "undefined") return;

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: MONTHS.slice(0, 7),
      datasets: [
        {
          data: ZERO_INSCRIPTIONS.slice(0, 7),
          borderColor: "#7c3aed",
          backgroundColor: "rgba(124,58,237,0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#7c3aed",
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        y: { beginAtZero: true, suggestedMax: 10, grid: { color: "#eee" } },
        x: { grid: { display: false } },
      },
    },
  });
}

function initRepartitionChart() {
  const ctx = document.getElementById("repartitionChart");
  if (!ctx || typeof Chart === "undefined") return;

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: CLASS_LEVELS,
      datasets: [
        {
          data: ZERO_REPARTITION,
          backgroundColor: "#7c3aed",
          borderRadius: 6,
          maxBarThickness: 34,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        y: { beginAtZero: true, suggestedMax: 10, grid: { color: "#eee" } },
        x: { grid: { display: false } },
      },
    },
  });
}

function initPaiementsChart() {
  const ctx = document.getElementById("paiementsChart");
  if (!ctx || typeof Chart === "undefined") return;

  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ZERO_PAIEMENTS.labels,
      datasets: [
        {
          data: [1, 1, 1, 1, 1], // segments visuellement égaux tant qu'il n'y a pas de données réelles
          backgroundColor: ZERO_PAIEMENTS.colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      cutout: "72%",
    },
  });
}

let inscriptionsChartInstance = null;
let repartitionChartInstance = null;
let paiementsChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  inscriptionsChartInstance = initInscriptionsChart();
  repartitionChartInstance = initRepartitionChart();
  paiementsChartInstance = initPaiementsChart();

  loadDashboardStats();
  loadDashboardActivity();
  loadDashboardCharts();
  loadDashboardStudentsPreview();
  loadDashboardPaymentsPreview();

  const generateBtn = document.getElementById("generateReportBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      generateBtn.disabled = true;
      generateBtn.textContent = "Génération...";
      try {
        // TODO backend: POST /api/rapports/generer -> doit renvoyer une URL de téléchargement
        const result = await apiPost(API_ENDPOINTS.rapports.generate, {});
        if (result && result.download_url) window.open(result.download_url, "_blank");
      } catch (err) {
        alert("La génération de rapport nécessite que le backend soit branché.");
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "Générer un rapport 📄";
      }
    });
  }
});

/** Cartes statistiques du haut de page (élèves, professeurs, classes, paiements) */
async function loadDashboardStats() {
  try {
    const stats = await apiGet(API_ENDPOINTS.dashboard.stats);
    // stats attendu: { eleves, professeurs, classes, paiementsMois, deltas: {...} }
    const map = [
      { key: "eleves", suffix: "" },
      { key: "professeurs", suffix: "" },
      { key: "classes", suffix: "" },
      { key: "paiementsMois", suffix: " FCFA" },
    ];
    document.querySelectorAll(".stat-card__value").forEach((el, i) => {
      const item = map[i];
      if (!item || stats[item.key] === undefined) return;
      el.dataset.counter = stats[item.key];
      animateCounter(el, Number(stats[item.key]) || 0);
      if (item.suffix) {
        // ré-ajoute le suffixe (FCFA) après l'animation du compteur
        setTimeout(() => {
          el.textContent = `${Number(stats[item.key]).toLocaleString("fr-FR")}${item.suffix}`;
        }, 650);
      }
    });
  } catch (err) {
    console.warn("[dashboard] stats indisponibles:", err.message);
  }
}

/** Fil d'activité récente (colonne de droite) */
async function loadDashboardActivity() {
  const list = document.getElementById("activityList");
  if (!list) return;
  try {
    const activities = await apiGet(API_ENDPOINTS.dashboard.recentActivity);
    if (!Array.isArray(activities) || !activities.length) return; // garde l'état vide déjà en place

    list.innerHTML = activities
      .map(
        (a) => `
        <div class="activity-item">
          <span class="activity-item__time">${a.heure || ""}</span>
          <span class="activity-item__dot" style="background:${a.couleur || "#7c3aed"}"></span>
          <div class="activity-item__body">
            <strong>${a.titre}</strong>
            <span>${a.description || ""}</span>
          </div>
        </div>`
      )
      .join("");
  } catch (err) {
    console.warn("[dashboard] activité récente indisponible:", err.message);
  }
}

/** Les 3 graphiques Chart.js */
async function loadDashboardCharts() {
  try {
    const [inscriptions, repartition, paiements] = await Promise.all([
      apiGet(API_ENDPOINTS.dashboard.inscriptionsEvolution),
      apiGet(API_ENDPOINTS.dashboard.repartitionParClasse),
      apiGet(API_ENDPOINTS.dashboard.paiementsMensuels),
    ]);

    if (inscriptionsChartInstance && Array.isArray(inscriptions.values)) {
      inscriptionsChartInstance.data.labels = inscriptions.labels || MONTHS.slice(0, 7);
      inscriptionsChartInstance.data.datasets[0].data = inscriptions.values;
      inscriptionsChartInstance.update();
    }

    if (repartitionChartInstance && Array.isArray(repartition.values)) {
      repartitionChartInstance.data.labels = repartition.labels || CLASS_LEVELS;
      repartitionChartInstance.data.datasets[0].data = repartition.values;
      repartitionChartInstance.update();
    }

    if (paiementsChartInstance && Array.isArray(paiements.values)) {
      paiementsChartInstance.data.labels = paiements.labels || ZERO_PAIEMENTS.labels;
      paiementsChartInstance.data.datasets[0].data = paiements.values;
      paiementsChartInstance.update();
    }
  } catch (err) {
    console.warn("[dashboard] graphiques indisponibles:", err.message);
  }
}

/** Aperçu "Gestion des élèves" sur le dashboard */
async function loadDashboardStudentsPreview() {
  const tbody = document.getElementById("studentsTableBody");
  if (!tbody) return;
  const card = tbody.closest(".card");
  const emptyState = card ? card.querySelector("#studentsEmptyState") : null;

  try {
    const response = await apiGet(`${API_ENDPOINTS.eleves.list}?limit=5`);
    const items = Array.isArray(response) ? response : response.data || [];
    if (!items.length) return; // garde l'état vide déjà en place

    if (emptyState) emptyState.style.display = "none";
    tbody.innerHTML = items
      .map(
        (e) => `
      <tr>
        <td>${e.matricule || ""}</td>
        <td><div class="avatar-cell">👤</div></td>
        <td>${e.nom_complet || ""}</td>
        <td>${e.sexe || ""}</td>
        <td>${e.classe || ""}</td>
        <td>${e.parent || ""}</td>
        <td>${e.telephone || ""}</td>
        <td><span class="status-pill ${statusToPillClass(e.statut)}">${e.statut || ""}</span></td>
        <td class="row-actions">
          <button title="Voir">👁️</button>
          <button title="Modifier">✏️</button>
          <button title="Supprimer" data-action="delete" data-id="${e.id}">🗑️</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.warn("[dashboard] aperçu élèves indisponible:", err.message);
  }
}

/** Aperçu "Paiements récents" sur le dashboard */
async function loadDashboardPaymentsPreview() {
  const tbody = document.getElementById("paymentsTableBody");
  if (!tbody) return;
  const card = tbody.closest(".card");
  const emptyState = card ? card.querySelector("#paymentsEmptyState") : null;

  try {
    const response = await apiGet(API_ENDPOINTS.paiements.recent);
    const items = Array.isArray(response) ? response : response.data || [];
    if (!items.length) return; // garde l'état vide déjà en place

    if (emptyState) emptyState.style.display = "none";
    tbody.innerHTML = items
      .map(
        (p) => `
      <tr>
        <td>${p.eleve || ""}</td>
        <td>${p.type || ""}</td>
        <td>${Number(p.montant || 0).toLocaleString("fr-FR")} FCFA</td>
        <td><span class="status-pill ${statusToPillClass(p.statut)}">${p.statut || ""}</span></td>
        <td>${p.date || ""}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.warn("[dashboard] paiements récents indisponibles:", err.message);
  }
}

/** Convertit un statut texte (FR) en classe de pastille CSS */
function statusToPillClass(statut) {
  const s = (statut || "").toLowerCase();
  if (["actif", "payé", "présent", "publié"].includes(s)) return "success";
  if (["en attente", "impayé".replace("impayé", "en attente")].includes(s)) return "warning";
  if (["suspendu", "impayé", "absent", "annulé"].includes(s)) return "danger";
  return "neutral";
}
