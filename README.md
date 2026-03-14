# MIT EPM — Mapa Territorial Interactivo

Visualización interactiva de los proyectos del **Modelo de Integración en el Territorio (MIT)** de EPM en las subregiones de **Urabá** y **Oriente Antioqueño**.

## Setup

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno (opcional - funciona sin Mapbox)
cp .env.local.example .env.local

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework:** Next.js 14 (App Router)
- **Mapa:** Leaflet + react-leaflet (tiles CARTO)
- **Estilos:** Tailwind CSS
- **Gráficos:** Recharts
- **Animaciones:** Framer Motion
- **Lenguaje:** TypeScript

## Deploy en Vercel

```bash
npm run deploy
```

O conectar el repositorio directamente en [vercel.com](https://vercel.com).

## Funcionalidades

- Mapa interactivo con capas toggeables (proyectos, actores, choropleth, estructuras MIT)
- Filtros por región, estructura MIT, negocio EPM, factor de interacción y rango de inversión
- Panel de métricas con gráficos de distribución
- Popups detallados para proyectos, actores y municipios
- Modo oscuro/claro del mapa
- Diseño responsivo
