import { createReducer, on } from '@ngrx/store';
import * as AppActions from './app.actions';
import { AppStateModel } from './models';

export const initialState: AppStateModel = {
  city: null,
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
  citySuggestions: [],
};

export const appReducer = createReducer(
  initialState,

  // villes
  on(AppActions.setCity, (state, { city }) => ({
    ...state,
    city,
    selectedRestaurant: null,
    error: null,
  })),
  on(AppActions.clearCity, (state) => ({
    ...state,
    city: null,
    restaurants: [],
    selectedRestaurant: null,
  })),

  // suggestions
  on(AppActions.suggestCities, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AppActions.suggestCitiesSuccess, (state, { cities }) => ({
    ...state,
    loading: false,
    citySuggestions: cities,
  })),
  on(AppActions.suggestCitiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    citySuggestions: [],
  })),

  // restaurants
  on(AppActions.loadRestaurants, (state) => ({
    ...state,
    loading: true,
    error: null,
    restaurants: [],
  })),
  on(AppActions.loadRestaurantsSuccess, (state, { restaurants }) => ({
    ...state,
    loading: false,
    restaurants,
  })),
  on(AppActions.loadRestaurantsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // sélection restaurants
  on(AppActions.selectRestaurant, (state, { restaurant }) => ({
    ...state,
    selectedRestaurant: restaurant,
  })),
  on(AppActions.clearSelectedRestaurant, (state) => ({
    ...state,
    selectedRestaurant: null,
  }))
);

//! Syntaxe clé
// Le reducer est une fonction PURE : (state, action) -> newState
// createReducer(initialState, ...on(...)) : déclare comment chaque action modifie le state
// on(AppActions.loadRestaurantsSuccess, ({ restaurants }) => ({ ...state, restaurants }))
// - pas d'API ici, pas d'effets de bord
// - on clone l'état (...state) et on remplace uniquement ce qui change
