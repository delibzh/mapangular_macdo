import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NominatimResult } from './nominatim';

export interface CityWithRestaurants extends NominatimResult {
  mcds?: NominatimResult[];
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  // ville sélectionné
  private readonly _city$ = new BehaviorSubject<CityWithRestaurants | null>(
    null
  );
  readonly city$ = this._city$.asObservable();

  //liste de restaurants de la ville
  private readonly _restaurants$ = new BehaviorSubject<NominatimResult[]>([]);
  readonly restaurants$ = this._restaurants$.asObservable();

  // restaurant sélectionné :
  private readonly _selectedRestaurant$ =
    new BehaviorSubject<NominatimResult | null>(null);
  readonly selectedRestaurant$ = this._selectedRestaurant$.asObservable();

  setCity(city: CityWithRestaurants | null) {
    this._city$.next(city);
    // si mcds dans la ville = synchro de la liste
    this._restaurants$.next(city?.mcds ?? []); // "optional chaining "si la ville est défini, prends city.mcds sinon renvoi undefined
    //reset du restaurants sélectionné quand on change de ville
    this._selectedRestaurant$.next(null);
  }

  setRestaurants(list: NominatimResult[]) {
    this._restaurants$.next(list ?? []); // "nullish coalescing" si la liste est null, ou undefined, alors met un tableau vide à la place
  }

  selectRestaurant(restaurant: NominatimResult | null) {
    this._selectedRestaurant$.next(restaurant);
  }
}

//! Avec un AppStateService basé sur BehaviorSubject :
// on centralises toutes les infos importantes dans un seul endroit (le service).

// city$ = ville sélectionnée
// restaurants$ = liste de restos
// selectedRestaurant$ = resto choisi
// Tous les composants s’abonnent au même flux :
// SearchBar → appelle setCity(...)
// Map → écoute city$ pour savoir quoi afficher
// InfoPanel → écoute selectedRestaurant$ pour afficher les détails
