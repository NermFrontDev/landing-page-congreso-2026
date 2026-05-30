import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AirbnbListing } from '../../models/airbnb.model';
import { AirbnbService } from '../../services/airbnb.service';
import * as Aos from 'aos';
import { Agenda } from '../../models/agenda.model';
import { get } from 'https';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  listings: AirbnbListing[] = [];

  // Coordenadas de referencia del evento (Phoenix, AZ)
  readonly EVENT_COORDINATES = {
    latitude: 33.448377,
    longitude: -112.074037
  };

  // Variables para el control del carrusel nativo
  currentIndex = 0;
  itemsPerView = 3;
  maxIndex = 0;

  categorias: string[] = ['Vie 16 Oct', 'Sáb 17 Oct', 'Dom 18 Oct'];
  filtroActual: string = 'Vie 16 Oct';
  eventos: Agenda[] = [];

  constructor(
    private http: HttpClient,
    private airbnbService: AirbnbService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  currentTab: string = 'S';

  changeTab(tab: string): void {
    this.currentTab = tab;
  }

  ngOnInit(): void {

    this.airbnbService.getListings().subscribe({
      next: (data) => {
        // 1. Calcular distancia en millas y filtrar/ordenar
        this.listings = data
          .map(item => {
            const distance = this.calculateHaversineDistanceInMiles(
              this.EVENT_COORDINATES.latitude,
              this.EVENT_COORDINATES.longitude,
              item.coordinates.latitude,
              item.coordinates.longitude
            );
            return { ...item, distance }; // Añadimos la propiedad de distancia en millas
          })
          .filter(item => item.distance <= 5) // <--- FILTRO: Solo los que están a 5 millas o menos
          .sort((a, b) => a.distance - b.distance); // Ordenar de más cercano a más lejano

        this.updateMaxIndex();
        this.loadPreciseLocations();
      },
      error: (err) => console.error(err)
    });

    this.http.get<Agenda[]>('assets/data/agenda.json').subscribe(schedule => {
      this.eventos = schedule;
    });

    if (isPlatformBrowser(this.platformId)) {
      Aos.init({
        duration: 800,
        once: true,
      });
    }
  }

  get eventosFiltrados(): Agenda[] {
    return this.eventos.filter(e => e.categoria === this.filtroActual);
  }

  cambiarFiltro(categoria: string) {
    this.filtroActual = categoria;
  }

  /**
   * Calcula la distancia en millas entre dos coordenadas usando la fórmula de Haversine
   */
  private calculateHaversineDistanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const EARTH_RADIUS_MILES = 3958.8; // Radio de la tierra en millas

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const rLat1 = this.degreesToRadians(lat1);
    const rLat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_MILES * c;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  updateMaxIndex(): void {
    this.maxIndex = Math.max(0, this.listings.length - this.itemsPerView);
  }

  next(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  loadPreciseLocations() {
    this.listings.forEach((item) => {
      this.airbnbService.getNeighborhood(item.coordinates.latitude, item.coordinates.longitude)
        .subscribe({
          next: (geoData) => {
            const address = geoData.address;
            (item as any).preciseLocation = address.neighbourhood || address.suburb || address.city_district || 'Phoenix';
          },
          error: () => {
            (item as any).preciseLocation = 'Phoenix';
          }
        });
    });
  }
}
