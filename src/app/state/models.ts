import { NominatimResult } from '../services/nominatim';

export interface CityWithRestaurants extends NominatimResult {
  mcds?: NominatimResult[];
}

export interface AppStateModel {
  city: CityWithRestaurants | null;
  restaurants: NominatimResult[];
  selectedRestaurant: NominatimResult | null;
  loading: boolean;
  error: string | null;
  citySuggestions: NominatimResult[];
}
