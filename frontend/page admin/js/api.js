const API_BASE_URL = "http://localhost:8000/api"; // TODO backend: adapter selon l'environnement

const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  dashboard: {
    stats: "/dashboard/stats", // eleves, professeurs, classes, paiements du mois
    recentActivity: "/dashboard/activity",
    inscriptionsEvolution: "/dashboard/inscriptions-evolution",
    repartitionParClasse: "/dashboard/repartition-classes",
    paiementsMensuels: "/dashboard/paiements-mensuels",
  },
  eleves: {
    list: "/eleves",
    create: "/eleves",
    detail: (id) => `/eleves/${id}`,
    update: (id) => `/eleves/${id}`,
    delete: (id) => `/eleves/${id}`,
    importExcel: "/eleves/import",
    exportPdf: "/eleves/export",
  },
  professeurs: {
    list: "/professeurs",
    create: "/professeurs",
    detail: (id) => `/professeurs/${id}`,
  },
  parents: {
    list: "/parents",
    create: "/parents",
    detail: (id) => `/parents/${id}`,
  },
  classes: {
    list: "/classes",
    create: "/classes",
    detail: (id) => `/classes/${id}`,
  },
  matieres: {
    list: "/matieres",
    create: "/matieres",
  },
  notes: {
    list: "/notes",
    create: "/notes",
  },
  absences: {
    list: "/absences",
    create: "/absences",
  },
  emploiDuTemps: {
    list: "/emploi-du-temps",
  },
  paiements: {
    list: "/paiements",
    create: "/paiements",
    recent: "/paiements/recents",
  },
  bulletins: {
    list: "/bulletins",
    generate: "/bulletins/generer",
  },
  annonces: {
    list: "/annonces",
    create: "/annonces",
  },
  rapports: {
    summary: "/rapports/synthese",
  },
  utilisateurs: {
    list: "/utilisateurs",
    create: "/utilisateurs",
  },
  parametres: {
    get: "/parametres",
    update: "/parametres",
  },
  notifications: {
    count: "/notifications/count",
  },
  messages: {
    unreadCount: "/messages/unread-count",
  },
  anneesScolaires: {
    active: "/annees-scolaires/active",
    list: "/annees-scolaires",
  },
};

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("schoolos_token"); // TODO backend: définir la stratégie d'auth (JWT, session...)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur API (${response.status}) sur ${path}`);
  }
  return response.json();
}

const apiGet = (path) => apiRequest(path, { method: "GET" });
const apiPost = (path, body) => apiRequest(path, { method: "POST", body: JSON.stringify(body) });
const apiPut = (path, body) => apiRequest(path, { method: "PUT", body: JSON.stringify(body) });
const apiDelete = (path) => apiRequest(path, { method: "DELETE" });

