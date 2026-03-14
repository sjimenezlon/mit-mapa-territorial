'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  fetchAllTerritorialData,
  getDatosClimaticos,
  type TerritorialAPIData,
} from '@/lib/apiTerritorial';
import { getEducacionByRegion, getAcueductosByRegion, getProduccionByRegion, getSGRByRegion } from '@/data/datosReales';

interface Props {
  region: 'Urabá' | 'Oriente' | 'Todas';
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllTerritorialData()
      .then(data => { if (!cancelled) { setApiData(data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const clima = useMemo(() => getDatosClimaticos(region), [region]);
  const educacion = useMemo(() => getEducacionByRegion(region), [region]);
  const acueductos = useMemo(() => getAcueductosByRegion(region), [region]);
  const produccion = useMemo(() => getProduccionByRegion(region), [region]);
  const sgr = useMemo(() => getSGRByRegion(region), [region]);

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
          <h3 className="text-[10px] font-bold text-white">Datos Verificados en Vivo</h3>
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

      {/* ==========================================
          EDUCACIÓN — datos.gov.co VERIFICADO
          ========================================== */}
      <div className="rounded-lg p-2.5 border border-epm-orange/15 bg-epm-orange/[0.02]">
        <p className="text-[8px] font-mono uppercase tracking-wider text-epm-orange/70 mb-2">
          Instituciones Educativas (datos.gov.co)
        </p>
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <StatCard label="Total" value={educacion.total.toLocaleString('es-CO')} color="#F7941D" />
          <StatCard label="Oficiales" value={educacion.oficial.toLocaleString('es-CO')} sub={`${educacion.ratio_oficial.toFixed(0)}%`} color="#004F9F" />
          <StatCard label="Privadas" value={educacion.no_oficial.toLocaleString('es-CO')} color="#58595B" />
        </div>
        {region === 'Todas' && (
          <div className="grid grid-cols-2 gap-1.5">
            {(() => {
              const ur = getEducacionByRegion('Urabá');
              const or_ = getEducacionByRegion('Oriente');
              return (
                <>
                  <div className="rounded p-1.5 bg-epm-orange/5 border border-epm-orange/10">
                    <p className="text-[8px] text-epm-orange font-bold">Urabá</p>
                    <p className="text-[9px] font-mono text-gray-300">{ur.total} inst. · {ur.ratio_oficial.toFixed(0)}% oficiales</p>
                  </div>
                  <div className="rounded p-1.5 bg-epm-green/5 border border-epm-green/10">
                    <p className="text-[8px] text-epm-green font-bold">Oriente</p>
                    <p className="text-[9px] font-mono text-gray-300">{or_.total} inst. · {or_.ratio_oficial.toFixed(0)}% oficiales</p>
                  </div>
                </>
              );
            })()}
          </div>
        )}
        {/* Insight */}
        <p className="text-[7px] text-gray-600 mt-1.5 leading-relaxed italic">
          {region === 'Urabá'
            ? 'Necoclí, Mutatá y San Juan de Urabá tienen 100% instituciones oficiales — sin oferta privada.'
            : region === 'Oriente'
              ? 'Rionegro tiene más instituciones privadas (164) que oficiales (128), reflejando su dinamismo económico.'
              : 'Urabá depende casi totalmente de educación oficial (93%). Oriente tiene 3x más oferta privada.'
          }
        </p>
      </div>

      {/* ==========================================
          ACUEDUCTOS — datos.gov.co VERIFICADO
          ========================================== */}
      <div className="rounded-lg p-2.5 border border-epm-blue/15 bg-epm-blue/[0.02]">
        <p className="text-[8px] font-mono uppercase tracking-wider text-epm-blue/70 mb-2">
          Prestadores de Acueducto (Superservicios)
        </p>
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <StatCard label="Prestadores" value={acueductos.total_prestadores} color="#004F9F" />
          <StatCard label="Con EPM" value={`${acueductos.municipios_con_epm} mun.`} color="#00A651" />
          <StatCard label="Comunitarios" value={`${acueductos.municipios_con_comunitarios} mun.`} color="#8B5CF6" />
        </div>

        {/* Top municipalities by aqueduct count */}
        <div className="space-y-1 mb-1.5">
          {acueductos.municipios
            .sort((a, b) => b.prestadores - a.prestadores)
            .slice(0, 5)
            .map(m => (
              <div key={m.municipio} className="flex items-center gap-2">
                <span className="text-[9px] text-gray-400 flex-1 truncate">{m.municipio}</span>
                <div className="flex items-center gap-1">
                  {m.tiene_epm && <span className="text-[7px] px-1 py-0.5 rounded bg-epm-green/10 text-epm-green border border-epm-green/20">EPM</span>}
                  {m.tiene_comunitarios && <span className="text-[7px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">COM</span>}
                  <span className="text-[10px] font-mono font-bold text-epm-blue">{m.prestadores}</span>
                </div>
              </div>
            ))}
        </div>

        <p className="text-[7px] text-gray-600 leading-relaxed italic">
          {region === 'Urabá'
            ? 'Urabá depende de EPM (Aguas Regionales) en el eje bananero. Necoclí y Arboletes NO tienen EPM.'
            : region === 'Oriente'
              ? 'Guarne tiene 22 acueductos comunitarios veredales — el mayor tejido hídrico comunitario de la región.'
              : 'Oriente: 72 prestadores (promedio 4.5/municipio). Urabá: 14 prestadores (promedio 1.6/municipio). La brecha en infraestructura hídrica es 3x.'
          }
        </p>
      </div>

      {/* ==========================================
          PRODUCCIÓN AGRÍCOLA — datos.gov.co VERIFICADO
          ========================================== */}
      <div className="rounded-lg p-2.5 border border-epm-green/15 bg-epm-green/[0.02]">
        <p className="text-[8px] font-mono uppercase tracking-wider text-epm-green/70 mb-2">
          Producción Agrícola 2022 (datos.gov.co)
        </p>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <StatCard label="Producción total" value={`${(produccion.total / 1000).toFixed(0)}k ton`} color="#00A651" />
          <StatCard label="Municipios" value={produccion.municipios.length} color="#00A651" />
        </div>
        <div className="space-y-1 mb-1.5">
          {produccion.municipios.slice(0, 5).map(m => (
            <div key={m.municipio} className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-400 flex-1 truncate">{m.municipio}</span>
              <span className="text-[7px] text-gray-500 truncate max-w-[80px]">{m.cultivo_principal}</span>
              <span className="text-[9px] font-mono font-bold text-epm-green">{(m.produccion_total_ton / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
        <p className="text-[7px] text-gray-600 leading-relaxed italic">
          {region === 'Urabá'
            ? 'Urabá produce 1.8M ton/año. Banano exportación domina (78%). Economía de enclave agroindustrial.'
            : region === 'Oriente'
              ? 'Oriente: agricultura diversificada. Tomate bajo invernadero, aguacate Hass, flores. Mayor valor agregado por tonelada.'
              : 'Urabá: monocultivo bananero (1.4M ton). Oriente: diversificado (hortalizas, aguacate Hass, flores). Modelos económicos opuestos.'
          }
        </p>
      </div>

      {/* ==========================================
          PROYECTOS SGR (REGALÍAS) — datos.gov.co VERIFICADO
          ========================================== */}
      <div className="rounded-lg p-2.5 border border-purple-500/15 bg-purple-500/[0.02]">
        <p className="text-[8px] font-mono uppercase tracking-wider text-purple-400/70 mb-2">
          Proyectos de Regalías SGR (DNP)
        </p>
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <StatCard label="Proyectos" value={sgr.total_proyectos} color="#8B5CF6" />
          <StatCard label="Inversión" value={`$${(sgr.total_inversion / 1000).toFixed(0)}k M`} sub="COP millones" color="#8B5CF6" />
          <StatCard label="Terminados" value={`${sgr.terminados}/${sgr.total_proyectos}`} color={sgr.terminados > sgr.en_ejecucion ? '#00A651' : '#F7941D'} />
        </div>
        <div className="space-y-1 mb-1.5">
          {sgr.proyectos.slice(0, 4).map((p, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${p.estado === 'Terminado' ? 'bg-epm-green' : 'bg-epm-orange'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[8px] text-gray-300 truncate">{p.nombre}</p>
                <p className="text-[7px] text-gray-500">{p.municipio} · {p.sector} · COP ${p.valor_total.toLocaleString('es-CO')}M</p>
              </div>
            </div>
          ))}
          {sgr.proyectos.length > 4 && (
            <p className="text-[7px] text-gray-600 ml-3">+{sgr.proyectos.length - 4} proyectos más</p>
          )}
        </div>
        <p className="text-[7px] text-gray-600 leading-relaxed italic">
          {region === 'Urabá'
            ? 'Turbo concentra $60k M en regalías — 80% en vías. Refleja déficit histórico de infraestructura básica.'
            : region === 'Oriente'
              ? 'Oriente recibe menos regalías que Urabá. Su desarrollo se financia más con recursos propios y EPM.'
              : 'Turbo recibe 6x más regalías que cualquier otro municipio MIT. Casi todo en vías y deporte — poco en agua o educación.'
          }
        </p>
      </div>

      {/* ==========================================
          CLIMA / GEOGRAFÍA — IDEAM
          ========================================== */}
      {climaAvg && (
        <div className="rounded-lg p-2.5 border border-epm-border bg-white/[0.01]">
          <p className="text-[8px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Clima y Geografía (IDEAM) {region !== 'Todas' ? `— ${region}` : ''}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <StatCard label="Temp. media" value={`${climaAvg.temp}°C`} color="#F7941D" />
            <StatCard label="Precipitación" value={`${climaAvg.precip} mm/año`} color="#004F9F" />
            <StatCard label="Humedad" value={`${climaAvg.humedad}%`} color="#004F9F" />
            <StatCard label="Altitud" value={`${climaAvg.altitud_min}–${climaAvg.altitud_max}`} sub="m.s.n.m." color="#00A651" />
          </div>
          {region === 'Todas' && (
            <p className="text-[7px] text-gray-600 mt-1.5 leading-relaxed">
              Urabá: tropical húmedo (28°C, 2-112m). Oriente: templado de montaña (17°C, 1090-2475m).
              Dos realidades climáticas que determinan infraestructura completamente distinta.
            </p>
          )}
        </div>
      )}

      {/* ==========================================
          BANCO MUNDIAL — API en vivo
          ========================================== */}
      {apiData?.colombiaIndicators && apiData.colombiaIndicators.length > 0 && (
        <div className="rounded-lg p-2.5 border border-emerald-500/15 bg-emerald-500/[0.02]">
          <p className="text-[8px] font-mono uppercase tracking-wider text-emerald-500/70 mb-2">
            Colombia — Banco Mundial (API)
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

      {/* Data provenance */}
      <div className="rounded-lg p-2 bg-white/[0.01] border border-epm-border">
        <p className="text-[7px] font-mono text-gray-600 leading-relaxed">
          <strong className="text-gray-500">Fuentes verificadas:</strong> Educación y acueductos consultados directamente desde
          datos.gov.co (Socrata API). Clima referenciado de estaciones IDEAM. Indicadores nacionales del API del Banco Mundial.
          Datos de IPM/NBI/coberturas del DANE Censo Nacional 2018 + proyecciones DNP TerriData.
        </p>
      </div>
    </div>
  );
}
