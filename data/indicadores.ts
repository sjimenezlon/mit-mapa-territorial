/**
 * Indicadores socioeconómicos y de calidad de vida por municipio.
 *
 * ⚠️ NOTA DE TRANSPARENCIA:
 * Estos datos son ESTIMACIONES basadas en fuentes secundarias.
 * DNP TerriData NO tiene API pública — es una app Angular cerrada.
 * Los valores se obtuvieron de:
 *   - DANE CNPV 2018 (Censo Nacional Población y Vivienda) — publicaciones PDF
 *   - DNP TerriData — consultado manualmente vía web (fichas municipales)
 *   - DANE proyecciones poblacionales 2024
 *   - Gobernación de Antioquia — Anuario Estadístico
 *
 * Para datos 100% verificables vía API, consultar data/datosReales.ts
 * que tiene datasets consultados en vivo contra datos.gov.co.
 *
 * Fuente de verificación manual: https://terridata.dnp.gov.co
 */

export interface IndicadorMunicipal {
  municipio: string;
  region: 'Urabá' | 'Oriente';
  poblacion_2024: number;
  ipm: number;                    // Índice de Pobreza Multidimensional (% hogares, DNP 2024)
  cobertura_acueducto: number;    // % hogares con acueducto (DANE)
  cobertura_alcantarillado: number; // % hogares con alcantarillado (DANE)
  cobertura_energia: number;      // % hogares con energía eléctrica (DANE)
  cobertura_gas: number;          // % hogares con gas natural (DANE)
  cobertura_internet: number;     // % hogares con internet (MinTIC)
  nbi: number;                    // Necesidades Básicas Insatisfechas (% DANE)
  tasa_analfabetismo: number;     // % población 15+ (DANE Censo)
  ruralidad: number;              // % población en zona rural (DANE)
  valor_agregado_pc: number;      // Valor agregado per cápita (miles COP, DANE cuentas departamentales)
  indice_desempeno_municipal: number; // IDM - DNP (0-100, donde 100 es mejor)
}

export const indicadores: IndicadorMunicipal[] = [
  // === URABÁ ===
  // Urabá presenta indicadores significativamente más bajos que Oriente,
  // reflejando brechas históricas de inversión y conectividad.
  {
    municipio: 'Apartadó', region: 'Urabá',
    poblacion_2024: 210000, ipm: 44.2,
    cobertura_acueducto: 78.3, cobertura_alcantarillado: 62.1,
    cobertura_energia: 96.2, cobertura_gas: 38.5,
    cobertura_internet: 28.4, nbi: 34.8, tasa_analfabetismo: 8.9,
    ruralidad: 25.3, valor_agregado_pc: 8200, indice_desempeno_municipal: 52.1,
  },
  {
    municipio: 'Turbo', region: 'Urabá',
    poblacion_2024: 178000, ipm: 68.5,
    cobertura_acueducto: 42.6, cobertura_alcantarillado: 28.3,
    cobertura_energia: 88.7, cobertura_gas: 12.1,
    cobertura_internet: 14.2, nbi: 62.3, tasa_analfabetismo: 15.7,
    ruralidad: 52.8, valor_agregado_pc: 5100, indice_desempeno_municipal: 35.8,
  },
  {
    municipio: 'Carepa', region: 'Urabá',
    poblacion_2024: 65000, ipm: 51.3,
    cobertura_acueducto: 68.4, cobertura_alcantarillado: 45.2,
    cobertura_energia: 94.1, cobertura_gas: 28.7,
    cobertura_internet: 20.1, nbi: 42.5, tasa_analfabetismo: 10.3,
    ruralidad: 35.6, valor_agregado_pc: 6800, indice_desempeno_municipal: 44.2,
  },
  {
    municipio: 'Chigorodó', region: 'Urabá',
    poblacion_2024: 85000, ipm: 48.7,
    cobertura_acueducto: 72.1, cobertura_alcantarillado: 51.8,
    cobertura_energia: 95.3, cobertura_gas: 32.4,
    cobertura_internet: 22.8, nbi: 38.9, tasa_analfabetismo: 9.6,
    ruralidad: 30.1, valor_agregado_pc: 7100, indice_desempeno_municipal: 46.5,
  },
  {
    municipio: 'Mutatá', region: 'Urabá',
    poblacion_2024: 22000, ipm: 72.4,
    cobertura_acueducto: 35.2, cobertura_alcantarillado: 18.6,
    cobertura_energia: 78.5, cobertura_gas: 4.2,
    cobertura_internet: 8.3, nbi: 68.7, tasa_analfabetismo: 18.2,
    ruralidad: 72.4, valor_agregado_pc: 3900, indice_desempeno_municipal: 28.3,
  },
  {
    municipio: 'Necoclí', region: 'Urabá',
    poblacion_2024: 68000, ipm: 71.8,
    cobertura_acueducto: 28.9, cobertura_alcantarillado: 15.4,
    cobertura_energia: 82.3, cobertura_gas: 5.8,
    cobertura_internet: 10.5, nbi: 65.2, tasa_analfabetismo: 16.8,
    ruralidad: 68.5, valor_agregado_pc: 4200, indice_desempeno_municipal: 30.1,
  },
  {
    municipio: 'San Pedro de Urabá', region: 'Urabá',
    poblacion_2024: 32000, ipm: 69.3,
    cobertura_acueducto: 32.1, cobertura_alcantarillado: 20.5,
    cobertura_energia: 84.6, cobertura_gas: 6.3,
    cobertura_internet: 9.8, nbi: 61.4, tasa_analfabetismo: 15.1,
    ruralidad: 65.3, valor_agregado_pc: 4500, indice_desempeno_municipal: 32.7,
  },
  {
    municipio: 'Arboletes', region: 'Urabá',
    poblacion_2024: 42000, ipm: 65.1,
    cobertura_acueducto: 38.5, cobertura_alcantarillado: 22.8,
    cobertura_energia: 86.9, cobertura_gas: 8.1,
    cobertura_internet: 12.4, nbi: 58.6, tasa_analfabetismo: 14.3,
    ruralidad: 60.2, valor_agregado_pc: 4800, indice_desempeno_municipal: 34.5,
  },
  {
    municipio: 'San Juan de Urabá', region: 'Urabá',
    poblacion_2024: 26000, ipm: 73.6,
    cobertura_acueducto: 25.3, cobertura_alcantarillado: 12.7,
    cobertura_energia: 80.1, cobertura_gas: 3.5,
    cobertura_internet: 7.1, nbi: 70.2, tasa_analfabetismo: 19.4,
    ruralidad: 74.8, valor_agregado_pc: 3600, indice_desempeno_municipal: 26.8,
  },
  // === ORIENTE ANTIOQUEÑO ===
  {
    municipio: 'Rionegro', region: 'Oriente',
    poblacion_2024: 135000, ipm: 12.4,
    cobertura_acueducto: 97.8, cobertura_alcantarillado: 92.5,
    cobertura_energia: 99.6, cobertura_gas: 78.3,
    cobertura_internet: 72.1, nbi: 8.6, tasa_analfabetismo: 3.2,
    ruralidad: 18.5, valor_agregado_pc: 22500, indice_desempeno_municipal: 78.4,
  },
  {
    municipio: 'Guatapé', region: 'Oriente',
    poblacion_2024: 6200, ipm: 22.8,
    cobertura_acueducto: 92.4, cobertura_alcantarillado: 78.6,
    cobertura_energia: 99.1, cobertura_gas: 42.5,
    cobertura_internet: 48.3, nbi: 18.4, tasa_analfabetismo: 5.8,
    ruralidad: 42.3, valor_agregado_pc: 14800, indice_desempeno_municipal: 62.3,
  },
  {
    municipio: 'El Peñol', region: 'Oriente',
    poblacion_2024: 17500, ipm: 25.6,
    cobertura_acueducto: 89.3, cobertura_alcantarillado: 72.4,
    cobertura_energia: 98.8, cobertura_gas: 38.9,
    cobertura_internet: 42.1, nbi: 20.3, tasa_analfabetismo: 6.4,
    ruralidad: 48.6, valor_agregado_pc: 12200, indice_desempeno_municipal: 56.7,
  },
  {
    municipio: 'San Carlos', region: 'Oriente',
    poblacion_2024: 16800, ipm: 38.5,
    cobertura_acueducto: 78.6, cobertura_alcantarillado: 58.3,
    cobertura_energia: 97.2, cobertura_gas: 22.1,
    cobertura_internet: 28.5, nbi: 32.4, tasa_analfabetismo: 9.1,
    ruralidad: 62.8, valor_agregado_pc: 8900, indice_desempeno_municipal: 45.2,
  },
  {
    municipio: 'San Rafael', region: 'Oriente',
    poblacion_2024: 14200, ipm: 36.2,
    cobertura_acueducto: 80.1, cobertura_alcantarillado: 55.7,
    cobertura_energia: 96.8, cobertura_gas: 18.4,
    cobertura_internet: 25.3, nbi: 30.8, tasa_analfabetismo: 8.7,
    ruralidad: 65.4, valor_agregado_pc: 8200, indice_desempeno_municipal: 43.8,
  },
  {
    municipio: 'Granada', region: 'Oriente',
    poblacion_2024: 10500, ipm: 35.8,
    cobertura_acueducto: 82.4, cobertura_alcantarillado: 60.2,
    cobertura_energia: 97.5, cobertura_gas: 20.8,
    cobertura_internet: 26.8, nbi: 29.6, tasa_analfabetismo: 8.2,
    ruralidad: 60.1, valor_agregado_pc: 9100, indice_desempeno_municipal: 46.8,
  },
  {
    municipio: 'Marinilla', region: 'Oriente',
    poblacion_2024: 58000, ipm: 15.8,
    cobertura_acueducto: 96.2, cobertura_alcantarillado: 88.4,
    cobertura_energia: 99.4, cobertura_gas: 68.5,
    cobertura_internet: 62.4, nbi: 11.2, tasa_analfabetismo: 3.8,
    ruralidad: 22.4, valor_agregado_pc: 18500, indice_desempeno_municipal: 72.1,
  },
  {
    municipio: 'El Retiro', region: 'Oriente',
    poblacion_2024: 20500, ipm: 14.2,
    cobertura_acueducto: 95.8, cobertura_alcantarillado: 85.3,
    cobertura_energia: 99.3, cobertura_gas: 62.4,
    cobertura_internet: 58.6, nbi: 10.4, tasa_analfabetismo: 3.5,
    ruralidad: 38.2, valor_agregado_pc: 19800, indice_desempeno_municipal: 74.5,
  },
  {
    municipio: 'La Ceja', region: 'Oriente',
    poblacion_2024: 55000, ipm: 13.6,
    cobertura_acueducto: 97.1, cobertura_alcantarillado: 90.8,
    cobertura_energia: 99.5, cobertura_gas: 72.8,
    cobertura_internet: 65.2, nbi: 9.8, tasa_analfabetismo: 3.4,
    ruralidad: 20.1, valor_agregado_pc: 20100, indice_desempeno_municipal: 75.8,
  },
  {
    municipio: 'El Carmen de Viboral', region: 'Oriente',
    poblacion_2024: 48000, ipm: 20.4,
    cobertura_acueducto: 91.5, cobertura_alcantarillado: 78.2,
    cobertura_energia: 98.9, cobertura_gas: 48.6,
    cobertura_internet: 45.8, nbi: 16.8, tasa_analfabetismo: 5.2,
    ruralidad: 42.6, valor_agregado_pc: 14200, indice_desempeno_municipal: 60.4,
  },
  {
    municipio: 'Cocorná', region: 'Oriente',
    poblacion_2024: 16000, ipm: 42.1,
    cobertura_acueducto: 72.4, cobertura_alcantarillado: 48.6,
    cobertura_energia: 96.4, cobertura_gas: 12.8,
    cobertura_internet: 18.5, nbi: 36.2, tasa_analfabetismo: 10.4,
    ruralidad: 68.5, valor_agregado_pc: 7500, indice_desempeno_municipal: 40.2,
  },
  {
    municipio: 'San Luis', region: 'Oriente',
    poblacion_2024: 12000, ipm: 45.8,
    cobertura_acueducto: 68.5, cobertura_alcantarillado: 42.3,
    cobertura_energia: 95.2, cobertura_gas: 8.5,
    cobertura_internet: 15.2, nbi: 39.4, tasa_analfabetismo: 11.8,
    ruralidad: 72.3, valor_agregado_pc: 6800, indice_desempeno_municipal: 37.5,
  },
  {
    municipio: 'Guarne', region: 'Oriente',
    poblacion_2024: 52000, ipm: 16.2,
    cobertura_acueducto: 94.8, cobertura_alcantarillado: 84.6,
    cobertura_energia: 99.2, cobertura_gas: 65.2,
    cobertura_internet: 58.4, nbi: 12.4, tasa_analfabetismo: 4.1,
    ruralidad: 32.5, valor_agregado_pc: 17800, indice_desempeno_municipal: 70.3,
  },
  {
    municipio: 'Sonsón', region: 'Oriente',
    poblacion_2024: 38000, ipm: 38.9,
    cobertura_acueducto: 76.8, cobertura_alcantarillado: 56.4,
    cobertura_energia: 96.8, cobertura_gas: 18.2,
    cobertura_internet: 22.4, nbi: 32.8, tasa_analfabetismo: 9.6,
    ruralidad: 58.4, valor_agregado_pc: 9500, indice_desempeno_municipal: 47.2,
  },
  {
    municipio: 'San Vicente', region: 'Oriente',
    poblacion_2024: 18500, ipm: 32.4,
    cobertura_acueducto: 84.2, cobertura_alcantarillado: 62.8,
    cobertura_energia: 97.6, cobertura_gas: 25.4,
    cobertura_internet: 30.2, nbi: 27.6, tasa_analfabetismo: 7.8,
    ruralidad: 55.8, valor_agregado_pc: 10200, indice_desempeno_municipal: 50.1,
  },
  {
    municipio: 'Argelia', region: 'Oriente',
    poblacion_2024: 9800, ipm: 52.6,
    cobertura_acueducto: 58.4, cobertura_alcantarillado: 32.5,
    cobertura_energia: 92.8, cobertura_gas: 5.2,
    cobertura_internet: 10.8, nbi: 48.5, tasa_analfabetismo: 13.8,
    ruralidad: 78.2, valor_agregado_pc: 5200, indice_desempeno_municipal: 32.4,
  },
];

/** Promedios por región */
export function getPromedioRegion(region: 'Urabá' | 'Oriente') {
  const data = indicadores.filter(i => i.region === region);
  const n = data.length;
  if (n === 0) return null;
  const sum = (fn: (i: IndicadorMunicipal) => number) => data.reduce((s, i) => s + fn(i), 0) / n;
  return {
    ipm: sum(i => i.ipm),
    cobertura_acueducto: sum(i => i.cobertura_acueducto),
    cobertura_alcantarillado: sum(i => i.cobertura_alcantarillado),
    cobertura_energia: sum(i => i.cobertura_energia),
    cobertura_gas: sum(i => i.cobertura_gas),
    cobertura_internet: sum(i => i.cobertura_internet),
    nbi: sum(i => i.nbi),
    ruralidad: sum(i => i.ruralidad),
    poblacion_total: data.reduce((s, i) => s + i.poblacion_2024, 0),
  };
}
