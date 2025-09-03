import { NgIf } from '@angular/common';
// infospanel.ts
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppStateService } from '../services/app-states.service';
import { NominatimResult } from '../services/nominatim';

@Component({
  selector: 'app-infospanel',
  standalone: true,
  templateUrl: './infospanel.html',
  styleUrls: ['./infospanel.scss'],
})
export class Infospanel {
  //  pont Observable -> Signal
  selectedRestaurant: ReturnType<typeof toSignal<NominatimResult | null>>;

  constructor(private appState: AppStateService) {
    this.selectedRestaurant = toSignal<NominatimResult | null>(
      this.appState.selectedRestaurant$,
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
    // naviguation si besoin
  }

  annuler() {
    // reset la sélection dans l’état centralisé
    this.appState.selectRestaurant(null as any); // ou adapte la signature à null
  }
}
