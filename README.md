# Congreso Juvenil S.A.N.A.R. | FEJA Arizona 2026

Landing page oficial del Congreso Juvenil **S.A.N.A.R.** desarrollada con Angular.

El proyecto está enfocado en ofrecer una experiencia moderna, rápida y responsive para promocionar el evento juvenil de FESJA Arizona.

---

# Tecnologías utilizadas

- Angular
- TypeScript
- SCSS
- Angular SSR
- Vite
- HTML5

---

# Características

- Diseño responsive
- Arquitectura modular
- Componentes reutilizables
- Optimización SEO
- Open Graph y Twitter Cards
- Soporte SSR (Server Side Rendering)
- Manejo de assets locales
- Organización escalable

---

# Estructura del proyecto

```bash
src
├── app
│   ├── components
│   │   └── home
│   │       ├── home.component.html
│   │       ├── home.component.scss
│   │       └── home.component.ts
│   │
│   ├── shared
│   │   ├── footer
│   │   │   ├── footer.component.html
│   │   │   ├── footer.component.scss
│   │   │   └── footer.component.ts
│   │   │
│   │   └── navbar
│   │       ├── navbar.component.html
│   │       ├── navbar.component.scss
│   │       └── navbar.component.ts
│   │
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.ts
│   ├── app.config.server.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
├── assets
│   ├── fonts
│   │   ├── magdes
│   │   ├── roboto
│   │   └── space-grotesk
│   │
│   └── images
│
├── favicon.ico
├── index.html
├── main.server.ts
├── main.ts
└── styles.scss
```

---

# Instalación

Clona el repositorio:

```bash
git clone https://github.com/NermFrontDev/landing-page-congreso-2026.git
```

Ingresa al proyecto:

```bash
cd landing-page-congreso-2026
```

Instala las dependencias:

```bash
npm install
```

---

# Desarrollo local

Ejecuta el servidor de desarrollo:

```bash
ng serve
```

o

```bash
npm start
```

La aplicación estará disponible en:

```bash
http://localhost:4200
```

---

# Build de producción

Generar build:

```bash
ng build
```

Los archivos compilados se generarán en:

```bash
dist/
```

---

# SSR (Server Side Rendering)

Ejecutar SSR en desarrollo:

```bash
npm run serve:ssr
```

Build SSR:

```bash
npm run build:ssr
```

---

# Convenciones del proyecto

## Componentes

Cada componente contiene:

- HTML
- SCSS
- TypeScript

Ejemplo:

```bash
home.component.html
home.component.scss
home.component.ts
```

---

## Shared Components

Los componentes compartidos se encuentran en:

```bash
src/app/shared
```

Ejemplos:

- Navbar
- Footer

---

# Assets

## Fonts

Las fuentes locales se almacenan en:

```bash
src/assets/fonts
```

Fuentes incluidas:

- Magdes
- Roboto
- Space Grotesk

---

## Images

Las imágenes y recursos gráficos se almacenan en:

```bash
src/assets/images
```

---

# SEO

El proyecto incluye:

- Meta tags
- Open Graph
- Twitter Cards
- Canonical URL
- Theme Color
- Optimización para compartir en redes sociales

Configurados en:

```bash
src/index.html
```

---

# Scripts útiles

```bash
npm start
```

Inicia el proyecto.

```bash
npm run build
```

Genera build de producción.

```bash
npm run watch
```

Build en modo watch.

```bash
npm run test
```

Ejecuta pruebas.

---

# Recomendaciones

- Mantener los componentes pequeños y reutilizables.
- Centralizar estilos globales en `styles.scss`.
- Optimizar imágenes antes de subirlas.
- Utilizar lazy loading si el proyecto escala.
- Mantener nombres descriptivos y consistentes.

---

# Autor

FESJA Arizona

---

# Licencia

Este proyecto es privado y desarrollado para uso interno de FESJA Arizona.
