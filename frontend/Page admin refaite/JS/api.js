/**
 * api.js
 * ------------------------------------------------------------------
 * Point d'entrée UNIQUE pour brancher le backend.
 * Le développeur backend n'a normalement qu'à :
 *   1. Renseigner API_BASE_URL
 *   2. Implémenter les routes listées dans API_ENDPOINTS côté serveur
 *   3. Remplacer les données statiques de chaque page/*.js par des
 *      appels à apiGet()/apiPost()/apiPut()/apiDelete() définis ici.
 *
 * Rien de ceci n'est encore utilisé par les pages (elles affichent
 * uniquement des zéros / listes vides pour l'instant), c'est une
 * base prête à l'emploi.
 * ------------------------------------------------------------------
 */

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
    update: (id) => `/professeurs/${id}`,
    delete: (id) => `/professeurs/${id}`,
  },
  parents: {
    list: "/parents",
    create: "/parents",
    detail: (id) => `/parents/${id}`,
    update: (id) => `/parents/${id}`,
    delete: (id) => `/parents/${id}`,
  },
  classes: {
    list: "/classes",
    create: "/classes",
    detail: (id) => `/classes/${id}`,
    update: (id) => `/classes/${id}`,
    delete: (id) => `/classes/${id}`,
  },
  matieres: {
    list: "/matieres",
    create: "/matieres",
    detail: (id) => `/matieres/${id}`,
    update: (id) => `/matieres/${id}`,
    delete: (id) => `/matieres/${id}`,
  },
  notes: {
    list: "/notes",
    create: "/notes",
    detail: (id) => `/notes/${id}`,
    update: (id) => `/notes/${id}`,
    delete: (id) => `/notes/${id}`,
  },
  absences: {
    list: "/absences",
    create: "/absences",
    detail: (id) => `/absences/${id}`,
    update: (id) => `/absences/${id}`,
    delete: (id) => `/absences/${id}`,
  },
  emploiDuTemps: {
    list: "/emploi-du-temps",
    create: "/emploi-du-temps",
    delete: (id) => `/emploi-du-temps/${id}`,
  },
  paiements: {
    list: "/paiements",
    create: "/paiements",
    recent: "/paiements/recents",
    detail: (id) => `/paiements/${id}`,
    update: (id) => `/paiements/${id}`,
    delete: (id) => `/paiements/${id}`,
    exportPdf: "/paiements/export",
  },
  bulletins: {
    list: "/bulletins",
    generate: "/bulletins/generer",
    detail: (id) => `/bulletins/${id}`,
  },
  annonces: {
    list: "/annonces",
    create: "/annonces",
    detail: (id) => `/annonces/${id}`,
    delete: (id) => `/annonces/${id}`,
  },
  rapports: {
    summary: "/rapports/synthese",
    generate: "/rapports/generer",
  },
  utilisateurs: {
    list: "/utilisateurs",
    create: "/utilisateurs",
    detail: (id) => `/utilisateurs/${id}`,
    update: (id) => `/utilisateurs/${id}`,
    delete: (id) => `/utilisateurs/${id}`,
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
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    // Session expirée / non authentifié -> retour à l'écran de connexion
    localStorage.removeItem("schoolos_token");
    // TODO backend: adapter si la stratégie d'auth n'est pas basée sur un token Bearer
    if (!location.pathname.endsWith("login.html")) {
      const inPagesFolder = location.pathname.includes("/pages/");
      window.location.href = inPagesFolder ? "../login.html" : "login.html";
    }
    throw new Error("Non authentifié");
  }

  if (!response.ok) {
    let message = `Erreur API (${response.status}) sur ${path}`;
    try {
      const errBody = await response.json();
      if (errBody && errBody.message) message = errBody.message;
    } catch (_) {
      /* la réponse d'erreur n'était pas du JSON, on garde le message par défaut */
    }
    throw new Error(message);
  }

  if (response.status === 204) return null; // pas de contenu (ex: DELETE réussi)
  return response.json();
}

const apiGet = (path) => apiRequest(path, { method: "GET" });
const apiPost = (path, body) =>
  apiRequest(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) });
const apiPut = (path, body) =>
  apiRequest(path, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) });
const apiDelete = (path) => apiRequest(path, { method: "DELETE" });
