export const REGION_BOUNDS = {
  Urabá: {
    center: { lat: 7.88, lng: -76.63 },
    zoom: 9,
    bounds: [[7.0, -77.2], [9.0, -76.0]] as [[number, number], [number, number]],
  },
  Oriente: {
    center: { lat: 6.15, lng: -75.35 },
    zoom: 10,
    bounds: [[5.5, -75.7], [6.5, -74.8]] as [[number, number], [number, number]],
  },
  Todas: {
    center: { lat: 7.0, lng: -75.8 },
    zoom: 7,
    bounds: [[5.5, -77.2], [9.0, -74.8]] as [[number, number], [number, number]],
  },
};

export type MapMode = 'dark' | 'light' | 'satellite';

// === BASE TILES ===
export const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const LIGHT_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
export const SATELLITE_TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const SATELLITE_LABELS_URL = 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png';
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';
export const SATELLITE_ATTRIBUTION = '&copy; Esri, Maxar, Earthstar Geographics';

// === ENVIRONMENTAL / TERRITORIAL OVERLAY TILES ===
// All free, no API key required.

export interface EnvLayer {
  id: string;
  name: string;
  description: string;
  url: string;
  attribution: string;
  opacity: number;
  color: string; // for toggle UI
  category: 'terreno' | 'agua' | 'vegetacion' | 'clima';
}

export const ENV_LAYERS: EnvLayer[] = [
  {
    id: 'relieve',
    name: 'Relieve topográfico',
    description: 'Elevación y curvas de nivel — muestra la diferencia Urabá (2m) vs Oriente (2100m)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
    opacity: 0.55,
    color: '#a3856b',
    category: 'terreno',
  },
  {
    id: 'hidro',
    name: 'Cuerpos de agua',
    description: 'Ríos, embalses y cuencas — contexto para proyectos de acueducto y protección hídrica',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Physical',
    opacity: 0.45,
    color: '#3b82f6',
    category: 'agua',
  },
  {
    id: 'vegetacion',
    name: 'Cobertura vegetal',
    description: 'Vegetación y uso del suelo — identifica bosques y zonas de deforestación',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Terrain',
    opacity: 0.5,
    color: '#22c55e',
    category: 'vegetacion',
  },
  {
    id: 'luces',
    name: 'Luces nocturnas (NASA)',
    description: 'NASA Black Marble VIIRS — muestra dónde hay y NO hay electrificación',
    url: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
    attribution: '&copy; NASA Earth Observatory',
    opacity: 0.7,
    color: '#fbbf24',
    category: 'clima',
  },
  {
    id: 'temp',
    name: 'Temperatura superficial',
    description: 'MODIS Land Surface Temperature — islas de calor y gradientes térmicos',
    url: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_Land_Surface_Temp_Day/default/2024-01-15/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
    attribution: '&copy; NASA MODIS',
    opacity: 0.45,
    color: '#ef4444',
    category: 'clima',
  },
];

export function getMarkerSize(inversion: number): number {
  if (inversion > 400000) return 28;
  if (inversion > 200000) return 22;
  if (inversion > 100000) return 18;
  if (inversion > 50000) return 14;
  return 10;
}

export function getChoroplethColor(inversion: number, maxInversion: number): string {
  const ratio = inversion / maxInversion;
  if (ratio > 0.7) return '#00A651';
  if (ratio > 0.45) return '#00843D';
  if (ratio > 0.25) return '#006B32';
  if (ratio > 0.1) return '#004D24';
  return '#1a3a2a';
}

export function getChoroplethOpacity(inversion: number, maxInversion: number): number {
  const ratio = inversion / maxInversion;
  return Math.max(0.3, Math.min(0.85, 0.3 + ratio * 0.55));
}
