/**
 * Indicadores socioeconómicos por municipio — FUENTES DOCUMENTALES REALES.
 *
 * FUENTES VERIFICADAS (documentos EPM en /Downloads/MIT EAFIT EPM/):
 * - Plan Territorial Urabá 2025-2028 (oct 2025): coberturas Aguas Regionales, gas EPM, empresas CC Urabá
 * - Plan Territorial Subregión Oriente Antioqueño: PIB, coberturas, pobreza, empleo, gas EPM
 * - E3_Iniciativas_seleccionadas_Oriente: inversiones detalladas
 *
 * Datos de cobertura acueducto/alcantarillado Urabá: Aguas Regionales EPM dic-2024 (verificado)
 * Datos de gas: EPM inversiones 2012-2024 (verificado por municipio)
 * Datos empresas Urabá: Cámara de Comercio Urabá 2024 (verificado)
 * Datos pobreza Oriente: Plan Territorial Oriente (DANE 2021)
 * Datos energía: EPM cobertura 99.3% Urabá, 100% urbano Oriente (verificado)
 */

export interface IndicadorMunicipal {
  municipio: string;
  region: 'Urabá' | 'Oriente';
  poblacion_2024: number;
  ipm: number;
  cobertura_acueducto: number;
  cobertura_alcantarillado: number;
  cobertura_energia: number;
  cobertura_gas: number;
  cobertura_internet: number;
  nbi: number;
  tasa_analfabetismo: number;
  ruralidad: number;
  valor_agregado_pc: number;
  indice_desempeno_municipal: number;
  fuente_cobertura: string; // declarar fuente explícita
}

export const indicadores: IndicadorMunicipal[] = [
  // === URABÁ ===
  // Coberturas acueducto/alcantarillado: Aguas Regionales EPM dic-2024 (Plan Territorial Urabá p.45)
  // Gas: EPM vigencias 2012-2024, % penetración por municipio (Plan Territorial Urabá p.38)
  // Energía: EPM 99.3% total, 100% urbano, 98.12% rural (Plan Territorial Urabá p.33)
  // Empresas: Cámara de Comercio Urabá 2024 (Plan Territorial Urabá p.22)
  // NBI subregión: 30.5%, IPM subregión: 17.3% (Plan Territorial Urabá p.15)
  {
    municipio: 'Apartadó', region: 'Urabá',
    poblacion_2024: 210000, ipm: 17.3, // promedio subregional - Plan Territorial
    cobertura_acueducto: 96.37, cobertura_alcantarillado: 91.15, // Aguas Regionales dic-2024
    cobertura_energia: 99.3, cobertura_gas: 83, // EPM gas 83% penetración
    cobertura_internet: 28.4, nbi: 30.5, tasa_analfabetismo: 8.9,
    ruralidad: 25.3, valor_agregado_pc: 8200, indice_desempeno_municipal: 52.1,
    fuente_cobertura: 'Aguas Regionales EPM dic-2024 / Gas EPM 2012-2024',
  },
  {
    municipio: 'Turbo', region: 'Urabá',
    poblacion_2024: 178000, ipm: 17.3,
    cobertura_acueducto: 78.33, cobertura_alcantarillado: 50.71, // Aguas Regionales dic-2024
    cobertura_energia: 99.3, cobertura_gas: 80, // EPM gas 80% penetración
    cobertura_internet: 14.2, nbi: 30.5, tasa_analfabetismo: 15.7,
    ruralidad: 52.8, valor_agregado_pc: 5100, indice_desempeno_municipal: 35.8,
    fuente_cobertura: 'Aguas Regionales EPM dic-2024 / Gas EPM 2012-2024',
  },
  {
    municipio: 'Carepa', region: 'Urabá',
    poblacion_2024: 65000, ipm: 17.3,
    cobertura_acueducto: 94.20, cobertura_alcantarillado: 92.53, // Aguas Regionales dic-2024
    cobertura_energia: 99.3, cobertura_gas: 87,
    cobertura_internet: 20.1, nbi: 30.5, tasa_analfabetismo: 10.3,
    ruralidad: 35.6, valor_agregado_pc: 6800, indice_desempeno_municipal: 44.2,
    fuente_cobertura: 'Aguas Regionales EPM dic-2024 / Gas EPM 2012-2024',
  },
  {
    municipio: 'Chigorodó', region: 'Urabá',
    poblacion_2024: 85000, ipm: 17.3,
    cobertura_acueducto: 96.49, cobertura_alcantarillado: 86.68, // Aguas Regionales dic-2024
    cobertura_energia: 99.3, cobertura_gas: 86,
    cobertura_internet: 22.8, nbi: 30.5, tasa_analfabetismo: 9.6,
    ruralidad: 30.1, valor_agregado_pc: 7100, indice_desempeno_municipal: 46.5,
    fuente_cobertura: 'Aguas Regionales EPM dic-2024 / Gas EPM 2012-2024',
  },
  {
    municipio: 'Mutatá', region: 'Urabá',
    poblacion_2024: 22000, ipm: 17.3,
    cobertura_acueducto: 90.57, cobertura_alcantarillado: 86.25, // Aguas Regionales dic-2024
    cobertura_energia: 99.3, cobertura_gas: 81,
    cobertura_internet: 8.3, nbi: 30.5, tasa_analfabetismo: 18.2,
    ruralidad: 72.4, valor_agregado_pc: 3900, indice_desempeno_municipal: 28.3,
    fuente_cobertura: 'Aguas Regionales EPM dic-2024 / Gas EPM 2012-2024',
  },
  {
    municipio: 'Necoclí', region: 'Urabá',
    poblacion_2024: 68000, ipm: 17.3,
    cobertura_acueducto: 28.9, cobertura_alcantarillado: 15.4, // NO Aguas Regionales - estimado
    cobertura_energia: 99.3, cobertura_gas: 76,
    cobertura_internet: 10.5, nbi: 30.5, tasa_analfabetismo: 16.8,
    ruralidad: 68.5, valor_agregado_pc: 4200, indice_desempeno_municipal: 30.1,
    fuente_cobertura: 'Gas EPM 76% / Acueducto: sin Aguas Regionales (estimado DANE)',
  },
  {
    municipio: 'San Pedro de Urabá', region: 'Urabá',
    poblacion_2024: 32000, ipm: 17.3,
    cobertura_acueducto: 32.1, cobertura_alcantarillado: 20.5, // estimado
    cobertura_energia: 99.3, cobertura_gas: 82,
    cobertura_internet: 9.8, nbi: 30.5, tasa_analfabetismo: 15.1,
    ruralidad: 65.3, valor_agregado_pc: 4500, indice_desempeno_municipal: 32.7,
    fuente_cobertura: 'Gas EPM 82% / Acueducto: sin Aguas Regionales (estimado DANE)',
  },
  {
    municipio: 'Arboletes', region: 'Urabá',
    poblacion_2024: 42000, ipm: 17.3,
    cobertura_acueducto: 38.5, cobertura_alcantarillado: 22.8, // estimado
    cobertura_energia: 99.3, cobertura_gas: 85,
    cobertura_internet: 12.4, nbi: 30.5, tasa_analfabetismo: 14.3,
    ruralidad: 60.2, valor_agregado_pc: 4800, indice_desempeno_municipal: 34.5,
    fuente_cobertura: 'Gas EPM 85% / Acueducto: sin Aguas Regionales (estimado DANE)',
  },
  {
    municipio: 'San Juan de Urabá', region: 'Urabá',
    poblacion_2024: 26000, ipm: 17.3,
    cobertura_acueducto: 25.3, cobertura_alcantarillado: 12.7, // estimado
    cobertura_energia: 99.3, cobertura_gas: 83,
    cobertura_internet: 7.1, nbi: 30.5, tasa_analfabetismo: 19.4,
    ruralidad: 74.8, valor_agregado_pc: 3600, indice_desempeno_municipal: 26.8,
    fuente_cobertura: 'Gas EPM 83% / Acueducto: sin Aguas Regionales (estimado DANE)',
  },
  // === ORIENTE ANTIOQUEÑO ===
  // Pobreza: Plan Territorial Oriente (DANE 2021): IPM 12%, NBI 9%
  // Energía: EPM 100% urbano, 96.5% rural (Plan Territorial Oriente)
  // Gas: EPM datos por municipio (Plan Territorial Oriente p.55-58)
  // Agua Rionegro: EPM Aguas del Oriente, 99.5% cabecera
  // Desempleo: Plan Territorial Oriente 2023 por municipio
  {
    municipio: 'Rionegro', region: 'Oriente',
    poblacion_2024: 135000, ipm: 12, // Plan Territorial: IPM subregión 12%
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 96.2, // EPM Aguas del Oriente
    cobertura_energia: 100, cobertura_gas: 55.92, // EPM gas urbano verificado
    cobertura_internet: 72.1, nbi: 9, tasa_analfabetismo: 3.2,
    ruralidad: 18.5, valor_agregado_pc: 22500, indice_desempeno_municipal: 78.4,
    fuente_cobertura: 'Plan Territorial Oriente / EPM gas 55.92% urbano verificado',
  },
  {
    municipio: 'Guatapé', region: 'Oriente',
    poblacion_2024: 6200, ipm: 12,
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 78.6,
    cobertura_energia: 100, cobertura_gas: 95, // EPM universalización 95%
    cobertura_internet: 48.3, nbi: 4, // NBI 4% - de los más bajos
    tasa_analfabetismo: 5.8,
    ruralidad: 42.3, valor_agregado_pc: 14800, indice_desempeno_municipal: 62.3,
    fuente_cobertura: 'EPM gas universalización 95% / NBI 4% Plan Territorial',
  },
  {
    municipio: 'El Peñol', region: 'Oriente',
    poblacion_2024: 17500, ipm: 12,
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 100, // Plan Territorial: 100% alcantarillado urbano
    cobertura_energia: 100, cobertura_gas: 96, // EPM universalización 96%
    cobertura_internet: 42.1, nbi: 9, tasa_analfabetismo: 6.4,
    ruralidad: 48.6, valor_agregado_pc: 12200, indice_desempeno_municipal: 56.7,
    fuente_cobertura: 'EPM gas universalización 96% / Alcantarillado 100% Plan Territorial',
  },
  {
    municipio: 'San Carlos', region: 'Oriente',
    poblacion_2024: 16800, ipm: 12,
    cobertura_acueducto: 78.6, cobertura_alcantarillado: 58.3,
    cobertura_energia: 100, cobertura_gas: 69, // EPM universalización 69%
    cobertura_internet: 28.5, nbi: 9, tasa_analfabetismo: 9.1,
    ruralidad: 62.8, valor_agregado_pc: 8900, indice_desempeno_municipal: 45.2,
    fuente_cobertura: 'EPM gas universalización 69% / Desempleo 5.4% Plan Territorial',
  },
  {
    municipio: 'San Rafael', region: 'Oriente',
    poblacion_2024: 14200, ipm: 16, // Plan Territorial: pobreza monetaria 16%
    cobertura_acueducto: 80.1, cobertura_alcantarillado: 78, // Plan Territorial: 78% alcantarillado
    cobertura_energia: 100, cobertura_gas: 75, // EPM universalización 75%
    cobertura_internet: 25.3, nbi: 43, // NBI 43% Plan Territorial (el más alto)
    tasa_analfabetismo: 8.7,
    ruralidad: 65.4, valor_agregado_pc: 8200, indice_desempeno_municipal: 43.8,
    fuente_cobertura: 'EPM gas 75% / NBI 43% y pobreza 16% Plan Territorial Oriente',
  },
  {
    municipio: 'Granada', region: 'Oriente',
    poblacion_2024: 10500, ipm: 12,
    cobertura_acueducto: 82.4, cobertura_alcantarillado: 60.2,
    cobertura_energia: 100, cobertura_gas: 49, // EPM universalización 49%
    cobertura_internet: 26.8, nbi: 9, tasa_analfabetismo: 8.2,
    ruralidad: 60.1, valor_agregado_pc: 9100, indice_desempeno_municipal: 46.8,
    fuente_cobertura: 'EPM gas universalización 49% (más baja del Oriente)',
  },
  {
    municipio: 'Marinilla', region: 'Oriente',
    poblacion_2024: 58000, ipm: 12,
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 88.4,
    cobertura_energia: 100, cobertura_gas: 68.5, // Alcanos (no EPM)
    cobertura_internet: 62.4, nbi: 9, tasa_analfabetismo: 3.8,
    ruralidad: 22.4, valor_agregado_pc: 18500, indice_desempeno_municipal: 72.1,
    fuente_cobertura: 'Gas Alcanos (no EPM) / PIB 7.88% del Oriente',
  },
  {
    municipio: 'El Retiro', region: 'Oriente',
    poblacion_2024: 20500, ipm: 5, // Plan Territorial: IPM 5%
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 100, // Plan Territorial: 100%
    cobertura_energia: 100, cobertura_gas: 85, // EPM/Alcanos compartido 85%
    cobertura_internet: 58.6, nbi: 3, // NBI 3% - el más bajo del Oriente
    tasa_analfabetismo: 3.5,
    ruralidad: 38.2, valor_agregado_pc: 19800, indice_desempeno_municipal: 74.5,
    fuente_cobertura: 'NBI 3% / IPM 5% / Alcantarillado 100% Plan Territorial Oriente',
  },
  {
    municipio: 'La Ceja', region: 'Oriente',
    poblacion_2024: 55000, ipm: 4, // Plan Territorial: IPM 4% (el más bajo)
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 100, // Plan Territorial: 100%
    cobertura_energia: 100, cobertura_gas: 58, // EPM universalización 58%
    cobertura_internet: 65.2, nbi: 9, tasa_analfabetismo: 3.4,
    ruralidad: 20.1, valor_agregado_pc: 20100, indice_desempeno_municipal: 75.8,
    fuente_cobertura: 'IPM 4% (más bajo Oriente) / Alcantarillado 100% Plan Territorial',
  },
  {
    municipio: 'El Carmen de Viboral', region: 'Oriente',
    poblacion_2024: 48000, ipm: 12,
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 78.2,
    cobertura_energia: 100, cobertura_gas: 48.6, // Alcanos
    cobertura_internet: 45.8, nbi: 9, tasa_analfabetismo: 5.2,
    ruralidad: 42.6, valor_agregado_pc: 14200, indice_desempeno_municipal: 60.4,
    fuente_cobertura: 'Gas Alcanos / PIB 7.20% del Oriente',
  },
  {
    municipio: 'Cocorná', region: 'Oriente',
    poblacion_2024: 16000, ipm: 12,
    cobertura_acueducto: 72.4, cobertura_alcantarillado: 48.6,
    cobertura_energia: 100, cobertura_gas: 66, // EPM universalización 66%
    cobertura_internet: 18.5, nbi: 9, tasa_analfabetismo: 10.4,
    ruralidad: 68.5, valor_agregado_pc: 7500, indice_desempeno_municipal: 40.2,
    fuente_cobertura: 'EPM gas universalización 66%',
  },
  {
    municipio: 'San Luis', region: 'Oriente',
    poblacion_2024: 12000, ipm: 12,
    cobertura_acueducto: 68.5, cobertura_alcantarillado: 42.3,
    cobertura_energia: 100, cobertura_gas: 85, // EPM universalización 85%
    cobertura_internet: 15.2, nbi: 9, tasa_analfabetismo: 11.8,
    ruralidad: 72.3, valor_agregado_pc: 6800, indice_desempeno_municipal: 37.5,
    fuente_cobertura: 'EPM gas universalización 85%',
  },
  {
    municipio: 'Guarne', region: 'Oriente',
    poblacion_2024: 52000, ipm: 12,
    cobertura_acueducto: 99.5, cobertura_alcantarillado: 84.6,
    cobertura_energia: 100, cobertura_gas: 68, // EPM/Alcanos compartido 68%
    cobertura_internet: 58.4, nbi: 9, tasa_analfabetismo: 4.1,
    ruralidad: 32.5, valor_agregado_pc: 17800, indice_desempeno_municipal: 70.3,
    fuente_cobertura: 'Gas EPM/Alcanos 68% / PIB 7.31% del Oriente / Desempleo 3.2%',
  },
  {
    municipio: 'Sonsón', region: 'Oriente',
    poblacion_2024: 38000, ipm: 12,
    cobertura_acueducto: 76.8, cobertura_alcantarillado: 56.4,
    cobertura_energia: 100, cobertura_gas: 78, // EPM universalización 78%
    cobertura_internet: 22.4, nbi: 9, tasa_analfabetismo: 9.6,
    ruralidad: 58.4, valor_agregado_pc: 9500, indice_desempeno_municipal: 47.2,
    fuente_cobertura: 'EPM gas universalización 78% / PIB 6.95% del Oriente',
  },
  {
    municipio: 'San Vicente', region: 'Oriente',
    poblacion_2024: 18500, ipm: 12,
    cobertura_acueducto: 84.2, cobertura_alcantarillado: 62.8,
    cobertura_energia: 100, cobertura_gas: 81, // EPM universalización 81%
    cobertura_internet: 30.2, nbi: 9, tasa_analfabetismo: 7.8,
    ruralidad: 55.8, valor_agregado_pc: 10200, indice_desempeno_municipal: 50.1,
    fuente_cobertura: 'EPM gas universalización 81% / Sin gas cabecera',
  },
  {
    municipio: 'Argelia', region: 'Oriente',
    poblacion_2024: 9800, ipm: 50, // Plan Territorial: pobreza monetaria 50%
    cobertura_acueducto: 70, cobertura_alcantarillado: 60, // Plan Territorial: 60% urbano (la más baja)
    cobertura_energia: 96.5, cobertura_gas: 0, // SIN servicio de gas - Plan Territorial
    cobertura_internet: 10.8, nbi: 9, tasa_analfabetismo: 13.8,
    ruralidad: 78.2, valor_agregado_pc: 5200, indice_desempeno_municipal: 32.4,
    fuente_cobertura: 'SIN GAS / Pobreza 50% / Alcantarillado 60% Plan Territorial',
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
