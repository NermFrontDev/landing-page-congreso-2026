import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  navigateToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {

      // 1. Buscamos el elemento de destino en la página
      const element = document.getElementById(sectionId);

      if (element) {
        // Ejecutamos el scroll suave nativo hacia la sección
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 2. Buscamos la instancia del Offcanvas de Bootstrap para cerrarlo
        const offcanvasElement = document.getElementById('staticBackdrop');
        if (typeof bootstrap !== 'undefined' && offcanvasElement) {
          // Obtiene la instancia activa del menú o crea una si no existe
          const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);

          // Ocultamos el menú de forma programática (esto quita también el fondo oscuro automáticamente)
          bsOffcanvas.hide();
        }
      }

    }
  }

}
