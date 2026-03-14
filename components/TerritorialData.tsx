'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  fetchAllTerritorialData,
  getDatosClimaticos,
  type TerritorialAPIData,
  type DatoClimatico,
  type WorldBankIndicator,
} from '@/lib/apiTerritorial';

interface Props {
  region: 'Urabá' | 'Oriente' | 'Todas';
}

function Skeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-2 bg-gray-700/50 rounded w-3/4" />
      <div className="h-2 bg-gray-700/50 rounded w-1/2" />
      <div className="h-2 bg-gray-700/50 rounded w-2/3" />
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-epm-border p-2">
      <p className="text-[8px] font-mono uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-sm font-mono font-bold" style={{ color: color || '#e2e8f0' }}>{value}</p>
      {sub && <p className="text-[8px] text-gray-500">{sub}</p>}
    </div>
  );
}

export default function TerritorialData({ region }: Props) {
  const [apiData, setApiData] = useState<Omit<TerritorialAPIData, 'loading' | 'error'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllTerritorialData()
      .then(data => {
        if (!cancelled) {
          setApiData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const clima = useMemo(() => getDatosClimaticos(region), [region]);

  // Aggregate health data by region
  const saludStats = useMemo(() => {
    if (!apiData?.prestadoresSalud.length) return null;
    const urabaNames = ['APARTADO', 'TURBO', 'CAREPA', 'CHIGORODO', 'MUTATA', 'NECOCLI', 'SAN PEDRO DE URABA', 'ARBOLETES', 'SAN JUAN DE URABA'];
    const orienteNames = ['RIONEGRO', 'GUATAPE', 'EL PEÑOL', 'SAN CARLOS', 'SAN RAFAEL', 'GRANADA', 'MARINILLA', 'EL RETIRO', 'LA CEJA', 'EL CARMEN DE VIBORAL', 'COCORNA', 'SAN LUIS', 'GUARNE', 'SONSON', 'SAN VICENTE', 'ARGELIA'];

    const filter = (names: string[]) => apiData.prestadoresSalud.filter(p =>
      names.some(n => p.municipio.toUpperCase().includes(n))
    );

    const urabaCount = filter(urabaNames).length;
    const orienteCount = filter(orienteNames).length;

    if (region === 'Urabá') return { total: urabaCount, label: 'Urabá' };
    if (region === 'Oriente') return { total: orienteCount, label: 'Oriente' };
    return { uraba: urabaCount, oriente: orienteCount, total: urabaCount + orienteCount };
  }, [apiData, region]);

  // Aggregate education data
  const educacionStats = useMemo(() => {
    if (!apiData?.institucionesEducativas.length) return null;
    const data = apiData.institucionesEducativas;
    const total = data.length;
    const oficial = data.filter(i => i.sector?.toUpperCase() === 'OFICIAL').length;
    const rural = data.filter(i => i.zona?.toUpperCase() === 'RURAL').length;
    return { total, oficial, rural, privado: total - oficial };
  }, [apiData]);

  // Climate averages
  const climaAvg = useMemo(() => {
    if (!clima.length) return null;
    const n = clima.length;
    return {
      temp: (clima.reduce((s, c) => s + c.temperatura_media, 0) / n).toFixed(1),
      precip: Math.round(clima.reduce((s, c) => s + c.precipitacion_anual, 0) / n),
      humedad: Math.round(clima.reduce((s, c) => s + c.humedad_relativa, 0) / n),
      altitud_min: Math.min(...clima.map(c => c.altitud)),
      altitud_max: Math.max(...clima.map(c => c.altitud)),
    };
  }, [clima]);

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-white">Datos Abiertos en Vivo</h3>
          <p className="text-[7px] font-mono uppercase tracking-[0.15em] text-gray-500">
            datos.gov.co · Banco Mundial · IDEAM
          </p>
        </div>
        {loading && (
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[8px] text-emerald-500 font-mono">cargando</span>
          </div>
        )}
      </div>

      {/* Colombia context — World Bank */}
      {apiData?.colombiaIndicators && apiData.colombiaIndicators.length > 0 && (
        <div className="rounded-lg p-2.5 border border-emerald-500/15 bg-emerald-500/[0.02]">
          <p className="text-[8px] font-mono uppercase tracking-wider text-emerald-500/70 mb-2">
            Contexto Nacional (Banco Mundial)
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {apiData.colombiaIndicators.map((ind, i) => (
              <StatCard
                key={i}
                label={ind.indicator.replace('Colombia', '').trim()}
                value={
                  ind.value !== null
                    ? ind.indicator.includes('PIB')
                      ? `US$${Math.round(ind.value).toLocaleString('es-CO')}`
                      : ind.indicator.includes('Población')
                        ? `${(ind.value / 1_000_000).toFixed(1)}M`
                        : `${ind.value.toFixed(1)}%`
                    : 'N/D'
                }
                sub={`${ind.year}`}
                color="#10b981"
              />
            ))}
          </div>
        </div>
      )}

      {/* Climate / Geography */}
      {climaAvg && (
        <div className="rounded-lg p-2.5 border border-epm-border bg-white/[0.01]">
          <p className="text-[8px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Clima y Geografía {region !== 'Todas' ? `— ${region}` : ''}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <StatCard label="Temp. media" value={`${climaAvg.temp}°C`} color="#F7941D" />
            <StatCard label="Precipitación" value={`${climaAvg.precip} mm/año`} color="#004F9F" />
            <StatCard label="Humedad" value={`${climaAvg.humedad}%`} color="#004F9F" />
            <StatCard
              label="Altitud"
              value={`${climaAvg.altitud_min}–${climaAvg.altitud_max}`}
              sub="m.s.n.m."
              color="#00A651"
            />
          </div>
          {region === 'Todas' && (
            <p className="text-[7px] text-gray-600 mt-1.5 leading-relaxed">
              Urabá: tropical húmedo (28°C, ~2m). Oriente: templado de montaña (17°C, ~2100m).
              Dos realidades geográficas que condicionan la infraestructura EPM.
            </p>
          )}
        </div>
      )}

      {/* Health */}
      {loading ? <Skeleton /> : saludStats && (
        <div className="rounded-lg p-2.5 border border-epm-border bg-white/[0.01]">
          <p className="text-[8px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Prestadores de Salud (REPS)
          </p>
          {'total' in saludStats && 'uraba' in saludStats ? (
            <div className="grid grid-cols-3 gap-1.5">
              <StatCard label="Total" value={saludStats.total} color="#8B5CF6" />
              <StatCard label="Urabá" value={(saludStats as { uraba: number }).uraba} color="#F7941D" />
              <StatCard label="Oriente" value={(saludStats as { oriente: number }).oriente} color="#00A651" />
            </div>
          ) : (
            <StatCard label={`Prestadores en ${(saludStats as { label: string }).label}`} value={saludStats.total} color="#8B5CF6" />
          )}
          <p className="text-[7px] text-gray-600 mt-1 italic">
            Fuente: Registro Especial de Prestadores de Servicios de Salud
          </p>
        </div>
      )}

      {/* Education */}
      {loading ? <Skeleton /> : educacionStats && (
        <div className="rounded-lg p-2.5 border border-epm-border bg-white/[0.01]">
          <p className="text-[8px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Instituciones Educativas
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <StatCard label="Total" value={educacionStats.total} color="#F7941D" />
            <StatCard label="Oficiales" value={educacionStats.oficial} color="#004F9F" />
            <StatCard label="Rurales" value={educacionStats.rural} color="#00A651" />
          </div>
          <p className="text-[7px] text-gray-600 mt-1 italic">
            Fuente: datos.gov.co — Directorio de establecimientos educativos
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-lg p-2 border border-red-500/20 bg-red-500/[0.03]">
          <p className="text-[8px] text-red-400">Error conectando con APIs: {error}</p>
          <p className="text-[7px] text-gray-500 mt-0.5">Los indicadores locales (DANE/DNP) siguen disponibles arriba.</p>
        </div>
      )}

      {/* Data freshness */}
      {!loading && apiData && (
        <p className="text-[7px] text-gray-600 text-center">
          Datos actualizados en tiempo real desde APIs públicas colombianas
        </p>
      )}
    </div>
  );
}
