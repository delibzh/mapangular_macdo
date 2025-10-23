import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AppActions from './app.actions';
import { Nominatim } from '../services/nominatim';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
} from 'rxjs';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private nominatim = inject(Nominatim);

  // Suggestions de villes
  suggestCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.suggestCities),
      map(({ query }) => (query ?? '').trim()),
      debounceTime(300),
      distinctUntilChanged(),
      filter((q) => q.length >= 2),
      switchMap((query) =>
        this.nominatim.searchCityOnly(query).pipe(
          map((cities) => AppActions.suggestCitiesSuccess({ cities })),
          catchError((err) =>
            of(
              AppActions.suggestCitiesFailure({
                error: String(err?.message ?? err),
              })
            )
          )
        )
      )
    )
  );

  // Charger restaurants  d'une ville
  loadRestaurants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadRestaurants),
      map(({ cityName }) => (cityName ?? '').trim()),
      filter((name) => !!name),
      switchMap((cityName) =>
        this.nominatim.searchMcDonalds(cityName).pipe(
          map((restaurants) =>
            AppActions.loadRestaurantsSuccess({ restaurants })
          ),
          catchError((err) =>
            of(
              AppActions.loadRestaurantsFailure({
                error: String(err?.message ?? err),
              })
            )
          )
        )
      )
    )
  );
}

//! Syntaxe clé
// Un Effect écoute des actions (ici: [App] Suggest Cities),
// lance un travail ASYNCHRONE (appel API), puis redispatche une action de succès/échec.
//
// createEffect(() => stream$) : fabrique un effect à partir d'un flux RxJS
// ofType(AppActions.suggestCities) : ne réagit qu'aux actions "Suggest Cities"
// map/debounceTime/distinctUntilChanged/filter : pré-traitements Rx (nettoyage, anti-spam)
// switchMap(...) : annule l'appel précédent si une nouvelle action arrive (user continue à taper)
// this.nominatim.searchCityOnly(query) : APPEL API réel
// map(...) → suggestCitiesSuccess : renvoie les résultats au Store
// catchError(...) → suggestCitiesFailure : remonte une erreur typée
