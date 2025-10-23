import { createAction, props } from '@ngrx/store';
import { NominatimResult } from '../services/nominatim';
import { CityWithRestaurants } from './models';

// villes
export const setCity = createAction(
  '[App] Set City',
  props<{ city: CityWithRestaurants }>()
);
export const clearCity = createAction('[App] Clear City');

// Restaurants
export const loadRestaurants = createAction(
  '[App] Load Restaurants',
  props<{ cityName: string }>()
);
export const loadRestaurantsSuccess = createAction(
  '[App] Load Restaurants Success',
  props<{ restaurants: NominatimResult[] }>()
);
export const loadRestaurantsFailure = createAction(
  '[App] Load Restaurants Failure',
  props<{ error: string }>()
);

// Sélection restaurant
export const selectRestaurant = createAction(
  '[App] Select Restaurant',
  props<{ restaurant: NominatimResult }>()
);
export const clearSelectedRestaurant = createAction(
  '[App] Clear Selected Restaurant'
);

// Suggestions de villes
export const suggestCities = createAction(
  '[App] Suggest Cities',
  props<{ query: string }>()
);
export const suggestCitiesSuccess = createAction(
  '[App] Suggest Cities Success',
  props<{ cities: NominatimResult[] }>()
);
export const suggestCitiesFailure = createAction(
  '[App] Suggest Cities Failure',
  props<{ error: string }>()
);

//! Sythaxe clé :
//  chaine = identifiant unique, [source] = module/feature qui envoie l'action ( ici app)
// ensuite verbe + objet  = ce qu'il se passe
// si je dispatch par exemple:  store.dispatch(suggestCities({ query : 'paris'})); NgRx envoie un objet
//  { type: '[App] Suggest Cities',
//    query: 'paris' }

// props<{ query: string }>() est la façon d'ajouter un payload typé à mon action ( ici c'est " mon action contient une propriété query de type string")
// le <> sert à donner le type du payload attendu.
//! en js pur :
// function suggestCities(query) {
//   return {
//     type: '[App] Suggest Cities',
//     query: query,
//   };
// }
