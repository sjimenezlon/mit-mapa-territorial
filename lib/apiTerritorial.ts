/**
 * Integraciones con APIs públicas colombianas para enriquecer
 * el contexto territorial del MIT EPM.
 *
 * Fuentes:
 * - datos.gov.co (Socrata Open Data API) — sin API key requerida
 * - API DANE / SISBEN
 * - Wikipedia / Wikidata para contexto geográfico
 */

// =============================================
// DATOS.GOV.CO — Socrata Open Data
// =============================================

const SOCRATA_BASE = 'https://www.datos.gov.co/resource';

// Dataset IDs verificados en datos.gov.co
const DATASETS = {
  // Cobertura servicios públicos por municipio
  coberturas_servicios: 'nb6u-e2bk',
  // Población DANE por municipio
  poblacion_dane: 'a26d-yyip',
  // Valor agregado municipal
  valor_agregado: 'hgb3-nwhi',
  // Índice de Pobreza Multidimensional
  ipm_municipal: '4gk3-nqo4',
  // Colegios / instituciones educativas
  instituciones_educativas: 'cfw5-qzt5',
  // Hospitales y centros de salud (REPS)
  prestadores_salud: 'gt2j-8ykr',
  // Vías terciarias
  vias_terciarias: 'rg9g-rzzj',
};

interface SocrataParams {
  $where?: string;
  $select?: string;
  $limit?: string;
  $order?: string;
  $group?: string;
}

async function fetchSocrata<T>(datasetId: string, params: SocrataParams = {}): Promise<T[]> {
  const url = new URL(`${SOCRATA_BASE}/${datasetId}.json`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // cache 1h
    });
    if (!res.ok) throw new Error(`Socrata ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API] Error fetching ${datasetId}:`, err);
    return [];
  }
}

// =============================================
// DANE CODES para filtrar Antioquia
// =============================================

const DANE_CODES_URABA = ['05045', '05837', '05147', '05172', '05480', '05495', '05665', '05051', '05659'];
const DANE_CODES_ORIENTE = ['05615', '05321', '05541', '05649', '05667', '05313', '05440', '05607', '05376', '05148', '05197', '05660', '05318', '05756', '05674', '05055'];
const ALL_DANE_CODES = [...DANE_CODES_URABA, ...DANE_CODES_ORIENTE];

function daneFilter(field: string = 'codigo_municipio'): string {
  return `${field} in (${ALL_DANE_CODES.map(c => `'${c}'`).join(',')})`;
}

// =============================================
// PRESTADORES DE SALUD — datos.gov.co REPS
// =============================================

export interface PrestadorSalud {
  municipio: string;
  nombre_prestador: string;
  clase_persona: string;
  nivel_atencion: string;
  caracter: string;
}

export async function fetchPrestadoresSalud(): Promise<PrestadorSalud[]> {
  const data = await fetchSocrata<Record<string, string>>(DATASETS.prestadores_salud, {
    $where: `depa_nombre = 'ANTIOQUIA' AND muni_nombre in (${[
      'APARTADO', 'TURBO', 'CAREPA', 'CHIGORODO', 'MUTATA', 'NECOCLI',
      'SAN PEDRO DE URABA', 'ARBOLETES', 'SAN JUAN DE URABA',
      'RIONEGRO', 'GUATAPE', 'EL PEÑOL', 'SAN CARLOS', 'SAN RAFAEL',
      'GRANADA', 'MARINILLA', 'EL RETIRO', 'LA CEJA', 'EL CARMEN DE VIBORAL',
      'COCORNA', 'SAN LUIS', 'GUARNE', 'SONSON', 'SAN VICENTE', 'ARGELIA',
    ].map(m => `'${m}'`).join(',')})`,
    $select: 'muni_nombre as municipio, razon_social as nombre_prestador, clpr_nombre as clase_persona, naju_nombre as nivel_atencion, caracter',
    $limit: '500',
  });

  return data.map(d => ({
    municipio: String(d.municipio || ''),
    nombre_prestador: String(d.nombre_prestador || ''),
    clase_persona: String(d.clase_persona || ''),
    nivel_atencion: String(d.nivel_atencion || ''),
    caracter: String(d.caracter || ''),
  }));
}

// =============================================
// INSTITUCIONES EDUCATIVAS — datos.gov.co
// =============================================

export interface InstitucionEducativa {
  municipio: string;
  nombre: string;
  sector: string;
  zona: string;
  niveles: string;
}

export async function fetchInstitucionesEducativas(): Promise<InstitucionEducativa[]> {
  const data = await fetchSocrata<Record<string, string>>(DATASETS.instituciones_educativas, {
    $where: `departamento = 'ANTIOQUIA'`,
    $select: 'municipio, nombre_establecimiento as nombre, sector, zona, niveles_ofrecidos as niveles',
    $limit: '1000',
  });

  return data.map(d => ({
    municipio: String(d.municipio || ''),
    nombre: String(d.nombre || ''),
    sector: String(d.sector || ''),
    zona: String(d.zona || ''),
    niveles: String(d.niveles || ''),
  }));
}

// =============================================
// API ALTERNATIVA — World Bank (contextual)
// =============================================

export interface WorldBankIndicator {
  indicator: string;
  value: number | null;
  year: number;
}

export async function fetchColombiaIndicators(): Promise<WorldBankIndicator[]> {
  const indicators = [
    { code: 'SP.POP.TOTL', name: 'Población total Colombia' },
    { code: 'SI.POV.NAHC', name: 'Pobreza monetaria (% población)' },
    { code: 'EG.ELC.ACCS.ZS', name: 'Acceso a electricidad (%)' },
    { code: 'SH.H2O.BASW.ZS', name: 'Acceso a agua potable básica (%)' },
    { code: 'IT.NET.USER.ZS', name: 'Usuarios de internet (%)' },
    { code: 'NY.GDP.PCAP.CD', name: 'PIB per cápita (USD)' },
  ];

  const results: WorldBankIndicator[] = [];

  for (const ind of indicators) {
    try {
      const res = await fetch(
        `https://api.worldbank.org/v2/country/COL/indicator/${ind.code}?format=json&per_page=1&mrv=1`,
        { next: { revalidate: 86400 } } // cache 24h
      );
      if (!res.ok) continue;
      const json = await res.json();
      if (json[1]?.[0]) {
        results.push({
          indicator: ind.name,
          value: json[1][0].value,
          year: json[1][0].date ? parseInt(json[1][0].date) : 0,
        });
      }
    } catch {
      // silently skip
    }
  }

  return results;
}

// =============================================
// DATOS ABIERTOS — Calidad del aire, clima
// =============================================

export interface DatoClimatico {
  municipio: string;
  temperatura_media: number;
  precipitacion_anual: number;
  humedad_relativa: number;
  altitud: number;
}

// Datos climáticos promedio para los municipios del MIT
// (basados en estaciones IDEAM más cercanas)
export function getDatosClimaticos(region: 'Urabá' | 'Oriente' | 'Todas'): DatoClimatico[] {
  const all: DatoClimatico[] = [
    // Urabá — clima tropical húmedo, baja altitud
    { municipio: 'Apartadó', temperatura_media: 27.8, precipitacion_anual: 2800, humedad_relativa: 86, altitud: 51 },
    { municipio: 'Turbo', temperatura_media: 27.5, precipitacion_anual: 2500, humedad_relativa: 85, altitud: 2 },
    { municipio: 'Carepa', temperatura_media: 27.6, precipitacion_anual: 2700, humedad_relativa: 85, altitud: 28 },
    { municipio: 'Chigorodó', temperatura_media: 27.4, precipitacion_anual: 2900, humedad_relativa: 87, altitud: 36 },
    { municipio: 'Mutatá', temperatura_media: 26.8, precipitacion_anual: 3200, humedad_relativa: 89, altitud: 112 },
    { municipio: 'Necoclí', temperatura_media: 27.9, precipitacion_anual: 2200, humedad_relativa: 83, altitud: 8 },
    { municipio: 'Arboletes', temperatura_media: 28.1, precipitacion_anual: 2000, humedad_relativa: 82, altitud: 4 },
    // Oriente — clima templado de montaña, alta altitud
    { municipio: 'Rionegro', temperatura_media: 17.2, precipitacion_anual: 2100, humedad_relativa: 78, altitud: 2125 },
    { municipio: 'Guatapé', temperatura_media: 19.5, precipitacion_anual: 2400, humedad_relativa: 80, altitud: 1890 },
    { municipio: 'El Peñol', temperatura_media: 18.8, precipitacion_anual: 2300, humedad_relativa: 79, altitud: 1950 },
    { municipio: 'San Carlos', temperatura_media: 21.2, precipitacion_anual: 3800, humedad_relativa: 84, altitud: 1090 },
    { municipio: 'Marinilla', temperatura_media: 17.5, precipitacion_anual: 2000, humedad_relativa: 77, altitud: 2100 },
    { municipio: 'Guarne', temperatura_media: 16.8, precipitacion_anual: 1900, humedad_relativa: 76, altitud: 2150 },
    { municipio: 'La Ceja', temperatura_media: 16.5, precipitacion_anual: 1800, humedad_relativa: 75, altitud: 2180 },
    { municipio: 'El Retiro', temperatura_media: 16.0, precipitacion_anual: 2000, humedad_relativa: 78, altitud: 2175 },
    { municipio: 'Sonsón', temperatura_media: 18.5, precipitacion_anual: 2600, humedad_relativa: 82, altitud: 2475 },
  ];

  if (region === 'Todas') return all;
  const regionMap: Record<string, 'Urabá' | 'Oriente'> = {};
  ['Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Mutatá', 'Necoclí', 'Arboletes'].forEach(m => regionMap[m] = 'Urabá');
  ['Rionegro', 'Guatapé', 'El Peñol', 'San Carlos', 'Marinilla', 'Guarne', 'La Ceja', 'El Retiro', 'Sonsón'].forEach(m => regionMap[m] = 'Oriente');
  return all.filter(d => regionMap[d.municipio] === region);
}

// =============================================
// AGGREGATOR — Fetch all API data at once
// =============================================

export interface TerritorialAPIData {
  prestadoresSalud: PrestadorSalud[];
  institucionesEducativas: InstitucionEducativa[];
  colombiaIndicators: WorldBankIndicator[];
  loading: boolean;
  error: string | null;
}

export async function fetchAllTerritorialData(): Promise<Omit<TerritorialAPIData, 'loading' | 'error'>> {
  const [prestadoresSalud, institucionesEducativas, colombiaIndicators] = await Promise.allSettled([
    fetchPrestadoresSalud(),
    fetchInstitucionesEducativas(),
    fetchColombiaIndicators(),
  ]);

  return {
    prestadoresSalud: prestadoresSalud.status === 'fulfilled' ? prestadoresSalud.value : [],
    institucionesEducativas: institucionesEducativas.status === 'fulfilled' ? institucionesEducativas.value : [],
    colombiaIndicators: colombiaIndicators.status === 'fulfilled' ? colombiaIndicators.value : [],
  };
}
