import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { NominatimResult } from '../services/nominatim';
import { selectSelectedRestaurant } from '../state/app.selectors';
import * as AppActions from '../state/app.actions';

@Component({
  selector: 'app-infospanel',
  standalone: true,
  templateUrl: './infospanel.html',
  styleUrls: ['./infospanel.scss'],
})
export class Infospanel {
  selectedRestaurant!: ReturnType<typeof toSignal<NominatimResult | null>>;

  constructor(private store: Store) {
    //  init après injection du store
    this.selectedRestaurant = toSignal(
      this.store.select(selectSelectedRestaurant),
      { initialValue: null }
    );
  }

  getRestaurantName() {
    const r = this.selectedRestaurant();
    return r ? (r.display_name ?? '').split(',')[0].trim() : '';
  }

  getRestaurantAddress() {
    const r = this.selectedRestaurant();
    if (!r?.display_name) return '';
    const parts = r.display_name.split(',');
    return parts.slice(1).join(',').trim();
  }

  continuer() {
    //  navigation / étape suivante (vide pour le projet)
  }

  annuler() {
    this.store.dispatch(AppActions.clearSelectedRestaurant());
  }
}
