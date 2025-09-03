import { Component, ViewChild, signal } from '@angular/core';
import { Map } from './map/map';
import { SearchBar } from './search-bar/search-bar';
import { Infospanel } from './infospanel/infospanel';
import { NominatimResult } from './services/nominatim';
import { AppStateService } from './services/app-states.service'; // vérifie le nom exact du fichier

@Component({
  selector: 'app-root',
  standalone: true, //  important si tu utilises "imports" ici
  imports: [Map, SearchBar, Infospanel],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  title = signal('mac_donald');

  // Récupère directement l'instance du composant Map
  @ViewChild(Map) map!: Map;

  constructor(private appState: AppStateService) {}

  onCitySelected(city: NominatimResult & { mcds?: NominatimResult[] }) {
    //  met à jour l’état centralisé (ville + reset sélection)
    this.appState.setCity(city);
    //  centre/rafraîchit la carte + marqueurs
    if (this.map) this.map.updateFocus(city);
  }
}
