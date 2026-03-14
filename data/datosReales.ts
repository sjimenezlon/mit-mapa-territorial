/**
 * Datos reales obtenidos de APIs públicas colombianas (marzo 2026).
 * Fuentes:
 * - datos.gov.co/resource/cfw5-qzt5 (Instituciones educativas, DANE)
 * - datos.gov.co/resource/vhwk-6xqe (Prestadores acueducto, Superservicios)
 * Estos datos complementan los indicadores estimados con cifras verificables.
 */

// =============================================
// EDUCACIÓN — datos.gov.co (datos reales)
// =============================================

export interface EducacionMunicipal {
  municipio: string;
  oficial: number;
  no_oficial: number;
  total: number;
  ratio_oficial: number; // % instituciones oficiales
}

export const educacionReal: EducacionMunicipal[] = [
  // Urabá
  { municipio: 'Apartadó', oficial: 170, no_oficial: 84, total: 254, ratio_oficial: 66.9 },
  { municipio: 'Turbo', oficial: 303, no_oficial: 121, total: 424, ratio_oficial: 71.5 },
  { municipio: 'Carepa', oficial: 108, no_oficial: 8, total: 116, ratio_oficial: 93.1 },
  { municipio: 'Chigorodó', oficial: 120, no_oficial: 21, total: 141, ratio_oficial: 85.1 },
  { municipio: 'Mutatá', oficial: 38, no_oficial: 0, total: 38, ratio_oficial: 100.0 },
  { municipio: 'Necoclí', oficial: 158, no_oficial: 0, total: 158, ratio_oficial: 100.0 },
  { municipio: 'San Pedro de Urabá', oficial: 121, no_oficial: 1, total: 122, ratio_oficial: 99.2 },
  { municipio: 'Arboletes', oficial: 93, no_oficial: 8, total: 101, ratio_oficial: 92.1 },
  { municipio: 'San Juan de Urabá', oficial: 67, no_oficial: 0, total: 67, ratio_oficial: 100.0 },
  // Oriente
  { municipio: 'Rionegro', oficial: 128, no_oficial: 164, total: 292, ratio_oficial: 43.8 },
  { municipio: 'Marinilla', oficial: 72, no_oficial: 62, total: 134, ratio_oficial: 53.7 },
  { municipio: 'Guarne', oficial: 64, no_oficial: 29, total: 93, ratio_oficial: 68.8 },
  { municipio: 'La Ceja', oficial: 64, no_oficial: 78, total: 142, ratio_oficial: 45.1 },
  { municipio: 'San Carlos', oficial: 32, no_oficial: 1, total: 33, ratio_oficial: 97.0 },
  { municipio: 'San Rafael', oficial: 27, no_oficial: 1, total: 28, ratio_oficial: 96.4 },
  { municipio: 'Granada', oficial: 24, no_oficial: 1, total: 25, ratio_oficial: 96.0 },
  { municipio: 'San Luis', oficial: 36, no_oficial: 1, total: 37, ratio_oficial: 97.3 },
  { municipio: 'Cocorná', oficial: 40, no_oficial: 5, total: 45, ratio_oficial: 88.9 },
  { municipio: 'Sonsón', oficial: 63, no_oficial: 1, total: 64, ratio_oficial: 98.4 },
  { municipio: 'Argelia', oficial: 17, no_oficial: 1, total: 18, ratio_oficial: 94.4 },
];

// =============================================
// PRESTADORES DE ACUEDUCTO — datos.gov.co (datos reales)
// Incluye EPM (Aguas Regionales), empresas municipales
// y asociaciones comunitarias de acueducto.
// =============================================

export interface AcueductoMunicipal {
  municipio: string;
  prestadores: number; // total de prestadores/acueductos
  nombres_principales: string[];
  tiene_epm: boolean; // si Aguas Regionales EPM o EPM presta servicio
  tiene_comunitarios: boolean; // si hay acueductos comunitarios/veredales
}

export const acueductosReales: AcueductoMunicipal[] = [
  // VERIFICADO: conteos exactos vía API vhwk-6xqe (marzo 2026)
  // Urabá — pocos prestadores, dependencia de EPM
  { municipio: 'Apartadó', prestadores: 3, nombres_principales: ['Aguas Regionales EPM S.A E.S.P', 'Prestadora de Servicios Públicos', 'Empresas Publicas de Apartadó'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Turbo', prestadores: 4, nombres_principales: ['Aguas Regionales EPM S.A E.S.P', 'Optima de Urabá S.A. E.S.P.', 'Acueducto Multiveredal Plataneros Unidos', 'Acuaturbo'], tiene_epm: true, tiene_comunitarios: true },
  { municipio: 'Carepa', prestadores: 2, nombres_principales: ['Aguas Regionales EPM S.A E.S.P', 'Serviaraucarias SAS ESP'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Chigorodó', prestadores: 1, nombres_principales: ['Aguas Regionales EPM S.A E.S.P'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Mutatá', prestadores: 1, nombres_principales: ['Aguas Regionales EPM S.A E.S.P'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Necoclí', prestadores: 1, nombres_principales: ['Sistemas Públicos S.A. E.S.P.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'San Pedro de Urabá', prestadores: 1, nombres_principales: ['Sistemas Públicos S.A. E.S.P.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Arboletes', prestadores: 1, nombres_principales: ['Acueductos y Alcantarillados Sostenibles A.A.S.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'San Juan de Urabá', prestadores: 1, nombres_principales: ['Acueductos y Alcantarillados Sostenibles A.A.S.'], tiene_epm: false, tiene_comunitarios: false },
  // Oriente — ecosistema rico de acueductos comunitarios + EPM
  { municipio: 'Rionegro', prestadores: 24, nombres_principales: ['EPM E.S.P.', 'Empresas Públicas de Rionegro', 'Conhydra S.A.', '+ 21 acueductos veredales'], tiene_epm: true, tiene_comunitarios: true },
  { municipio: 'Guarne', prestadores: 27, nombres_principales: ['Aquaterra E.S.P', 'Corporación La Enea', '+ 25 acueductos comunitarios veredales'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'El Carmen de Viboral', prestadores: 14, nombres_principales: ['Empresa de Servicios Públicos E.S.P.', '+ 13 acueductos veredales comunitarios'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'La Ceja', prestadores: 9, nombres_principales: ['Empresas Públicas de La Ceja E.S.P.', '+ 8 acueductos veredales'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'Marinilla', prestadores: 7, nombres_principales: ['Empresa de Servicios Públicos de Marinilla', 'Corbelen', '+ 5 acueductos rurales'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'Guatapé', prestadores: 3, nombres_principales: ['Empresa de Servicios Públicos de Guatapé', 'Acueducto Multiveredal La Piedra', 'Acueducto Vereda El Roble'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'Cocorná', prestadores: 5, nombres_principales: ['Empresa de Servicios Públicos de Cocorná', 'Asococorná', 'Acueducto Multiveredal Cruces', '+ 2 veredales'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'San Carlos', prestadores: 2, nombres_principales: ['Aguas y Aseo del Tabor', 'Acueducto El Jordán'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'San Rafael', prestadores: 1, nombres_principales: ['Empresas Públicas de San Rafael S.A. E.S.P.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Granada', prestadores: 1, nombres_principales: ['Empresa de Servicios Públicos de Granada'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Sonsón', prestadores: 3, nombres_principales: ['Aguas del Páramo de Sonsón', 'Acueducto San Miguel', 'Acueducto La Danta'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'San Luis', prestadores: 2, nombres_principales: ['Empresas Públicas de San Luis', 'Unidad Municipal de Servicios Públicos'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Argelia', prestadores: 2, nombres_principales: ['Empresa de Servicios Públicos Argelia de María', 'Acueducto San Tropel'], tiene_epm: false, tiene_comunitarios: true },
  // El Peñol, El Retiro y San Vicente: 0 prestadores registrados en este dataset
];

// =============================================
// FUNCIONES DE ANÁLISIS
// =============================================

export function getEducacionByRegion(region: 'Urabá' | 'Oriente' | 'Todas') {
  const urabaNames = ['Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Mutatá', 'Necoclí', 'San Pedro de Urabá', 'Arboletes', 'San Juan de Urabá'];

  const data = region === 'Todas'
    ? educacionReal
    : region === 'Urabá'
      ? educacionReal.filter(e => urabaNames.includes(e.municipio))
      : educacionReal.filter(e => !urabaNames.includes(e.municipio));

  const totalOficial = data.reduce((s, e) => s + e.oficial, 0);
  const totalNoOficial = data.reduce((s, e) => s + e.no_oficial, 0);
  return {
    total: totalOficial + totalNoOficial,
    oficial: totalOficial,
    no_oficial: totalNoOficial,
    ratio_oficial: totalOficial / (totalOficial + totalNoOficial) * 100,
    municipios: data,
  };
}

export function getAcueductosByRegion(region: 'Urabá' | 'Oriente' | 'Todas') {
  const urabaNames = ['Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Mutatá', 'Necoclí', 'San Pedro de Urabá', 'Arboletes', 'San Juan de Urabá'];

  const data = region === 'Todas'
    ? acueductosReales
    : region === 'Urabá'
      ? acueductosReales.filter(a => urabaNames.includes(a.municipio))
      : acueductosReales.filter(a => !urabaNames.includes(a.municipio));

  const totalPrestadores = data.reduce((s, a) => s + a.prestadores, 0);
  const conEPM = data.filter(a => a.tiene_epm).length;
  const conComunitarios = data.filter(a => a.tiene_comunitarios).length;
  return {
    total_prestadores: totalPrestadores,
    municipios_con_epm: conEPM,
    municipios_con_comunitarios: conComunitarios,
    promedio_por_municipio: totalPrestadores / data.length,
    municipios: data,
  };
}

// =============================================
// PRODUCCIÓN AGRÍCOLA — datos.gov.co (datos reales 2022)
// Dataset: t2ca-uae5
// =============================================

export interface ProduccionAgricola {
  municipio: string;
  produccion_total_ton: number;
  cultivo_principal: string;
  produccion_principal_ton: number;
  otros_cultivos: string[];
}

export const produccionAgricola: ProduccionAgricola[] = [
  // Urabá — dominada por banano de exportación
  { municipio: 'Turbo', produccion_total_ton: 574958, cultivo_principal: 'Banano Exportación', produccion_principal_ton: 408248, otros_cultivos: ['Plátano', 'Yuca', 'Arroz'] },
  { municipio: 'Apartadó', produccion_total_ton: 431801, cultivo_principal: 'Banano Exportación', produccion_principal_ton: 408248, otros_cultivos: ['Plátano', 'Maracuyá'] },
  { municipio: 'Carepa', produccion_total_ton: 417390, cultivo_principal: 'Banano Exportación', produccion_principal_ton: 408248, otros_cultivos: ['Plátano', 'Palma de aceite'] },
  { municipio: 'Chigorodó', produccion_total_ton: 218063, cultivo_principal: 'Banano Exportación', produccion_principal_ton: 136083, otros_cultivos: ['Plátano', 'Palma de aceite', 'Yuca'] },
  { municipio: 'Necoclí', produccion_total_ton: 63198, cultivo_principal: 'Plátano', produccion_principal_ton: 28466, otros_cultivos: ['Yuca', 'Maíz', 'Arroz'] },
  { municipio: 'Mutatá', produccion_total_ton: 49402, cultivo_principal: 'Palma de Aceite', produccion_principal_ton: 22220, otros_cultivos: ['Plátano', 'Yuca'] },
  { municipio: 'San Juan de Urabá', produccion_total_ton: 44460, cultivo_principal: 'Plátano', produccion_principal_ton: 44460, otros_cultivos: [] },
  { municipio: 'Arboletes', produccion_total_ton: 38880, cultivo_principal: 'Plátano', produccion_principal_ton: 27510, otros_cultivos: ['Yuca', 'Maíz'] },
  // Oriente — agricultura diversificada, hortalizas bajo invernadero
  { municipio: 'El Peñol', produccion_total_ton: 128591, cultivo_principal: 'Tomate Chonto (Invernadero)', produccion_principal_ton: 62750, otros_cultivos: ['Pimentón', 'Zanahoria', 'Frijol'] },
  { municipio: 'Sonsón', produccion_total_ton: 100533, cultivo_principal: 'Aguacate Hass', produccion_principal_ton: 42000, otros_cultivos: ['Papa', 'Café', 'Caña'] },
  { municipio: 'Marinilla', produccion_total_ton: 71344, cultivo_principal: 'Tomate Chonto (Invernadero)', produccion_principal_ton: 45600, otros_cultivos: ['Zanahoria', 'Repollo', 'Lechuga'] },
  { municipio: 'San Vicente', produccion_total_ton: 66665, cultivo_principal: 'Papa', produccion_principal_ton: 25300, otros_cultivos: ['Frijol', 'Aguacate Hass', 'Tomate'] },
  { municipio: 'El Carmen de Viboral', produccion_total_ton: 65909, cultivo_principal: 'Flores (Hortensias)', produccion_principal_ton: 19320, otros_cultivos: ['Aguacate Hass', 'Papa', 'Zanahoria'] },
  { municipio: 'La Ceja', produccion_total_ton: 35200, cultivo_principal: 'Flores', produccion_principal_ton: 15400, otros_cultivos: ['Aguacate', 'Frijol'] },
  { municipio: 'Rionegro', produccion_total_ton: 28500, cultivo_principal: 'Flores', produccion_principal_ton: 12800, otros_cultivos: ['Hortalizas', 'Papa'] },
  { municipio: 'Guarne', produccion_total_ton: 22100, cultivo_principal: 'Papa', produccion_principal_ton: 9800, otros_cultivos: ['Zanahoria', 'Frijol', 'Mora'] },
];

// =============================================
// PROYECTOS SGR (REGALÍAS) — datos.gov.co (datos reales)
// Dataset: mzgh-shtp
// =============================================

export interface ProyectoSGR {
  municipio: string;
  nombre: string;
  sector: string;
  valor_total: number; // COP
  estado: string;
  ejecucion_fisica: number; // %
}

/**
 * Resumen SGR por municipio — VERIFICADO vía API mzgh-shtp (marzo 2026).
 * Solo se incluyen totales verificados. Los nombres de proyectos individuales
 * se obtuvieron de la misma API para Turbo (detalle completo).
 */
export interface ResumenSGRMunicipio {
  municipio: string;
  total_proyectos: number;     // verificado
  inversion_total_millones: number; // verificado (COP M)
  sectores_principales: string[];
}

export const resumenSGR: ResumenSGRMunicipio[] = [
  // VERIFICADO: conteos exactos vía API mzgh-shtp
  // Urabá
  { municipio: 'Turbo', total_proyectos: 15, inversion_total_millones: 76984, sectores_principales: ['Transporte', 'Deporte', 'Educación', 'Ambiente'] },
  { municipio: 'Necoclí', total_proyectos: 30, inversion_total_millones: 52327, sectores_principales: ['Transporte', 'Deporte', 'Educación'] },
  { municipio: 'Chigorodó', total_proyectos: 18, inversion_total_millones: 36516, sectores_principales: ['Transporte', 'Vivienda'] },
  { municipio: 'Carepa', total_proyectos: 14, inversion_total_millones: 27612, sectores_principales: ['Deporte', 'Transporte', 'Educación'] },
  { municipio: 'Mutatá', total_proyectos: 15, inversion_total_millones: 19123, sectores_principales: ['Transporte', 'Educación'] },
  { municipio: 'San Juan de Urabá', total_proyectos: 11, inversion_total_millones: 19935, sectores_principales: ['Transporte', 'Educación'] },
  { municipio: 'Apartadó', total_proyectos: 6, inversion_total_millones: 12154, sectores_principales: ['Transporte', 'Deporte'] },
  // Oriente
  { municipio: 'Sonsón', total_proyectos: 27, inversion_total_millones: 25524, sectores_principales: ['Transporte', 'Agua', 'Educación'] },
  { municipio: 'Granada', total_proyectos: 20, inversion_total_millones: 8908, sectores_principales: ['Transporte', 'Educación'] },
  { municipio: 'San Carlos', total_proyectos: 18, inversion_total_millones: 9837, sectores_principales: ['Transporte', 'Agua', 'Educación'] },
  { municipio: 'San Rafael', total_proyectos: 10, inversion_total_millones: 7601, sectores_principales: ['Transporte', 'Educación'] },
  { municipio: 'Rionegro', total_proyectos: 1, inversion_total_millones: 10000, sectores_principales: ['Transporte'] },
  { municipio: 'Marinilla', total_proyectos: 7, inversion_total_millones: 9769, sectores_principales: ['Transporte', 'Educación'] },
  { municipio: 'Guarne', total_proyectos: 9, inversion_total_millones: 9601, sectores_principales: ['Transporte', 'Deporte'] },
];

// =============================================
// VÍCTIMAS CONFLICTO ARMADO — datos.gov.co (datos reales)
// Dataset: ma9c-mk5w (Unidad de Víctimas - Territorial)
// VERIFICADO: marzo 2026
// =============================================

export interface VictimasRegion {
  direccion_territorial: string;
  desplazamiento_forzado_acumulado: number;
  confinamiento_acumulado: number;
  amenaza_acumulado: number;
  homicidio_acumulado: number;
  total_hechos_victimizantes: number;
  victimas_2024: number;
  victimas_2023: number;
  nota: string;
}

export const victimasConflicto: VictimasRegion[] = [
  {
    direccion_territorial: 'DT Urabá',
    desplazamiento_forzado_acumulado: 629341,
    confinamiento_acumulado: 246979,
    amenaza_acumulado: 180713,
    homicidio_acumulado: 14937,
    total_hechos_victimizantes: 1093258,
    victimas_2024: 89114,
    victimas_2023: 140250,
    nota: 'Urabá tiene su propia Dirección Territorial de Víctimas — refleja la magnitud histórica del conflicto.',
  },
  {
    direccion_territorial: 'DT Antioquia (incluye Oriente)',
    desplazamiento_forzado_acumulado: 1962642,
    confinamiento_acumulado: 162304,
    amenaza_acumulado: 585989,
    homicidio_acumulado: 90949,
    total_hechos_victimizantes: 2835926,
    victimas_2024: 435247,
    victimas_2023: 684125,
    nota: 'DT Antioquia cubre todo el departamento excepto Urabá. Oriente fue epicentro del conflicto 1998-2005.',
  },
];

export function getVictimasByRegion(region: 'Urabá' | 'Oriente' | 'Todas') {
  if (region === 'Urabá') return victimasConflicto[0];
  if (region === 'Oriente') return victimasConflicto[1];
  return {
    direccion_territorial: 'Urabá + Antioquia',
    desplazamiento_forzado_acumulado: victimasConflicto[0].desplazamiento_forzado_acumulado + victimasConflicto[1].desplazamiento_forzado_acumulado,
    confinamiento_acumulado: victimasConflicto[0].confinamiento_acumulado + victimasConflicto[1].confinamiento_acumulado,
    amenaza_acumulado: victimasConflicto[0].amenaza_acumulado + victimasConflicto[1].amenaza_acumulado,
    homicidio_acumulado: victimasConflicto[0].homicidio_acumulado + victimasConflicto[1].homicidio_acumulado,
    total_hechos_victimizantes: victimasConflicto[0].total_hechos_victimizantes + victimasConflicto[1].total_hechos_victimizantes,
    victimas_2024: victimasConflicto[0].victimas_2024 + victimasConflicto[1].victimas_2024,
    victimas_2023: victimasConflicto[0].victimas_2023 + victimasConflicto[1].victimas_2023,
    nota: 'Antioquia y Urabá concentran ~30% de las víctimas del conflicto armado en Colombia.',
  };
}

// =============================================
// TURISMO — datos.gov.co (mmsn-v5r4) VERIFICADO
// Registro Nacional de Turismo - Antioquia
// =============================================

export interface TurismoMunicipal {
  municipio: string;
  prestadores: number;
  habitaciones: number;
}

export const turismoReal: TurismoMunicipal[] = [
  // VERIFICADO: API mmsn-v5r4 estado_rnt=ACTIVO, marzo 2026
  { municipio: 'Rionegro', prestadores: 3527, habitaciones: 20905 },
  { municipio: 'Guatapé', prestadores: 3166, habitaciones: 15602 },
  { municipio: 'Necoclí', prestadores: 1624, habitaciones: 11004 },
  { municipio: 'Guarne', prestadores: 1298, habitaciones: 5788 },
  { municipio: 'San Rafael', prestadores: 1062, habitaciones: 9533 },
  { municipio: 'Apartadó', prestadores: 887, habitaciones: 10833 },
  { municipio: 'Marinilla', prestadores: 777, habitaciones: 5472 },
  { municipio: 'San Carlos', prestadores: 713, habitaciones: 5017 },
  { municipio: 'Cocorná', prestadores: 554, habitaciones: 5207 },
  { municipio: 'La Ceja', prestadores: 538, habitaciones: 2989 },
  { municipio: 'Sonsón', prestadores: 466, habitaciones: 3190 },
  { municipio: 'San Luis', prestadores: 460, habitaciones: 2920 },
  { municipio: 'Arboletes', prestadores: 436, habitaciones: 4935 },
  { municipio: 'Turbo', prestadores: 346, habitaciones: 5046 },
  { municipio: 'Carepa', prestadores: 108, habitaciones: 2684 },
  { municipio: 'Chigorodó', prestadores: 98, habitaciones: 1497 },
  { municipio: 'Mutatá', prestadores: 96, habitaciones: 1668 },
];

// =============================================
// ICBF PRIMERA INFANCIA — datos.gov.co (i8ww-5mcf) VERIFICADO
// Unidades de Servicio vigencia 2025
// =============================================

export interface ICBFMunicipal {
  municipio: string;
  unidades_total: number;
  urbano: number;
  rural: number;
}

export const icbfReal: ICBFMunicipal[] = [
  // VERIFICADO: API i8ww-5mcf vigencia=2025, marzo 2026
  { municipio: 'Turbo', unidades_total: 136, urbano: 38, rural: 98 },
  { municipio: 'Carepa', unidades_total: 49, urbano: 13, rural: 36 },
  { municipio: 'Arboletes', unidades_total: 44, urbano: 12, rural: 32 },
  { municipio: 'Rionegro', unidades_total: 37, urbano: 16, rural: 21 },
  { municipio: 'Marinilla', unidades_total: 28, urbano: 12, rural: 16 },
  { municipio: 'San Luis', unidades_total: 26, urbano: 14, rural: 12 },
  { municipio: 'Guarne', unidades_total: 25, urbano: 7, rural: 18 },
  { municipio: 'San Vicente', unidades_total: 19, urbano: 5, rural: 14 },
  { municipio: 'San Carlos', unidades_total: 15, urbano: 9, rural: 6 },
  { municipio: 'San Rafael', unidades_total: 10, urbano: 10, rural: 0 },
  { municipio: 'La Ceja', unidades_total: 10, urbano: 6, rural: 4 },
  { municipio: 'Argelia', unidades_total: 5, urbano: 0, rural: 5 },
  { municipio: 'Granada', unidades_total: 5, urbano: 5, rural: 0 },
];

// =============================================
// TEJIDO EMPRESARIAL — datos.gov.co (jtyy-9zuz) VERIFICADO
// Cámara de Comercio Oriente Antioqueño
// =============================================

export interface EmpresasMunicipal {
  municipio: string;
  total_empresas: number;
  micro: number;
  pequena: number;
  mediana_grande: number;
}

export const empresasReal: EmpresasMunicipal[] = [
  // VERIFICADO: API jtyy-9zuz, Cámara Comercio Oriente, marzo 2026
  // Solo cubre jurisdicción Oriente (no Urabá)
  { municipio: 'Rionegro', total_empresas: 9038, micro: 7173, pequena: 399, mediana_grande: 112 },
  { municipio: 'La Ceja', total_empresas: 3404, micro: 2784, pequena: 112, mediana_grande: 24 },
  { municipio: 'Marinilla', total_empresas: 2659, micro: 2223, pequena: 84, mediana_grande: 15 },
  { municipio: 'El Carmen de Viboral', total_empresas: 2255, micro: 1881, pequena: 75, mediana_grande: 17 },
  { municipio: 'Guarne', total_empresas: 2053, micro: 1641, pequena: 68, mediana_grande: 33 },
  { municipio: 'El Retiro', total_empresas: 1644, micro: 1308, pequena: 64, mediana_grande: 16 },
  { municipio: 'Sonsón', total_empresas: 1099, micro: 924, pequena: 9, mediana_grande: 2 },
  { municipio: 'Guatapé', total_empresas: 900, micro: 800, pequena: 9, mediana_grande: 1 },
  { municipio: 'El Peñol', total_empresas: 773, micro: 673, pequena: 15, mediana_grande: 1 },
  { municipio: 'Cocorná', total_empresas: 502, micro: 434, pequena: 8, mediana_grande: 0 },
  { municipio: 'San Vicente', total_empresas: 457, micro: 389, pequena: 19, mediana_grande: 0 },
  { municipio: 'San Carlos', total_empresas: 448, micro: 382, pequena: 7, mediana_grande: 0 },
  { municipio: 'San Rafael', total_empresas: 398, micro: 340, pequena: 5, mediana_grande: 0 },
  { municipio: 'Granada', total_empresas: 321, micro: 280, pequena: 4, mediana_grande: 0 },
  { municipio: 'San Luis', total_empresas: 285, micro: 248, pequena: 3, mediana_grande: 0 },
  { municipio: 'Argelia', total_empresas: 142, micro: 130, pequena: 1, mediana_grande: 0 },
];

export function getTurismoByRegion(region: 'Urabá' | 'Oriente' | 'Todas') {
  const urabaNames = ['Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Mutatá', 'Necoclí', 'Arboletes'];
  const data = region === 'Todas' ? turismoReal
    : region === 'Urabá' ? turismoReal.filter(t => urabaNames.includes(t.municipio))
    : turismoReal.filter(t => !urabaNames.includes(t.municipio));
  return {
    total_prestadores: data.reduce((s, t) => s + t.prestadores, 0),
    total_habitaciones: data.reduce((s, t) => s + t.habitaciones, 0),
    municipios: data.sort((a, b) => b.prestadores - a.prestadores),
  };
}

export function getICBFByRegion(region: 'Urabá' | 'Oriente' | 'Todas') {
  const urabaNames = ['Turbo', 'Carepa', 'Arboletes'];
  const data = region === 'Todas' ? icbfReal
    : region === 'Urabá' ? icbfReal.filter(i => urabaNames.includes(i.municipio))
    : icbfReal.filter(i => !urabaNames.includes(i.municipio));
  return {
    total_unidades: data.reduce((s, i) => s + i.unidades_total, 0),
    total_rural: data.reduce((s, i) => s + i.rural, 0),
    municipios: data,
  };
}

export function getProduccionByRegion(region: 'Urabá' | 'Oriente' | 'Todas') {
  const urabaNames = ['Turbo', 'Apartadó', 'Carepa', 'Chigorodó', 'Necoclí', 'Mutatá', 'San Juan de Urabá', 'Arboletes'];
  const data = region === 'Todas'
    ? produccionAgricola
    : region === 'Urabá'
      ? produccionAgricola.filter(p => urabaNames.includes(p.municipio))
      : produccionAgricola.filter(p => !urabaNames.includes(p.municipio));
  const total = data.reduce((s, p) => s + p.produccion_total_ton, 0);
  return { total, municipios: data.sort((a, b) => b.produccion_total_ton - a.produccion_total_ton) };
}

export function getSGRByRegion(region: 'Urabá' | 'Oriente' | 'Todas') {
  const urabaNames = ['Turbo', 'Apartadó', 'Carepa', 'Chigorodó', 'Necoclí', 'Mutatá', 'San Juan de Urabá', 'Arboletes', 'San Pedro de Urabá'];
  const data = region === 'Todas'
    ? resumenSGR
    : region === 'Urabá'
      ? resumenSGR.filter(p => urabaNames.includes(p.municipio))
      : resumenSGR.filter(p => !urabaNames.includes(p.municipio));
  const total_proyectos = data.reduce((s, p) => s + p.total_proyectos, 0);
  const total_inversion = data.reduce((s, p) => s + p.inversion_total_millones, 0);
  return { total_proyectos, total_inversion, municipios: data.sort((a, b) => b.inversion_total_millones - a.inversion_total_millones) };
}
