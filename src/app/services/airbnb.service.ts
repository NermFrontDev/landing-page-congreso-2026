import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AirbnbListing } from '../models/airbnb.model';

@Injectable({
  providedIn: 'root'
})
export class AirbnbService {
  private dataUrl = 'assets/data/Airbnb_Phoenix.json';

  constructor(private http: HttpClient) {
  }

  getListings(): Observable<AirbnbListing[]> {
    return this.http.get<AirbnbListing[]>(this.dataUrl);
  }

  getNeighborhood(lat: number, lon: number): Observable<any> {
    // Usamos el user-agent o un identificador en los params según las políticas de OpenStreetMap
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url);
  }
}
