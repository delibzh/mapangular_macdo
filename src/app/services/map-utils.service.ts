import { Injectable } from '@angular/core';
import { NominatimResult } from '../services/nominatim';
import * as L from 'leaflet';

@Injectable({ providedIn: 'root' })
export class MapUtilsService {
  createMarker(
    lat: number,
    lng: number,
    popupContent: string | HTMLElement
  ): L.Marker {
    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
    });
    marker.bindPopup(popupContent);
    return marker;
  }

  createPopupContent(
    popupText: string,
    restaurant: NominatimResult,
    onSelect: (r: NominatimResult) => void
  ): HTMLElement {
    const container = document.createElement('div');
    container.className = 'restaurant-popup';

    container.innerHTML = `
      <h3>${popupText.split(',')[0]}</h3>
      <p>${popupText.split(',').slice(1).join(',')}</p>
    `;

    const button = document.createElement('button');
    button.textContent = 'Choisir';
    button.className = 'btn-choisir'; // Utilisation de la classe scss
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelect(restaurant);
    });

    container.appendChild(button);
    return container;
  }
}
