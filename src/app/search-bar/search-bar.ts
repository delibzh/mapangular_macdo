import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Nominatim, NominatimResult } from './../services/nominatim';
import { firstValueFrom } from 'rxjs';
import { AppStateService } from '../services/app-states.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule], // pour ngModel
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
})
export class SearchBar {
  // signal pour stocker la valeur de l'input ville :
  city = signal('');

  //signal pour stocker les résulats de la recherche ( villes)
  results = signal<NominatimResult[]>([]);

  //évenements verfs le paretn quand une ville est sélectionné :
  @Output() citySelected = new EventEmitter<
    NominatimResult & { mcds?: NominatimResult[] }
  >();

  constructor(
    private nominatim: Nominatim,
    private appState: AppStateService
  ) {}

  // appelé à chaque saisie dans l'input pour suggérer des villss :
  async onSearch() {
    const query = this.city();
    if (query.length < 1) {
      this.results.set([]);
      return;
    }

    // recherché uniquement les villes correspondant aux textes :
    const cityResults = await firstValueFrom(
      this.nominatim.searchCityOnly(query)
    );
    this.results.set(cityResults || []);
  }

  async selectCity(cityResult: NominatimResult) {
    // mettre le nom dans l'input :
    this.city.set(cityResult.display_name);
    //vider la liste déroulante :
    this.results.set([]);

    //récupérer les macdo de cette ville :
    const mcds = await firstValueFrom(
      this.nominatim.searchMcDonalds(cityResult.display_name)
    );

    //émettre la ville et ses mcdo au parents ( map )
    this.citySelected.emit({ ...cityResult, mcds });

    // appel au service app-state :

    this.appState.setCity({ ...cityResult, mcds });
  }

  //fonction trackBy pour angular 20 @for ( écviter les erreurs de tracking )
  trackBy(city: NominatimResult) {
    return city.display_name; // unique pour chaque éléments
  }

  async searchByButton() {
    if (!this.city()) return;

    // chercher la ville exacte via nominatim :
    const results = await firstValueFrom(
      this.nominatim.searchCityOnly(this.city())
    );
    if (results.length > 0) {
      this.selectCity(results[0]); // prendre la premiere correspondance
    }
  }
}
