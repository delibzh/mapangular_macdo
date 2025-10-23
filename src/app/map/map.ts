import {
  Component,
  Input,
  OnInit,
  Injector,
  effect,
  inject,
} from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { NominatimResult } from '../services/nominatim';
import { MapUtilsService } from '../services/map-utils.service';

import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectRestaurants } from '../state/app.selectors';
import * as AppActions from '../state/app.actions';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
})
export class Map implements OnInit {
  @Input() focusCity: NominatimResult | null = null;

  map!: L.Map;
  markers: L.Marker[] = [];

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }),
    ],
    zoom: 13,
    center: L.latLng(48.8566, 2.3522),
  };

  restaurants!: ReturnType<typeof toSignal<NominatimResult[]>>;
  private injector = inject(Injector);

  constructor(private mapUtils: MapUtilsService, private store: Store) {
    this.restaurants = toSignal(this.store.select(selectRestaurants), {
      initialValue: [],
    });

    effect(
      () => {
        const list = this.restaurants();
        if (!this.map) return;

        this.markers.forEach((m) => m.remove());
        this.markers = [];

        for (const r of list) {
          const popup = this.mapUtils.createPopupContent(
            r.display_name,
            r,
            (x) => this.onRestaurantSelected(x)
          );
          const marker = this.mapUtils.createMarker(+r.lat, +r.lon, popup);
          marker.addTo(this.map);
          this.markers.push(marker);
        }
      },
      { injector: this.injector }
    );
  }

  ngOnInit(): void {}

  onMapReady(mapInstance: L.Map) {
    this.map = mapInstance;
    if (this.focusCity) this.setFocus(this.focusCity);
  }

  setFocus(city: NominatimResult) {
    this.map.setView([+city.lat, +city.lon], 13);
  }

  // Appelé par AppComponent après sélection de ville pour recadrer la carte
  updateFocus(city: NominatimResult) {
    if (!this.map) return;
    this.setFocus(city);
    // Les marqueurs sont gérer automatiquement par l’effet quand le Store est mis à jour
  }

  private onRestaurantSelected(restaurant: NominatimResult): void {
    this.store.dispatch(AppActions.selectRestaurant({ restaurant }));
    this.map.closePopup();
  }
}
