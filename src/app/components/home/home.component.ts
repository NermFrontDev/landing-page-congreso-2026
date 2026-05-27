import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AirbnbListing } from '../../models/airbnb.model';
import { AirbnbService } from '../../services/airbnb.service';
import * as Aos from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  listings: AirbnbListing[] = [];

  // Variables para el control del carrusel nativo
  currentIndex = 0;
  itemsPerView = 3;
  maxIndex = 0;

  constructor(
    private airbnbService: AirbnbService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.airbnbService.getListings().subscribe({
      next: (data) => {
        this.listings = data;
        this.updateMaxIndex();
        this.loadPreciseLocations(); // <--- Llamamos a la traducción de coordenadas
    },
    error: (err) => console.error(err)
    });

    if (isPlatformBrowser(this.platformId)) {
      Aos.init({
        duration: 800,
        once: true,
      });
    }
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
            // Nominatim suele devolver el barrio en 'neighbourhood', 'suburb' o 'road'
            const address = geoData.address;
            (item as any).preciseLocation = address.neighbourhood || address.suburb || address.city_district || 'Phoenix';
          },
          error: () => {
            (item as any).preciseLocation = 'Phoenix'; // Fallback por si falla la API
          }
        });
    });
  }
}
