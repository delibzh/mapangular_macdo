import { Component, Input, OnInit } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { NominatimResult } from '../services/nominatim';
import { MapUtilsService } from '../services/map-utils.service';
import { AppStateService } from '../services/app-states.service';

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
    center: L.latLng(48.8566, 2.3522), // Paris par défaut
  };

  constructor(
    private mapUtils: MapUtilsService,
    private appState: AppStateService
  ) {}

  ngOnInit(): void {
    this.addMarker(48.8566, 2.3522, 'Bienvenue à Paris !');
  }

  onMapReady(mapInstance: L.Map) {
    this.map = mapInstance;
    if (this.focusCity) this.setFocus(this.focusCity);
  }

  setFocus(city: NominatimResult) {
    const lat = +city.lat;
    const lon = +city.lon;
    this.map.setView([lat, lon], 15);
    this.addMarker(lat, lon, city.display_name);
  }

  updateFocus(city: NominatimResult & { mcds?: NominatimResult[] }) {
    if (!this.map) return;

    // Supprimer anciens marqueurs
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    const lat = +city.lat;
    const lon = +city.lon;
    this.map.setView([lat, lon], 13);

    this.appState.setRestaurants(city.mcds ?? []); // synchro service ( BehaviorSubject)

    city.mcds?.forEach((mcd) => {
      this.addMarkerWithButton(+mcd.lat, +mcd.lon, mcd.display_name, mcd);
    });
  }

  // Marqueur simple
  addMarker(lat: number, lng: number, popupText: string) {
    const marker = this.mapUtils.createMarker(lat, lng, popupText);
    marker.addTo(this.map);
    this.markers.push(marker);
  }

  // Marqueur avec bouton "Choisir"
  addMarkerWithButton(
    lat: number,
    lng: number,
    popupText: string,
    restaurant: NominatimResult
  ) {
    const popup = this.mapUtils.createPopupContent(popupText, restaurant, (r) =>
      this.onRestaurantSelected(r)
    );
    const marker = this.mapUtils.createMarker(lat, lng, popup);
    marker.addTo(this.map);
    this.markers.push(marker);
  }

  private onRestaurantSelected(restaurant: NominatimResult): void {
    // au lieu de dispatch CustomEvent => on met à jour l'état centralisé
    this.appState.selectRestaurant(restaurant);
    this.map.closePopup();
  }
}
