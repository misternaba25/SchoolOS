## Où brancher le backend

Tout est centralisé dans **`js/api.js`** :

- `API_BASE_URL` : à renseigner (ex: `https://api.schoolos.cm/api`).
- `API_ENDPOINTS` : la carte de toutes les routes attendues par le frontend
  (élèves, professeurs, classes, notes, absences, paiements, bulletins,
  annonces, utilisateurs, paramètres, dashboard...).
- `apiGet / apiPost / apiPut / apiDelete` : helpers `fetch()` prêts à
  l'emploi, avec gestion du header `Authorization: Bearer <token>`
  (le token est lu depuis `localStorage.getItem("schoolos_token")`,
  à adapter selon la stratégie d'authentification choisie).

Chaque page/section importante contient aussi des commentaires
`<!-- TODO backend: ... -->` ou `// TODO backend: ...` directement au-dessus
de l'élément concerné (compteur, tableau, graphique), indiquant :

- la route API à appeler,
- ce que la réponse doit contenir,
- où injecter les données dans le DOM.

### Exemples de routes attendues (voir `js/api.js` pour la liste complète)

| Fonctionnalité                  | Méthode | Route                              |
|----------------------------------|---------|-------------------------------------|
| Statistiques du tableau de bord  | GET     | `/dashboard/stats`                  |
| Activité récente                 | GET     | `/dashboard/activity`               |
| Liste des élèves                 | GET     | `/eleves`                            |
| Créer un élève                   | POST    | `/eleves`                            |
| Importer des élèves (Excel)      | POST    | `/eleves/import`                    |
| Liste des professeurs            | GET     | `/professeurs`                       |
| Liste des classes                | GET     | `/classes`                           |
| Notes d'un élève / d'une classe  | GET     | `/notes`                             |
| Absences                         | GET     | `/absences`                          |
| Paiements récents                | GET     | `/paiements/recents`                |
| Générer un bulletin              | POST    | `/bulletins/generer`                |
| Paramètres de l'établissement    | GET/PUT | `/parametres`                        |

## Points d'intégration à ne pas oublier

- **Tableaux vides** : chaque page a un `<tbody id="...TableBody">` vide et un
  bloc `.empty-state` affiché par défaut. Quand des données arrivent de
  l'API, il faut générer les lignes `<tr>` en JS et masquer `.empty-state`.
- **Compteurs** : les éléments `data-counter="0"` (cartes statistiques) sont
  animés par `initCounters()` dans `js/app.js`. Il suffit de mettre à jour
  l'attribut `data-counter` avec la vraie valeur avant l'appel (ou de
  ré-exécuter `animateCounter()` après le fetch).
- **Graphiques** (`js/dashboard.js`) : remplacer les tableaux `ZERO_*` par les
  données réelles renvoyées par l'API, aux endroits indiqués en commentaire.
- **Authentification** : aucune page de connexion n'est incluse ici — à
  créer côté backend/frontend selon le système d'auth retenu (session,
  JWT...). `js/api.js` est déjà prêt à envoyer un token Bearer.
- **Notifications / messages** : badges `#notifCount` et `#msgCount` dans la
  topbar (`js/layout.js`) à connecter à `/notifications/count` et
  `/messages/unread-count`.
