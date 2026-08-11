/**
 * layout.js
 * ------------------------------------------------------------------
 * Construit la sidebar + la topbar communes à toutes les pages.
 * Chaque page HTML doit simplement :
 *   1. avoir un <div id="sidebar-root"></div> et <div id="topbar-root"></div>
 *   2. définir window.CURRENT_PAGE = "eleves" (ou autre id) avant d'inclure ce script
 *
 * NOTE BACKEND :
 * Toutes les valeurs affichées ici (compteurs de notifications, messages,
 * nom de l'utilisateur connecté, année scolaire active) sont des valeurs
 * à 0 / placeholders. À brancher sur :
 *   - GET /api/auth/me                -> infos utilisateur connecté
 *   - GET /api/notifications/count    -> badge cloche
 *   - GET /api/messages/unread-count  -> badge messages
 *   - GET /api/annees-scolaires/active -> année scolaire courante
 * ------------------------------------------------------------------
 */

const NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord", href: "index.html", icon: "🏠" },
  { id: "eleves", label: "Élèves", href: "pages/eleves.html", icon: "🎓" },
  { id: "professeurs", label: "Professeurs", href: "pages/professeurs.html", icon: "🧑‍🏫" },
  { id: "parents", label: "Parents", href: "pages/parents.html", icon: "👪" },
  { id: "classes", label: "Classes", href: "pages/classes.html", icon: "🏫" },
  { id: "matieres", label: "Matières", href: "pages/matieres.html", icon: "📘" },
  { id: "notes", label: "Notes", href: "pages/notes.html", icon: "📝" },
  { id: "absences", label: "Absences", href: "pages/absences.html", icon: "❌" },
  { id: "emploi-du-temps", label: "Emploi du temps", href: "pages/emploi-du-temps.html", icon: "🗓️" },
  { id: "paiements", label: "Paiements", href: "pages/paiements.html", icon: "💰" },
  { id: "bulletins", label: "Bulletins", href: "pages/bulletins.html", icon: "📄" },
  { id: "annonces", label: "Annonces", href: "pages/annonces.html", icon: "📣" },
  { id: "rapports", label: "Rapports & Statistiques", href: "pages/rapports.html", icon: "📊" },
  { id: "utilisateurs", label: "Utilisateurs", href: "pages/utilisateurs.html", icon: "👤" },
  { id: "parametres", label: "Paramètres", href: "pages/parametres.html", icon: "⚙️" },
];

/**
 * Comme les pages internes vivent dans /pages/, les liens du menu doivent
 * être relatifs à la racine ("../index.html") quand on n'est pas déjà
 * sur le tableau de bord. On corrige ça dynamiquement ici.
 */
function resolveHref(href, isRootPage) {
  if (isRootPage) return href;
  if (href === "index.html") return "../index.html";
  return href.replace("pages/", "");
}

function renderSidebar(activePage, isRootPage) {
  const navHtml = NAV_ITEMS.map((item) => {
    const active = item.id === activePage ? "is-active" : "";
    return `
      <li>
        <a href="${resolveHref(item.href, isRootPage)}" class="${active}">
          <span class="icon">${item.icon}</span>
          <span>${item.label}</span>
        </a>
      </li>`;
  }).join("");

  return `
    <aside class="sidebar" id="mainSidebar">
      <div class="sidebar-brand">
        <div class="sidebar-brand__logo">🛡️</div>
        <div class="sidebar-brand__text">
          <strong>SchoolOS</strong>
          <span>ERP Scolaire</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>${navHtml}</ul>
        <ul>
          <li>
            <a href="#" id="logoutLink">
              <span class="icon">🚪</span>
              <span>Déconnexion</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-footer__school">
          <div class="badge" id="schoolLogoBadge">🏫</div>
          <div>
            <strong id="schoolNameLabel">Aucun établissement</strong>
            <!-- Rempli par GET /api/etablissements/actif, voir loadSchoolInfo() -->
          </div>
        </div>
        <div class="sidebar-footer__year">
          Année scolaire
          <br />
          <b id="activeYearLabel">— — — —</b>
          <!-- Rempli par GET /api/annees-scolaires/active, voir loadActiveYear() -->
          <button type="button" id="changeYearBtn">Changer d'année</button>
        </div>
      </div>
    </aside>
  `;
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="topbar__left">
        <button class="topbar__menu-btn" id="sidebarToggle" aria-label="Ouvrir le menu">☰</button>
        <div class="topbar__brand">
          <span>🛡️</span>
          <span>SchoolOS</span>
        </div>
      </div>

      <div class="topbar__search">
        <span>🔎</span>
        <input type="text" placeholder="Rechercher un élève, un professeur..." id="globalSearchInput" />
        <!-- TODO backend: GET /api/search?q= -->
      </div>

      <div class="topbar__right">
        <button class="icon-btn" id="notifBtn" title="Notifications">
          🔔
          <span class="badge-count" id="notifCount">0</span>
          <!-- TODO backend: GET /api/notifications/count -->
        </button>
        <button class="icon-btn" id="msgBtn" title="Messages">
          💬
          <span class="badge-count" id="msgCount">0</span>
          <!-- TODO backend: GET /api/messages/unread-count -->
        </button>
        <button class="icon-btn" id="themeToggle" title="Mode sombre">🌙</button>

        <div class="topbar__user">
          <div class="avatar-fallback" id="userAvatar">--</div>
          <!-- TODO backend: afficher photo de profil si disponible (GET /api/auth/me) -->
          <div>
            <strong id="userName">Utilisateur</strong>
            <span id="userEmail">non-connecte@schoolos.com</span>
          </div>
          <span>⌄</span>
        </div>
      </div>
    </header>
  `;
}

function initLayout() {
  const sidebarRoot = document.getElementById("sidebar-root");
  const topbarRoot = document.getElementById("topbar-root");
  const isRootPage = document.body.dataset.root === "true";
  const activePage = window.CURRENT_PAGE || "dashboard";

  if (sidebarRoot) sidebarRoot.innerHTML = renderSidebar(activePage, isRootPage);
  if (topbarRoot) topbarRoot.innerHTML = renderTopbar();

  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebarEl = document.getElementById("mainSidebar");
  if (toggleBtn && sidebarEl) {
    toggleBtn.addEventListener("click", () => sidebarEl.classList.toggle("is-open"));
  }

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("theme-dark");
      // TODO: persister la préférence utilisateur (localStorage ou API profil)
    });
  }

  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof logout === "function") {
        logout(); // défini dans js/auth.js, inclus sur chaque page
      } else {
        window.location.href = isRootPage ? "login.html" : "../login.html";
      }
    });
  }

  const changeYearBtn = document.getElementById("changeYearBtn");
  if (changeYearBtn) {
    changeYearBtn.addEventListener("click", () => {
      // TODO backend/produit: remplacer par un vrai sélecteur relié à
      // GET /api/annees-scolaires (liste) + POST /api/annees-scolaires/activer
      alert("Aucune année scolaire chargée. Branchez l'API pour lister les années disponibles.");
    });
  }

  // Tout ce qui suit se connecte à l'API réelle. Si le backend n'est pas
  // encore disponible, chaque appel échoue silencieusement et l'interface
  // garde ses valeurs par défaut (0, "Aucun établissement", etc.).
  loadCurrentUser();
  loadNotificationCounts();
  loadSchoolInfo();
  loadActiveYear();
  wireGlobalSearch();
}

async function loadCurrentUser() {
  try {
    const user = await apiGet(API_ENDPOINTS.auth.me);
    const nameEl = document.getElementById("userName");
    const emailEl = document.getElementById("userEmail");
    const avatarEl = document.getElementById("userAvatar");
    if (nameEl) nameEl.textContent = user.nom || user.name || "Utilisateur";
    if (emailEl) emailEl.textContent = user.email || "";
    if (avatarEl) {
      if (user.photo_url) {
        avatarEl.outerHTML = `<img src="${user.photo_url}" alt="${user.nom || ""}" id="userAvatar" />`;
      } else {
        const initials = (user.nom || user.name || "U").trim().slice(0, 2).toUpperCase();
        avatarEl.textContent = initials;
      }
    }
  } catch (err) {
    // Pas encore connecté / backend indisponible -> on garde "Utilisateur" par défaut
    console.warn("[layout] impossible de charger l'utilisateur connecté:", err.message);
  }
}

async function loadNotificationCounts() {
  try {
    const [notif, msg] = await Promise.all([
      apiGet(API_ENDPOINTS.notifications.count),
      apiGet(API_ENDPOINTS.messages.unreadCount),
    ]);
    const notifEl = document.getElementById("notifCount");
    const msgEl = document.getElementById("msgCount");
    if (notifEl) notifEl.textContent = notif.count ?? 0;
    if (msgEl) msgEl.textContent = msg.count ?? 0;
  } catch (err) {
    console.warn("[layout] compteurs notifications/messages indisponibles:", err.message);
  }
}

async function loadSchoolInfo() {
  try {
    const school = await apiGet(API_ENDPOINTS.parametres.get);
    const nameEl = document.getElementById("schoolNameLabel");
    const badgeEl = document.getElementById("schoolLogoBadge");
    if (nameEl && school.nom) nameEl.textContent = school.nom;
    if (badgeEl && school.logo_url) {
      badgeEl.innerHTML = `<img src="${school.logo_url}" alt="${school.nom || "Logo"}" style="width:100%;height:100%;border-radius:8px;object-fit:cover;" />`;
    }
  } catch (err) {
    console.warn("[layout] informations établissement indisponibles:", err.message);
  }
}

async function loadActiveYear() {
  try {
    const year = await apiGet(API_ENDPOINTS.anneesScolaires.active);
    const yearEl = document.getElementById("activeYearLabel");
    if (yearEl && year.libelle) yearEl.textContent = year.libelle;
  } catch (err) {
    console.warn("[layout] année scolaire active indisponible:", err.message);
  }
}

function wireGlobalSearch() {
  const input = document.getElementById("globalSearchInput");
  if (!input) return;
  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (!query) return;
    debounceTimer = setTimeout(async () => {
      try {
        // TODO backend: GET /api/search?q=... -> afficher les résultats
        // (élèves, professeurs, classes...) dans un menu déroulant sous la barre.
        await apiGet(`/search?q=${encodeURIComponent(query)}`);
      } catch (err) {
        console.warn("[layout] recherche indisponible:", err.message);
      }
    }, 350);
  });
}

document.addEventListener("DOMContentLoaded", initLayout);
