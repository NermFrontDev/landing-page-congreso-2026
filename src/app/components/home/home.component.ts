import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, HostListener } from '@angular/core'; // <-- Añadido HostListener
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AirbnbListing } from '../../models/airbnb.model';
import { AirbnbService } from '../../services/airbnb.service';
import * as Aos from 'aos';
import { Agenda } from '../../models/agenda.model';
import { Testimonial } from '../../models/testimonials.model';
import { TestimonialService } from '../../services/testimonials.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  testimonials: Testimonial[] = [];
  testimonialChunks: Testimonial[][] = []; // <--- NUEVA PROPIEDAD: Guarda los testimonios agrupados
  listings: AirbnbListing[] = [];

  readonly EVENT_COORDINATES = {
    latitude: 33.448377,
    longitude: -112.074037,
  };

  currentIndex = 0;
  itemsPerView = 3;
  maxIndex = 0;

  categorias: string[] = ['Vie 16 Oct', 'Sáb 17 Oct', 'Dom 18 Oct'];
  filtroActual: string = 'Vie 16 Oct';
  eventos: Agenda[] = [];
  currentTab: string = 'S';

  constructor(
    private testimonialService: TestimonialService,
    private http: HttpClient,
    private airbnbService: AirbnbService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  changeTab(tab: string): void {
    this.currentTab = tab;
  }

  ngOnInit(): void {
    this.testimonialService.getTestimonials().subscribe({
      next: (data) => {
        this.testimonials = data;
        this.redistributeTestimonials(); // <--- Agrupa los testimonios al cargar los datos
      },
      error: (err) => console.error(err),
    });

    // --- Tu lógica de Airbnb se mantiene exactamente igual ---
    this.airbnbService.getListings().subscribe({
      next: (data) => {
        this.listings = data
          .map((item) => {
            const distance = this.calculateHaversineDistanceInMiles(
              this.EVENT_COORDINATES.latitude,
              this.EVENT_COORDINATES.longitude,
              item.coordinates.latitude,
              item.coordinates.longitude,
            );
            return { ...item, distance };
          })
          .filter((item) => item.distance <= 5)
          .sort((a, b) => a.distance - b.distance);

        this.updateMaxIndex();
        this.loadPreciseLocations();
      },
      error: (err) => console.error(err),
    });

    this.http.get<Agenda[]>('assets/data/agenda.json').subscribe((schedule) => {
      this.eventos = schedule;
    });

    if (isPlatformBrowser(this.platformId)) {
      Aos.init({
        duration: 800,
        once: true,
      });
    }
  }

  // Escucha de manera nativa cuando la pantalla cambia de tamaño (ej. rotar el iPad)
  @HostListener('window:resize', [])
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.redistributeTestimonials();
    }
  }

  /**
   * Divide el array original de testimonios en bloques dependiendo del ancho de pantalla
   */
  private redistributeTestimonials(): void {
    // 1. Validamos primero si estamos en el navegador. Si es el servidor, salimos de inmediato.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.testimonials.length) return;

    let chunkSize = 3; // Desktop por defecto
    const width = window.innerWidth;

    if (width < 768) {
      chunkSize = 1; // Mobile
    } else if (width >= 768 && width < 1024) {
      chunkSize = 2; // iPad / Tablets
    }

    const chunks: Testimonial[][] = [];
    for (let i = 0; i < this.testimonials.length; i += chunkSize) {
      chunks.push(this.testimonials.slice(i, i + chunkSize));
    }

    this.testimonialChunks = chunks;
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  get eventosFiltrados(): Agenda[] {
    return this.eventos.filter((e) => e.categoria === this.filtroActual);
  }

  cambiarFiltro(categoria: string) {
    this.filtroActual = categoria;
  }

  private calculateHaversineDistanceInMiles(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const EARTH_RADIUS_MILES = 3958.8;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const rLat1 = this.degreesToRadians(lat1);
    const rLat2 = this.degreesToRadians(lat2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(rLat1) *
        Math.cos(rLat2);
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
      this.airbnbService
        .getNeighborhood(item.coordinates.latitude, item.coordinates.longitude)
        .subscribe({
          next: (geoData) => {
            const address = geoData.address;
            (item as any).preciseLocation =
              address.neighbourhood ||
              address.suburb ||
              address.city_district ||
              'Phoenix';
          },
          error: () => {
            (item as any).preciseLocation = 'Phoenix';
          },
        });
    });
  }

  @ViewChild('myCarousel', { static: false }) carouselElement!: ElementRef;

  ngAfterViewInit() {
    // Aseguramos que Bootstrap y el DOM solo se manipulen en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const element =
        this.carouselElement?.nativeElement ||
        document.getElementById('testimoniosCarousel');

      if (typeof bootstrap !== 'undefined' && element) {
        new bootstrap.Carousel(element, {
          interval: 5000,
          ride: 'carousel',
        });
      }
    }
  }
}
