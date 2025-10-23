# McDonald Map – Application Angular

## Prérequis

| Package                    | Version | Rôle                           |
| -------------------------- | ------- | ------------------------------ |
| `@angular/core` et modules | 20.1.0  | Framework Angular              |
| `@ngrx/store` / `effects`  | 20.0.1  | Gestion d’état réactive        |
| `@bluehalo/ngx-leaflet`    | 20.0.0  | Composant Leaflet pour Angular |
| `leaflet`                  | 1.9.4   | Carte interactive              |
| `rxjs`                     | 7.8.x   | Programmation réactive         |
| `zone.js`                  | 0.15.x  | Cycle de détection Angular     |

---

## Récupération du projet

### Cloner le dépôt

```bash
git clone <URL-DU-REPO>
cd <NOM-DU-PROJET>
```

### Installer les dépendances

```bash
npm install
```

---

## Lancer l’application en local

```bash
ng serve
```

Ouvrir un navigateur et se rendre sur :

```
http://localhost:4200
```

---

## Fonctionnalités principales

### Recherche de restaurants McDonald’s

- Le composant `SearchBar` permet à l’utilisateur de saisir une ville.
- Appel à l’API **Nominatim** pour récupérer les suggestions.
- La sélection d’une ville met à jour le **Store NgRx**.

### Carte interactive

- Composant `Map` utilisant **ngx-leaflet**.
- Affiche les marqueurs des restaurants provenant du Store.
- Les popups des marqueurs incluent un bouton “Choisir” → sélection du restaurant et mise à jour du composant `Infospanel`.

### Infospanel

- Affiche les informations du restaurant sélectionné.
- Les boutons “Continuer” / “Annuler” déclenchent des actions dans le Store.

### Gestion d’état

- **NgRx** : cycle complet Actions → Effects → Reducer → Selectors → Composants.
- Utilisation des API réactives modernes d’Angular (`signal()` / `toSignal()`).
- Gestion des états de chargement et des erreurs pour assurer un comportement fiable.

---

## Points techniques clés

| Fonctionnalité  | Description                                                           |
| --------------- | --------------------------------------------------------------------- |
| Angular moderne | Composants standalone, `signal()` / `toSignal()`, architecture claire |
| NgRx maîtrisé   | Cycle complet, gestion asynchrone et gestion des erreurs              |
| API externe     | Nominatim pour la géolocalisation, Leaflet pour la carte              |
| Débogage        | Redux DevTools et console Angular pour inspecter l’état du Store      |
| Extensibilité   | Possibilité d’ajouter facilement des fonctionnalités ou un backend    |

---

## Déploiement

L’application est accessible en ligne :

[https://test-2c7a9.web.app](https://test-2c7a9.web.app)
