export type ResourceFileType = 'pdf' | 'image';

export interface Resource {
  /** Título que se muestra en la card */
  heading: string;

  /** Descripción corta debajo del título */
  description: string;

  /** URL de la miniatura que se muestra en la card (puede ser la misma que fileUrl si el recurso es una imagen) */
  thumbnailUrl: string;

  /** URL real del archivo a descargar (pdf o imagen) */
  fileUrl: string;

  /** Icono para mostrar el tipo de archivo */
  iconFileType: string;
  /** Tipo de archivo: determina la extensión y el manejo de la descarga */
  fileType: ResourceFileType;

  /** Nombre de archivo sugerido al descargar (sin extensión, se agrega automáticamente) */
  fileName: string;

  /** Icono de la card, se muestra en la parte superior izquierda */
  iconSize: string;
  /** Tamaño del archivo, se muestra en la card */
  fileSize: string;

  /** Icono para mostrar la compatibilidad */
  iconCompatible: string;
  /** Versión compatible, se muestra en la card */
  compatible: string;

  /** Icono para mostrar la resolución */
  iconPixelDimension: string;
  /** Resolución del archivo, se muestra en la card */
  pixelDimension: string;

}
