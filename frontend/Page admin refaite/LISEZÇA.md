
Frontend statique (HTML / CSS / JS vanilla + Chart.js) de l'application SchoolOS. Toutes les données affichées sont à zéro / vides : c'est un squelette prêt à être branché sur une API backend (Laravel, Node/Express, etc.).
Structure du projet

├── index.html                # Tableau de bord
├── pages/
│   ├── eleves.html
│   ├── professeurs.html
│   ├── parents.html
│   ├── classes.html
│   ├── matieres.html
│   ├── notes.html
│   ├── absences.html
│   ├── emploi-du-temps.html
│   ├── paiements.html
│   ├── bulletins.html
│   ├── annonces.html
│   ├── rapports.html
│   ├── utilisateurs.html
│   └── parametres.html
├── css/
│   └── style.css             # Design system (variables, cartes, tableaux, etc.)
├── js/
│   ├── layout.js             # Sidebar + topbar injectées sur toutes les pages
│   ├── api.js                # Config centrale des appels API (à compléter)
│   ├── app.js                # Utilitaires (compteurs animés, etc.)
│   └── dashboard.js          # Graphiques Chart.js du tableau de bord (zéro)
└── README.md
Comment ouvrir le projet
Ouvrir simplement index.html dans un navigateur, ou lancer un petit serveur statique depuis la racine du dossier (recommandé pour éviter les soucis CORS une fois l'API branchée) :
npx serve .
# ou
python3 -m http.server 5500
Comment fonctionne la mise en page
Toutes les pages partagent la même sidebar et la même barre du haut. Elles sont générées dynamiquement par js/layout.js (fonction initLayout()), à partir de la liste NAV_ITEMS. Chaque page :
contient <div id="sidebar-root"></div> et <div id="topbar-root"></div> ;
définit window.CURRENT_PAGE = "id-de-la-page" avant d'inclure layout.js, pour que le bon lien du menu soit surligné.
➡️ Pour ajouter une page : dupliquer un fichier dans pages/, l'ajouter à NAV_ITEMS dans js/layout.js.
⚡ Câblage déjà fait (mise à jour)
Le frontend n'est plus un simple squelette statique : tous les appels API sont déjà écrits, avec repli automatique sur l'état vide si le backend ne répond pas. Concrètement :
login.html + js/auth.js : formulaire de connexion fonctionnel, appelle POST /auth/login, stocke le token, redirige vers le dashboard. Le lien "Déconnexion" de la sidebar appelle POST /auth/logout puis nettoie le token.
js/api.js : si une requête renvoie 401, le token est effacé et l'utilisateur est automatiquement renvoyé vers login.html.
js/layout.js : au chargement de n'importe quelle page, la sidebar/topbar va chercher l'utilisateur connecté (/auth/me), les compteurs de notifications/messages, le logo + nom de l'établissement, et l'année scolaire active.
js/dashboard.js : le tableau de bord charge ses vraies statistiques, son activité récente, ses 3 graphiques et ses 2 aperçus de tableaux (élèves, paiements récents) via l'API.
js/list-page.js + js/modal.js : moteur générique utilisé par les pages élèves, professeurs, parents, classes, matières, notes, absences, paiements, utilisateurs et bulletins — chaque page définit juste un objet PAGE_CONFIG (endpoint, colonnes, champs du formulaire) en bas de son HTML, et tout le reste (chargement de la liste, bouton "+ Ajouter" → modale → POST, suppression → DELETE, mise à jour des compteurs) fonctionne automatiquement.
pages/parametres.html : formulaire des infos de l'établissement (avec upload du logo) câblé sur GET/PUT /api/parametres.
Tant que le backend n'existe pas, chaque appel échoue silencieusement (try/catch) et l'interface garde ses valeurs par défaut (0, listes vides, "Aucun établissement"...). Dès que le backend répond aux routes listées dans js/api.js, les données réelles s'affichent automatiquement, sans aucune autre modification côté frontend.
Ce qu'il reste à faire, concrètement
Renseigner API_BASE_URL dans js/api.js.
Implémenter côté serveur les routes de API_ENDPOINTS (même fichier) — en respectant si possible les formats de réponse suivants :
Listes : soit un tableau brut [...], soit { data: [...], total: 42, stats: { ... } }.
stats (optionnel) : un objet dont les clés correspondent à statsKeys défini dans le PAGE_CONFIG de chaque page (ex: { total: 1254, actifs: 1200, enAttente: 40, suspendus: 14 }), utilisé pour remplir les 4 cartes en haut de page dans l'ordre.
Décider de la stratégie d'authentification (JWT Bearer déjà géré, ou adapter apiRequest() pour des cookies de session).
Pour chaque <select> de formulaire actuellement vide (ex: "Classe" dans le formulaire élève), peupler options dans le PAGE_CONFIG correspondant avec un appel à l'API adéquate (ex: GET /api/classes).
Les boutons "Importer Excel" / "Exporter PDF" (#importExcelBtn, #exportPdfBtn, etc.) sont présents dans le HTML mais pas encore câblés — à connecter à API_ENDPOINTS.eleves.importExcel / exportPdf une fois ces routes prêtes côté serveur.
Où brancher le backend
Tout est centralisé dans js/api.js :
API_BASE_URL : à renseigner (ex: https://api.schoolos.cm/api).
API_ENDPOINTS : la carte de toutes les routes attendues par le frontend (élèves, professeurs, classes, notes, absences, paiements, bulletins, annonces, utilisateurs, paramètres, dashboard...).
apiGet / apiPost / apiPut / apiDelete : helpers fetch() prêts à l'emploi, avec gestion du header Authorization: Bearer <token> (le token est lu depuis localStorage.getItem("schoolos_token"), à adapter selon la stratégie d'authentification choisie).
Chaque page/section importante contient aussi des commentaires <!-- TODO backend: ... --> ou // TODO backend: ... directement au-dessus de l'élément concerné (compteur, tableau, graphique), indiquant :
la route API à appeler,
ce que la réponse doit contenir,
où injecter les données dans le DOM.
Exemples de routes attendues (voir js/api.js pour la liste complète)
Fonctionnalité
Méthode
Route
Statistiques du tableau de bord
GET
/dashboard/stats
Activité récente
GET
/dashboard/activity
Liste des élèves
GET
/eleves
Créer un élève
POST
/eleves
Importer des élèves (Excel)
POST
/eleves/import
Liste des professeurs
GET
/professeurs
Liste des classes
GET
/classes
Notes d'un élève / d'une classe
GET
/notes
Absences
GET
/absences
Paiements récents
GET
/paiements/recents
Générer un bulletin
POST
/bulletins/generer
Paramètres de l'établissement
GET/PUT
/parametres
Points d'intégration à ne pas oublier
Tableaux vides : chaque page a un <tbody id="...TableBody"> vide et un bloc .empty-state affiché par défaut. Quand des données arrivent de l'API, il faut générer les lignes <tr> en JS et masquer .empty-state.
Compteurs : les éléments data-counter="0" (cartes statistiques) sont animés par initCounters() dans js/app.js. Il suffit de mettre à jour l'attribut data-counter avec la vraie valeur avant l'appel (ou de ré-exécuter animateCounter() après le fetch).
Graphiques (js/dashboard.js) : remplacer les tableaux ZERO_* par les données réelles renvoyées par l'API, aux endroits indiqués en commentaire.
Authentification : aucune page de connexion n'est incluse ici — à créer côté backend/frontend selon le système d'auth retenu (session, JWT...). js/api.js est déjà prêt à envoyer un token Bearer.
Notifications / messages : badges #notifCount et #msgCount dans la topbar (js/layout.js) à connecter à /notifications/count et /messages/unread-count.
Design
Thème violet en dégradé (sidebar), cohérent avec l'identité visuelle SchoolOS existante.
Variables de couleurs, rayons et ombres centralisées dans css/style.css (:root), pour permettre une customisation rapide (thème clair/sombre, marque blanche, etc.).
Responsive : la sidebar se replie sur mobile/tablette (bouton ☰ dans la topbar).
