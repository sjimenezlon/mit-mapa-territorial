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
  // Urabá — pocos prestadores, dependencia de EPM
  { municipio: 'Apartadó', prestadores: 3, nombres_principales: ['Aguas Regionales EPM S.A E.S.P', 'Prestadora de Servicios Públicos', 'Empresas Publicas de Apartadó'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Turbo', prestadores: 3, nombres_principales: ['Aguas Regionales EPM S.A E.S.P', 'Optima de Urabá S.A. E.S.P.', 'Acueducto Multiveredal Plataneros Unidos'], tiene_epm: true, tiene_comunitarios: true },
  { municipio: 'Carepa', prestadores: 2, nombres_principales: ['Aguas Regionales EPM S.A E.S.P', 'Serviaraucarias SAS ESP'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Chigorodó', prestadores: 1, nombres_principales: ['Aguas Regionales EPM S.A E.S.P'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Mutatá', prestadores: 1, nombres_principales: ['Aguas Regionales EPM S.A E.S.P'], tiene_epm: true, tiene_comunitarios: false },
  { municipio: 'Necoclí', prestadores: 1, nombres_principales: ['Sistemas Públicos S.A. E.S.P.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'San Pedro de Urabá', prestadores: 1, nombres_principales: ['Sistemas Públicos S.A. E.S.P.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Arboletes', prestadores: 1, nombres_principales: ['Acueductos y Alcantarillados Sostenibles A.A.S.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'San Juan de Urabá', prestadores: 1, nombres_principales: ['Acueductos y Alcantarillados Sostenibles A.A.S.'], tiene_epm: false, tiene_comunitarios: false },
  // Oriente — ecosistema rico de acueductos comunitarios + EPM
  { municipio: 'Rionegro', prestadores: 16, nombres_principales: ['EPM E.S.P.', 'Empresas Públicas de Rionegro', 'Conhydra S.A.', 'Zona Franca Rionegro', '+ 12 acueductos veredales'], tiene_epm: true, tiene_comunitarios: true },
  { municipio: 'Guarne', prestadores: 22, nombres_principales: ['Aquaterra E.S.P', 'Corporación La Enea', '+ 20 acueductos comunitarios veredales'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'El Carmen de Viboral', prestadores: 10, nombres_principales: ['Empresa de Servicios Públicos E.S.P.', '+ 9 acueductos veredales comunitarios'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'La Ceja', prestadores: 7, nombres_principales: ['Empresas Públicas de La Ceja E.S.P.', '+ 6 acueductos veredales'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'Marinilla', prestadores: 6, nombres_principales: ['Empresa de Servicios Públicos de Marinilla', 'Corbelen', '+ 4 acueductos rurales'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'Guatapé', prestadores: 3, nombres_principales: ['Empresa de Servicios Públicos de Guatapé', 'Acueducto Multiveredal La Piedra', 'Acueducto Vereda El Roble'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'Cocorná', prestadores: 4, nombres_principales: ['Empresa de Servicios Públicos de Cocorná', 'Asococorná', 'Acueducto Multiveredal Cruces', 'Acueducto Santo Domingo'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'San Carlos', prestadores: 2, nombres_principales: ['Aguas y Aseo del Tabor', 'Acueducto El Jordán'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'San Rafael', prestadores: 1, nombres_principales: ['Empresas Públicas de San Rafael S.A. E.S.P.'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Granada', prestadores: 1, nombres_principales: ['Empresa de Servicios Públicos de Granada'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Sonsón', prestadores: 3, nombres_principales: ['Aguas del Páramo de Sonsón', 'Acueducto San Miguel', 'Acueducto La Danta'], tiene_epm: false, tiene_comunitarios: true },
  { municipio: 'San Luis', prestadores: 2, nombres_principales: ['Empresas Públicas de San Luis', 'Unidad Municipal de Servicios Públicos'], tiene_epm: false, tiene_comunitarios: false },
  { municipio: 'Argelia', prestadores: 2, nombres_principales: ['Empresa de Servicios Públicos Argelia de María', 'Acueducto San Tropel'], tiene_epm: false, tiene_comunitarios: true },
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

export const proyectosSGR: ProyectoSGR[] = [
  // Turbo — el más beneficiado con regalías en la zona MIT
  { municipio: 'Turbo', nombre: 'Pavimento concreto rígido casco urbano', sector: 'Transporte', valor_total: 14356, estado: 'Terminado', ejecucion_fisica: 100 },
  { municipio: 'Turbo', nombre: 'Unidad deportiva etapa 2', sector: 'Deporte', valor_total: 10965, estado: 'En ejecución', ejecucion_fisica: 88 },
  { municipio: 'Turbo', nombre: 'Vías urbanas Eccehomo, El Progreso, San Martín', sector: 'Transporte', valor_total: 10954, estado: 'Terminado', ejecucion_fisica: 100 },
  { municipio: 'Turbo', nombre: '3.2 km pavimento concreto rígido', sector: 'Transporte', valor_total: 10732, estado: 'Terminado', ejecucion_fisica: 100 },
  { municipio: 'Turbo', nombre: 'Parque Currulao', sector: 'Vivienda y territorio', valor_total: 6939, estado: 'Terminado', ejecucion_fisica: 100 },
  { municipio: 'Turbo', nombre: 'Restauración ecológica cuenca río Turbo-Currulao', sector: 'Ambiente', valor_total: 2701, estado: 'Terminado', ejecucion_fisica: 100 },
  { municipio: 'Turbo', nombre: 'Institución Etnoeducativa Bocas del Atrato', sector: 'Educación', valor_total: 1982, estado: 'Terminado', ejecucion_fisica: 100 },
  { municipio: 'Turbo', nombre: 'Alimentación escolar establecimientos oficiales', sector: 'Educación', valor_total: 1060, estado: 'Terminado', ejecucion_fisica: 95 },
  // Otros municipios MIT
  { municipio: 'Necoclí', nombre: 'Infraestructura deportiva', sector: 'Deporte', valor_total: 12038, estado: 'En ejecución', ejecucion_fisica: 48 },
  { municipio: 'Rionegro', nombre: 'Infraestructura vial', sector: 'Transporte', valor_total: 10000, estado: 'En ejecución', ejecucion_fisica: 65 },
  { municipio: 'Chigorodó', nombre: 'Vías urbanas', sector: 'Transporte', valor_total: 6771, estado: 'En ejecución', ejecucion_fisica: 72 },
  { municipio: 'Carepa', nombre: 'Infraestructura deportiva', sector: 'Deporte', valor_total: 6550, estado: 'En ejecución', ejecucion_fisica: 55 },
  { municipio: 'San Juan de Urabá', nombre: 'Vías rurales', sector: 'Transporte', valor_total: 5629, estado: 'En ejecución', ejecucion_fisica: 40 },
  { municipio: 'San Rafael', nombre: 'Mantenimiento vía El Arenal', sector: 'Transporte', valor_total: 432, estado: 'Terminado', ejecucion_fisica: 100 },
];

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
    ? proyectosSGR
    : region === 'Urabá'
      ? proyectosSGR.filter(p => urabaNames.includes(p.municipio))
      : proyectosSGR.filter(p => !urabaNames.includes(p.municipio));
  const total_inversion = data.reduce((s, p) => s + p.valor_total, 0);
  const terminados = data.filter(p => p.estado === 'Terminado').length;
  return { total_proyectos: data.length, total_inversion, terminados, en_ejecucion: data.length - terminados, proyectos: data };
}
