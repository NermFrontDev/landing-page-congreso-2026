import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Resource } from '../../models/resource.model';
import { ResourcesService } from '../../services/resources.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports:[CommonModule],
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  private readonly resourcesService = inject(ResourcesService);

  /** Título de la sección */
  @Input() title = 'Descarga de Recursos';

  /** URL de la imagen del héroe (la franja superior) */
  @Input() heroImageUrl =
    'assets/images/resources/banner.jpg';

  /**
   * Recursos a mostrar. Es opcional: si el componente padre no pasa nada,
   * el componente los carga automáticamente desde ResourcesService (JSON).
   * Si SÍ los pasas por @Input, estos tienen prioridad y no se hace la llamada al servicio.
   */
  @Input() resources: Resource[] | null = null;

  /** Lista efectiva que se pinta en el template */
  protected readonly resourcesList = signal<Resource[]>([]);

  /** true mientras se está trayendo el JSON del servicio */
  protected readonly loadingResources = signal<boolean>(false);

  /** true si falló la carga del JSON */
  protected readonly loadError = signal<boolean>(false);

  /** Guarda qué card está descargando actualmente, para mostrar un spinner en su botón */
  protected readonly downloadingIndex = signal<number | null>(null);

  /** Guarda el índice de la última card que falló, para mostrar un mensaje de error */
  protected readonly errorIndex = signal<number | null>(null);

  ngOnInit(): void {
    if (this.resources && this.resources.length > 0) {
      this.resourcesList.set(this.resources);
      return;
    }

    this.loadingResources.set(true);
    this.loadError.set(false);

    this.resourcesService.getResources().subscribe({
      next: (data) => {
        this.resourcesList.set(data);
        this.loadingResources.set(false);
      },
      error: (err) => {
        console.error('No se pudieron cargar los recursos:', err);
        this.loadError.set(true);
        this.loadingResources.set(false);
      },
    });
  }

  protected async onDownload(resource: Resource, index: number): Promise<void> {
    if (this.downloadingIndex() !== null) {
      return; // evita doble click mientras descarga
    }

    this.errorIndex.set(null);
    this.downloadingIndex.set(index);

    try {
      const response = await fetch(resource.fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const extension = resource.fileType === 'pdf' ? 'pdf' : this.inferImageExtension(blob.type);
      const fileName = `${this.slugify(resource.fileName)}.${extension}`;

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(`No se pudo descargar el recurso "${resource.heading}":`, err);
      this.errorIndex.set(index);
    } finally {
      this.downloadingIndex.set(null);
    }
  }

  private inferImageExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/gif': 'gif',
    };
    return map[mimeType] ?? 'png';
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

}
