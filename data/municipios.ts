export interface Municipio {
  nombre: string;
  codigo_dane: string;
  region: 'Urabá' | 'Oriente';
  coordenadas: { lat: number; lng: number };
}

export const municipios: Municipio[] = [
  // === URABÁ ===
  { nombre: 'Apartadó', codigo_dane: '05045', region: 'Urabá', coordenadas: { lat: 7.8830, lng: -76.6256 } },
  { nombre: 'Turbo', codigo_dane: '05837', region: 'Urabá', coordenadas: { lat: 8.0929, lng: -76.7256 } },
  { nombre: 'Carepa', codigo_dane: '05147', region: 'Urabá', coordenadas: { lat: 7.7570, lng: -76.6550 } },
  { nombre: 'Chigorodó', codigo_dane: '05172', region: 'Urabá', coordenadas: { lat: 7.6670, lng: -76.6810 } },
  { nombre: 'Mutatá', codigo_dane: '05480', region: 'Urabá', coordenadas: { lat: 7.2440, lng: -76.4360 } },
  { nombre: 'Necoclí', codigo_dane: '05495', region: 'Urabá', coordenadas: { lat: 8.4240, lng: -76.7850 } },
  { nombre: 'San Pedro de Urabá', codigo_dane: '05665', region: 'Urabá', coordenadas: { lat: 8.2810, lng: -76.3750 } },
  { nombre: 'Arboletes', codigo_dane: '05051', region: 'Urabá', coordenadas: { lat: 8.8500, lng: -76.4270 } },
  { nombre: 'San Juan de Urabá', codigo_dane: '05659', region: 'Urabá', coordenadas: { lat: 8.7620, lng: -76.5320 } },
  // === ORIENTE ===
  { nombre: 'Rionegro', codigo_dane: '05615', region: 'Oriente', coordenadas: { lat: 6.1556, lng: -75.3744 } },
  { nombre: 'Guatapé', codigo_dane: '05321', region: 'Oriente', coordenadas: { lat: 6.2326, lng: -75.1570 } },
  { nombre: 'El Peñol', codigo_dane: '05541', region: 'Oriente', coordenadas: { lat: 6.2200, lng: -75.2430 } },
  { nombre: 'San Carlos', codigo_dane: '05649', region: 'Oriente', coordenadas: { lat: 6.1865, lng: -74.9967 } },
  { nombre: 'San Rafael', codigo_dane: '05667', region: 'Oriente', coordenadas: { lat: 6.2945, lng: -75.0280 } },
  { nombre: 'Granada', codigo_dane: '05313', region: 'Oriente', coordenadas: { lat: 6.1450, lng: -75.1830 } },
  { nombre: 'Marinilla', codigo_dane: '05440', region: 'Oriente', coordenadas: { lat: 6.1770, lng: -75.3370 } },
  { nombre: 'El Retiro', codigo_dane: '05607', region: 'Oriente', coordenadas: { lat: 6.0550, lng: -75.5100 } },
  { nombre: 'La Ceja', codigo_dane: '05376', region: 'Oriente', coordenadas: { lat: 6.0310, lng: -75.4270 } },
  { nombre: 'El Carmen de Viboral', codigo_dane: '05148', region: 'Oriente', coordenadas: { lat: 6.0830, lng: -75.3340 } },
  { nombre: 'Cocorná', codigo_dane: '05197', region: 'Oriente', coordenadas: { lat: 6.0570, lng: -75.1880 } },
  { nombre: 'San Luis', codigo_dane: '05660', region: 'Oriente', coordenadas: { lat: 6.0440, lng: -75.0260 } },
  { nombre: 'Guarne', codigo_dane: '05318', region: 'Oriente', coordenadas: { lat: 6.2790, lng: -75.4430 } },
  { nombre: 'Sonsón', codigo_dane: '05756', region: 'Oriente', coordenadas: { lat: 5.7133, lng: -75.3124 } },
  { nombre: 'San Vicente', codigo_dane: '05674', region: 'Oriente', coordenadas: { lat: 6.2720, lng: -75.3340 } },
  { nombre: 'Argelia', codigo_dane: '05055', region: 'Oriente', coordenadas: { lat: 5.7340, lng: -75.1400 } },
];

export const DANE_CODES = new Set(municipios.map(m => m.codigo_dane));

export function getMunicipioByName(nombre: string): Municipio | undefined {
  return municipios.find(m => m.nombre.toLowerCase() === nombre.toLowerCase());
}

export function getMunicipiosByRegion(region: 'Urabá' | 'Oriente'): Municipio[] {
  return municipios.filter(m => m.region === region);
}
