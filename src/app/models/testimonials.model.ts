export interface Testimonial {
  id: number;
  stars: number; // Guardamos el número para renderizar dinámicamente las estrellas
  text: string;
  author: {
    name: string;
    conference: string;
    profileImage: string;
  };
}
