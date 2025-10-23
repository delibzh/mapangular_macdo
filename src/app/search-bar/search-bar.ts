import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NominatimResult } from '../services/nominatim';
import { Store } from '@ngrx/store';
import * as AppActions from '../state/app.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCitySuggestions } from '../state/app.selectors';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
})
export class SearchBar {
  city = signal('');

  results!: ReturnType<typeof toSignal<NominatimResult[]>>;

  @Output() citySelected = new EventEmitter<NominatimResult>();

  constructor(private store: Store) {
    this.results = toSignal(this.store.select(selectCitySuggestions), {
      initialValue: [],
    });
  }

  onSearch() {
    const query = this.city().trim();
    this.store.dispatch(AppActions.suggestCities({ query }));
  }

  selectCity(cityResult: NominatimResult) {
    this.city.set(cityResult.display_name);
    this.store.dispatch(AppActions.setCity({ city: cityResult }));
    this.store.dispatch(
      AppActions.loadRestaurants({ cityName: cityResult.display_name })
    );
    this.citySelected.emit(cityResult);
  }

  searchByButton() {
    const q = this.city().trim();
    if (!q) return;
    this.store.dispatch(AppActions.suggestCities({ query: q }));
  }

  trackBy(city: NominatimResult) {
    return city.display_name;
  }
}
