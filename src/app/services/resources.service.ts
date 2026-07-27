import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  private readonly http = inject(HttpClient);

  /**
   * Ruta al JSON con los recursos. Cambia esto por la URL de tu API si en
   * vez de un archivo estático quieres traerlo de un backend.
   */
  private readonly resourcesUrl = '/assets/json/resources.json';

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.resourcesUrl);
  }
}
