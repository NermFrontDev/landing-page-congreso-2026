import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Testimonial } from '../models/testimonials.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private http = inject(HttpClient);
  private jsonUrl = 'assets/data/testimonials.json'; // Ajusta la ruta si es necesario

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(this.jsonUrl);
  }
}
