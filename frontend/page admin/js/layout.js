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
        <div class="sidebar-brand__logo">
          <img src="../img/logo.png alt="SchoolOS">  
          </div>
        <div class="sidebar-brand__text">
          <strong>SchoolOS</strong>
          <span>ERP Scolaire</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>${navHtml}</ul>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-footer__school">
          <div class="badge">🏫</div>
          <div>
            <strong>Aucun établissement</strong>
            <!-- TODO backend: GET /api/etablissements/actif -->
          </div>
        </div>
        <div class="sidebar-footer__year">
          Année scolaire
          <br />
          <b id="activeYearLabel">— — — —</b>
          <!-- TODO backend: GET /api/annees-scolaires/active -->
          <button type="button" id="changeYearBtn">Changer d'année</button>
        </div>
      </div>
    </aside>
  `;
}

function renderTopbar(isRootPage) {
  const logopath=isRootPage ? "assets/img/logo.png": "../assets/img/logo.png" 
  return `
   
    <div class="topbar__brand">
     <img src="${logopath}"  class="topbar__logo" />
     <span>SchoolOS</span>
    </div>

      <div class="topbar__search">
        <span>🔎</span>
        <input type="text" placeholder="Rechercher un élève, un professeur..." id="globalSearchInput" /><br>
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
  if (topbarRoot) topbarRoot.innerHTML = renderTopbar(isRootPage);

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

  const changeYearBtn = document.getElementById("changeYearBtn");
  if (changeYearBtn) {
    changeYearBtn.addEventListener("click", () => {
      // TODO backend: ouvrir un sélecteur relié à GET /api/annees-scolaires
      alert("Aucune année scolaire chargée. Branchez l'API pour lister les années disponibles.");
    });
  }
}

document.addEventListener("DOMContentLoaded", initLayout);

