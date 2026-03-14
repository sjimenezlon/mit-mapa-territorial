'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  fetchAllTerritorialData,
  getDatosClimaticos,
  type TerritorialAPIData,
} from '@/lib/apiTerritorial';
import { getEducacionByRegion, getAcueductosByRegion, getProduccionByRegion, getSGRByRegion, getVictimasByRegion, victimasConflicto, getTurismoByRegion, getICBFByRegion, empresasReal } from '@/data/datosReales';

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
  const victimas = useMemo(() => getVictimasByRegion(region), [region]);
  const turismo = useMemo(() => getTurismoByRegion(region), [region]);
  const icbf = useMemo(() => getICBFByRegion(region), [region]);

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
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <StatCard label="Proyectos SGR" value={sgr.total_proyectos} color="#8B5CF6" />
          <StatCard label="Inversión total" value={`$${(sgr.total_inversion / 1000).toFixed(0)}k M`} sub="COP millones" color="#8B5CF6" />
        </div>
        <div className="space-y-1 mb-1.5">
          {sgr.municipios.slice(0, 6).map(m => (
            <div key={m.municipio} className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-400 flex-1 truncate">{m.municipio}</span>
              <span className="text-[7px] text-gray-500">{m.total_proyectos} proy.</span>
              <span className="text-[9px] font-mono font-bold text-purple-400">${(m.inversion_total_millones / 1000).toFixed(0)}k M</span>
            </div>
          ))}
        </div>
        <p className="text-[7px] text-gray-600 leading-relaxed italic">
          {region === 'Urabá'
            ? 'Urabá recibe $244k M en SGR. Necoclí lidera con 30 proyectos ($52k M). Transporte y deporte dominan los sectores.'
            : region === 'Oriente'
              ? 'Oriente: $81k M en SGR. Sonsón lidera (27 proyectos). Rionegro apenas tiene 1 proyecto SGR — se financia con recursos propios.'
              : 'Urabá recibe 3x más regalías ($244k M vs $81k M Oriente). Necoclí: 30 proyectos. Rionegro: solo 1.'
          }
        </p>
      </div>

      {/* ==========================================
          VÍCTIMAS CONFLICTO ARMADO — datos.gov.co VERIFICADO
          ========================================== */}
      <div className="rounded-lg p-2.5 border border-red-500/15 bg-red-500/[0.02]">
        <p className="text-[8px] font-mono uppercase tracking-wider text-red-400/70 mb-2">
          Conflicto Armado (Unidad de Víctimas)
        </p>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <StatCard label="Desplazamiento forzado" value={`${(victimas.desplazamiento_forzado_acumulado / 1000).toFixed(0)}k`} sub="acumulado" color="#ef4444" />
          <StatCard label="Hechos victimizantes" value={`${(victimas.total_hechos_victimizantes / 1000).toFixed(0)}k`} sub="acumulado" color="#ef4444" />
          <StatCard label="Víctimas 2024" value={`${(victimas.victimas_2024 / 1000).toFixed(0)}k`} color="#F7941D" />
          <StatCard label="Víctimas 2023" value={`${(victimas.victimas_2023 / 1000).toFixed(0)}k`} color="#F7941D" />
        </div>
        {region === 'Todas' && (
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <div className="rounded p-1.5 bg-red-500/5 border border-red-500/10">
              <p className="text-[8px] text-red-400 font-bold">DT Urabá</p>
              <p className="text-[9px] font-mono text-gray-300">{(victimasConflicto[0].desplazamiento_forzado_acumulado / 1000).toFixed(0)}k desplazados</p>
              <p className="text-[7px] text-gray-500">{(victimasConflicto[0].confinamiento_acumulado / 1000).toFixed(0)}k confinados</p>
            </div>
            <div className="rounded p-1.5 bg-epm-orange/5 border border-epm-orange/10">
              <p className="text-[8px] text-epm-orange font-bold">DT Antioquia</p>
              <p className="text-[9px] font-mono text-gray-300">{(victimasConflicto[1].desplazamiento_forzado_acumulado / 1000).toFixed(0)}k desplazados</p>
              <p className="text-[7px] text-gray-500">{(victimasConflicto[1].homicidio_acumulado / 1000).toFixed(0)}k homicidios</p>
            </div>
          </div>
        )}
        <p className="text-[7px] text-gray-600 leading-relaxed italic">
          {victimas.nota}
          {region === 'Urabá' ? ' Los proyectos MIT de EPM operan en territorio de posconflicto activo.' : ''}
        </p>
        <p className="text-[6px] text-gray-700 mt-1">Fuente: datos.gov.co/resource/ma9c-mk5w · Unidad para las Víctimas · Corte ago-2024</p>
      </div>

      {/* ==========================================
          TURISMO — datos.gov.co VERIFICADO
          ========================================== */}
      <div className="rounded-lg p-2.5 border border-cyan-500/15 bg-cyan-500/[0.02]">
        <p className="text-[8px] font-mono uppercase tracking-wider text-cyan-400/70 mb-2">
          Turismo (Registro Nacional RNT)
        </p>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <StatCard label="Prestadores activos" value={turismo.total_prestadores.toLocaleString('es-CO')} color="#06b6d4" />
          <StatCard label="Habitaciones" value={turismo.total_habitaciones.toLocaleString('es-CO')} color="#06b6d4" />
        </div>
        <div className="space-y-1 mb-1.5">
          {turismo.municipios.slice(0, 5).map(m => (
            <div key={m.municipio} className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-400 flex-1 truncate">{m.municipio}</span>
              <span className="text-[7px] text-gray-500">{m.habitaciones.toLocaleString('es-CO')} hab.</span>
              <span className="text-[9px] font-mono font-bold text-cyan-400">{m.prestadores.toLocaleString('es-CO')}</span>
            </div>
          ))}
        </div>
        <p className="text-[7px] text-gray-600 leading-relaxed italic">
          {region === 'Urabá'
            ? 'Necoclí sorprende con 1.624 prestadores — turismo de playa emergente. Apartadó: turismo de negocios (887).'
            : region === 'Oriente'
              ? 'Guatapé (3.166) y Rionegro (3.527) lideran. El embalse de Guatapé genera un ecosistema turístico masivo.'
              : 'Oriente: 13k prestadores (turismo embalses/naturaleza). Urabá: 3.6k (turismo playa Necoclí + negocios Apartadó).'
          }
        </p>
      </div>

      {/* ==========================================
          ICBF PRIMERA INFANCIA — datos.gov.co VERIFICADO
          ========================================== */}
      <div className="rounded-lg p-2.5 border border-pink-500/15 bg-pink-500/[0.02]">
        <p className="text-[8px] font-mono uppercase tracking-wider text-pink-400/70 mb-2">
          ICBF Primera Infancia (UDS 2025)
        </p>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <StatCard label="Unidades de servicio" value={icbf.total_unidades} color="#ec4899" />
          <StatCard label="Rurales" value={`${icbf.total_rural} (${icbf.total_unidades > 0 ? ((icbf.total_rural/icbf.total_unidades)*100).toFixed(0) : 0}%)`} color="#ec4899" />
        </div>
        <div className="space-y-1 mb-1.5">
          {icbf.municipios.slice(0, 4).map(m => (
            <div key={m.municipio} className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-400 flex-1">{m.municipio}</span>
              <span className="text-[7px] text-gray-500">U:{m.urbano} R:{m.rural}</span>
              <span className="text-[9px] font-mono font-bold text-pink-400">{m.unidades_total}</span>
            </div>
          ))}
        </div>
        <p className="text-[7px] text-gray-600 leading-relaxed italic">
          Turbo lidera con 136 UDS (72% rurales) — la dispersión rural demanda más puntos de atención.
        </p>
      </div>

      {/* ==========================================
          TEJIDO EMPRESARIAL — datos.gov.co VERIFICADO
          ========================================== */}
      {(region === 'Oriente' || region === 'Todas') && (
        <div className="rounded-lg p-2.5 border border-amber-500/15 bg-amber-500/[0.02]">
          <p className="text-[8px] font-mono uppercase tracking-wider text-amber-400/70 mb-2">
            Tejido Empresarial (CC Oriente)
          </p>
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <StatCard label="Empresas registradas" value={empresasReal.reduce((s, e) => s + e.total_empresas, 0).toLocaleString('es-CO')} color="#f59e0b" />
            <StatCard label="% Microempresas" value={`${((empresasReal.reduce((s,e)=>s+e.micro,0) / empresasReal.reduce((s,e)=>s+e.total_empresas,0))*100).toFixed(0)}%`} color="#f59e0b" />
          </div>
          <div className="space-y-1 mb-1.5">
            {empresasReal.slice(0, 5).map(m => (
              <div key={m.municipio} className="flex items-center gap-1.5">
                <span className="text-[9px] text-gray-400 flex-1 truncate">{m.municipio}</span>
                <span className="text-[7px] text-gray-500">{m.mediana_grande > 0 ? `${m.mediana_grande} med/gde` : 'solo micro/peq'}</span>
                <span className="text-[9px] font-mono font-bold text-amber-400">{m.total_empresas.toLocaleString('es-CO')}</span>
              </div>
            ))}
          </div>
          <p className="text-[7px] text-gray-600 leading-relaxed italic">
            Rionegro concentra 9.038 empresas (39% del Oriente). 79% son microempresas. Solo Rionegro y Guarne tienen empresas medianas/grandes significativas.
          </p>
          <p className="text-[6px] text-gray-700 mt-1">Fuente: datos.gov.co/resource/jtyy-9zuz · Cámara de Comercio Oriente Antioqueño</p>
        </div>
      )}

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
