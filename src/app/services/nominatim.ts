import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

@Injectable({
  providedIn: 'root',
})
export class Nominatim {
  private baseUrl = 'https://nominatim.openstreetmap.org/search';

  private cityCache = new Map<string, NominatimResult[]>();
  private mcdonaldsCache = new Map<string, NominatimResult[]>();

  constructor(private http: HttpClient) {}

  // Cherche une ville avec cache
  searchCityOnly(query: string): Observable<NominatimResult[]> {
    const cacheKey = query.toLowerCase().trim();
    if (this.cityCache.has(cacheKey)) {
      return of(this.cityCache.get(cacheKey)!);
    }

    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('limit', '5')
      .set('countrycodes', 'fr');

    return this.http
      .get<NominatimResult[]>(this.baseUrl, { params })
      .pipe(tap((results) => this.cityCache.set(cacheKey, results)));
  }

  // Cherche des McDonald's avec cache
  searchMcDonalds(query: string): Observable<NominatimResult[]> {
    const cacheKey = query.toLowerCase().trim();
    if (this.mcdonaldsCache.has(cacheKey)) {
      return of(this.mcdonaldsCache.get(cacheKey)!);
    }

    const params = new HttpParams()
      .set('q', 'McDonald ' + query)
      .set('format', 'json')
      .set('limit', '10')
      .set('countrycodes', 'fr');

    return this.http
      .get<NominatimResult[]>(this.baseUrl, { params })
      .pipe(tap((results) => this.mcdonaldsCache.set(cacheKey, results)));
  }

  //! Avant cache exemple
  // searchMcDonalds(query: string): Observable<NominatimResult[]> {
  // const params = new HttpParams()
  //   .set('q', 'McDonald ' + query)
  //   .set('format', 'json')
  //   .set('limit', '10')
  //   .set('countrycodes', 'fr');

  // return this.http.get<NominatimResult[]>(this.baseUrl, { params });

  // Vider le cache
  clearCache() {
    this.cityCache.clear();
    this.mcdonaldsCache.clear();
    console.log('🗑️ Cache vidé');
  }

  // Infos sur le cache
  getCacheInfo() {
    return {
      cities: this.cityCache.size,
      mcdonalds: this.mcdonaldsCache.size,
    };
  }
}
