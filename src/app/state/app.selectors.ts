import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppStateModel } from './models';

export const selectApp = createFeatureSelector<AppStateModel>('app');

export const selectCity = createSelector(selectApp, (s) => s.city);
export const selectRestaurants = createSelector(
  selectApp,
  (s) => s.restaurants
);
export const selectSelectedRestaurant = createSelector(
  selectApp,
  (s) => s.selectedRestaurant
);
export const selectLoading = createSelector(selectApp, (s) => s.loading);
export const selectError = createSelector(selectApp, (s) => s.error);

export const selectCitySuggestions = createSelector(
  selectApp,
  (s) => s.citySuggestions
);

//! Syntaxe clé
// Un selector est une "fenêtre" sur le Store : il lit une partie du state, de façon mémoïsée.
// createFeatureSelector<AppStateModel>('app') : pointe sur la "slice" 'app' du Store
// createSelector(selectApp, s => s.restaurants) : renvoie uniquement la liste des restaurants
// Avantage : composants + lisibles, pas de logique d'accès au state dans l'UI,
// et recalcul uniquement si la portion du state change.
