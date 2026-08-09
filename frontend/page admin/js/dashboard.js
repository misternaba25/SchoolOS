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

  new Chart(ctx, {
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

  new Chart(ctx, {
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

  new Chart(ctx, {
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

document.addEventListener("DOMContentLoaded", () => {
  initInscriptionsChart();
  initRepartitionChart();
  initPaiementsChart();
});

