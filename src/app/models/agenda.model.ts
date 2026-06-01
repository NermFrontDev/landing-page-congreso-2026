export interface Agenda {
  titulo: string;
  horario: [
    hora: string | number,
    formato: string,
  ];
  tag: string[],
  categoria: string;
  speaker: string;
  locacion: string;
}
