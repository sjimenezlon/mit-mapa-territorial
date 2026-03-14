'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ProyectoMIT } from '@/data/proyectos';
import { ActorTerritorial } from '@/data/actores';
import { indicadores, getPromedioRegion } from '@/data/indicadores';
import { getTotalInversion, getDistribucionEstructura, getDistribucionNegocio, formatCOP } from '@/lib/utils';
import TerritorialData from '@/components/TerritorialData';

interface Props {
  proyectos: ProyectoMIT[];
  actores: ActorTerritorial[];
  region: 'Urabá' | 'Oriente' | 'Todas';
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 border border-epm-border">
      <p className="text-[10px] text-gray-400">{payload[0].name}</p>
      <p className="text-sm font-mono font-bold text-epm-green">{formatCOP(payload[0].value)}</p>
    </div>
  );
}

function BarIndicator({ label, value, max, color, suffix }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[9px] text-gray-500">{label}</span>
        <span className="text-[10px] font-mono text-gray-300">{value.toFixed(1)}{suffix || '%'}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function MetricsPanel({ proyectos, actores, region }: Props) {
  const total = useMemo(() => getTotalInversion(proyectos), [proyectos]);
  const estructuraData = useMemo(() => getDistribucionEstructura(proyectos), [proyectos]);
  const negocioData = useMemo(() => getDistribucionNegocio(proyectos), [proyectos]);
  const top5 = useMemo(
    () => [...proyectos].sort((a, b) => b.valor_inversion - a.valor_inversion).slice(0, 5),
    [proyectos]
  );

  // Territorial indicators
  const regionIndicators = useMemo(() => {
    if (region === 'Todas') {
      return { uraba: getPromedioRegion('Urabá'), oriente: getPromedioRegion('Oriente') };
    }
    return { selected: getPromedioRegion(region) };
  }, [region]);

  return (
    <div className="h-full bg-epm-dark/80 backdrop-blur-xl overflow-y-auto py-3 px-3.5 space-y-4">
      <div>
        <h2 className="font-display text-sm font-bold text-white">Indicadores MIT</h2>
        <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-gray-500">Actualizados según filtros</p>
      </div>

      {/* Total investment */}
      <div className="gradient-border rounded-xl p-3 bg-epm-dark/50">
        <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">Inversión total</p>
        <p className="text-xl font-mono font-bold text-epm-green leading-none mb-0.5">
          COP ${total.toLocaleString('es-CO')}
        </p>
        <p className="text-[9px] text-gray-500">millones COP</p>
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-epm-border">
          <div>
            <p className="text-base font-mono font-bold text-white">{proyectos.length}</p>
            <p className="text-[8px] text-gray-500 uppercase">Proyectos</p>
          </div>
          <div className="w-px h-6 bg-epm-border" />
          <div>
            <p className="text-base font-mono font-bold text-white">{actores.length}</p>
            <p className="text-[8px] text-gray-500 uppercase">Actores</p>
          </div>
          <div className="w-px h-6 bg-epm-border" />
          <div>
            <p className="text-base font-mono font-bold text-white">
              {new Set(proyectos.flatMap(p => p.municipios)).size}
            </p>
            <p className="text-[8px] text-gray-500 uppercase">Municipios</p>
          </div>
        </div>
      </div>

      {/* Donut - Estructura MIT */}
      <div>
        <h3 className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-2">
          Distribución Estructura MIT
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-[100px] h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={estructuraData} cx="50%" cy="50%" innerRadius={30} outerRadius={46} dataKey="value" strokeWidth={0}>
                  {estructuraData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1">
            {estructuraData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-gray-300 truncate">{d.name}</p>
                  <p className="text-[8px] font-mono text-gray-500">{formatCOP(d.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Bar chart - Negocio EPM */}
      <div>
        <h3 className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-2">
          Por Negocio EPM
        </h3>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={negocioData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={12}>
                {negocioData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Top 5 projects */}
      <div>
        <h3 className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-2">
          Top 5 por Inversión
        </h3>
        <div className="space-y-1.5">
          {top5.map((p, i) => {
            const ratio = p.valor_inversion / (top5[0]?.valor_inversion || 1);
            return (
              <div key={p.id}>
                <div className="flex items-start gap-1.5 mb-0.5">
                  <span className="text-[8px] font-mono text-gray-600 mt-0.5 w-2.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-300 leading-tight truncate">{p.nombre}</p>
                    <p className="text-[8px] text-gray-500">{p.region} · {p.negocio_epm}</p>
                  </div>
                  <span className="text-[9px] font-mono text-epm-green font-bold flex-shrink-0">
                    {formatCOP(p.valor_inversion)}
                  </span>
                </div>
                <div className="ml-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-epm-green to-epm-green/50 transition-all duration-700"
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* ==========================================
          INDICADORES TERRITORIALES DANE / DNP
          ========================================== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 rounded bg-epm-blue/20 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#004F9F" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v-2" /><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-white">Contexto Territorial</h3>
            <p className="text-[7px] font-mono uppercase tracking-[0.15em] text-epm-orange/60">DANE CNPV 2018 · Estimaciones</p>
          </div>
        </div>

        {region === 'Todas' ? (
          /* Comparison mode: Urabá vs Oriente */
          <div className="space-y-3">
            {(['Urabá', 'Oriente'] as const).map(r => {
              const avg = getPromedioRegion(r);
              if (!avg) return null;
              const isUraba = r === 'Urabá';
              return (
                <div key={r} className={`rounded-lg p-2.5 border ${isUraba ? 'border-epm-orange/20 bg-epm-orange/[0.03]' : 'border-epm-green/20 bg-epm-green/[0.03]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold ${isUraba ? 'text-epm-orange' : 'text-epm-green'}`}>{r}</span>
                    <span className="text-[8px] font-mono text-gray-500">
                      {(avg.poblacion_total / 1000).toFixed(0)}k hab.
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <BarIndicator label="Pobreza multidimensional" value={avg.ipm} max={100} color={avg.ipm > 40 ? '#ef4444' : avg.ipm > 20 ? '#F7941D' : '#00A651'} />
                    <BarIndicator label="Acueducto" value={avg.cobertura_acueducto} max={100} color="#004F9F" />
                    <BarIndicator label="Alcantarillado" value={avg.cobertura_alcantarillado} max={100} color="#004F9F" />
                    <BarIndicator label="Energía eléctrica" value={avg.cobertura_energia} max={100} color="#F7941D" />
                    <BarIndicator label="Gas natural" value={avg.cobertura_gas} max={100} color="#58595B" />
                    <BarIndicator label="Internet" value={avg.cobertura_internet} max={100} color="#8B5CF6" />
                    <BarIndicator label="NBI" value={avg.nbi} max={100} color={avg.nbi > 40 ? '#ef4444' : '#F7941D'} />
                    <BarIndicator label="Ruralidad" value={avg.ruralidad} max={100} color="#00A651" />
                  </div>
                </div>
              );
            })}
            <p className="text-[8px] text-gray-600 text-center italic">
              Compara las brechas entre regiones para entender el impacto del MIT
            </p>
          </div>
        ) : (
          /* Single region detail */
          (() => {
            const avg = getPromedioRegion(region);
            if (!avg) return null;
            const isUraba = region === 'Urabá';
            const accent = isUraba ? '#F7941D' : '#00A651';
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold" style={{ color: accent }}>{region}</span>
                  <span className="text-[8px] font-mono text-gray-500">
                    {(avg.poblacion_total / 1000).toFixed(0)}k habitantes
                  </span>
                </div>
                <div className="space-y-1.5">
                  <BarIndicator label="Pobreza multidimensional (IPM)" value={avg.ipm} max={100} color={avg.ipm > 40 ? '#ef4444' : avg.ipm > 20 ? '#F7941D' : '#00A651'} />
                  <BarIndicator label="Cobertura acueducto" value={avg.cobertura_acueducto} max={100} color="#004F9F" />
                  <BarIndicator label="Cobertura alcantarillado" value={avg.cobertura_alcantarillado} max={100} color="#004F9F" />
                  <BarIndicator label="Cobertura energía" value={avg.cobertura_energia} max={100} color="#F7941D" />
                  <BarIndicator label="Cobertura gas natural" value={avg.cobertura_gas} max={100} color="#58595B" />
                  <BarIndicator label="Cobertura internet" value={avg.cobertura_internet} max={100} color="#8B5CF6" />
                  <BarIndicator label="Necesidades Básicas Insatisfechas" value={avg.nbi} max={100} color={avg.nbi > 40 ? '#ef4444' : '#F7941D'} />
                  <BarIndicator label="Ruralidad" value={avg.ruralidad} max={100} color="#00A651" />
                </div>

                {/* Highlight the gap */}
                {isUraba && (
                  <div className="rounded-lg p-2 bg-red-500/[0.05] border border-red-500/20">
                    <p className="text-[9px] text-red-400 font-medium mb-0.5">Brechas significativas</p>
                    <p className="text-[8px] text-gray-400 leading-relaxed">
                      Urabá presenta un IPM promedio de {avg.ipm.toFixed(1)}% vs. {getPromedioRegion('Oriente')?.ipm.toFixed(1)}% en Oriente.
                      La cobertura de acueducto ({avg.cobertura_acueducto.toFixed(0)}%) es {(getPromedioRegion('Oriente')!.cobertura_acueducto - avg.cobertura_acueducto).toFixed(0)} puntos menor.
                    </p>
                  </div>
                )}
              </div>
            );
          })()
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Live API Data */}
      <TerritorialData region={region} />
    </div>
  );
}
