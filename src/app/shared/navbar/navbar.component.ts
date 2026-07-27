import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @ViewChild('offcanvasMenu') offcanvasMenu!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  /**
   * Cierra el offcanvas de Bootstrap de forma programática.
   * Retorna una promesa que se resuelve cuando la animación de cierre termina.
   */
  private closeOffcanvas(): Promise<void> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      const offcanvasEl = this.offcanvasMenu?.nativeElement;
      if (!offcanvasEl || typeof bootstrap === 'undefined') {
        resolve();
        return;
      }

      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) {
        // Escuchar el evento 'hidden' para saber cuándo terminó la animación
        offcanvasEl.addEventListener('hidden.bs.offcanvas', () => resolve(), { once: true });
        bsOffcanvas.hide();
      } else {
        resolve();
      }
    });
  }

  /**
   * Navega a una sección dentro del Home (scroll a un ancla).
   * Cierra el offcanvas y luego hace scroll suave al elemento.
   */
  async navigateToSection(sectionId: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    // 1. Cerrar el offcanvas primero
    await this.closeOffcanvas();

    // 2. Si no estamos en Home, navegar allí con el fragmento
    if (this.router.url.split('#')[0] !== '/') {
      await this.router.navigate(['/'], { fragment: sectionId });
      // Esperar un tick para que el DOM se renderice
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    // 3. Si ya estamos en Home, simplemente hacemos scroll
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Navega a una ruta (por ejemplo /resources).
   * Cierra el offcanvas y luego navega con el Router.
   */
  async navigateToRoute(route: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.closeOffcanvas();
    await this.router.navigate([route]);
  }
}
