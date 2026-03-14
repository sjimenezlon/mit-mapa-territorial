'use client';

import { useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ProyectoMIT } from '@/data/proyectos';
import { ActorTerritorial, actores as allActores } from '@/data/actores';
import { municipios } from '@/data/municipios';
import { indicadores } from '@/data/indicadores';
import {
  DARK_TILE_URL, LIGHT_TILE_URL, SATELLITE_TILE_URL, SATELLITE_LABELS_URL,
  TILE_ATTRIBUTION, SATELLITE_ATTRIBUTION, REGION_BOUNDS, getMarkerSize,
  MapMode, ENV_LAYERS,
} from '@/lib/mapStyles';
import { formatCOP, getInversionPorMunicipio, getProyectosPorMunicipio, ESTRUCTURA_COLORS, NATURALEZA_COLORS } from '@/lib/utils';
import type { LayerState } from '@/app/page';

export interface MapViewHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
}

interface Props {
  proyectos: ProyectoMIT[];
  actores: ActorTerritorial[];
  layers: LayerState;
  mapMode: MapMode;
  region: 'Urabá' | 'Oriente' | 'Todas';
  showBrechas: boolean;
  activeEnvLayers: Set<string>;
  onSelectProject: (p: ProyectoMIT | null) => void;
  onSelectActor: (a: ActorTerritorial | null) => void;
}

// Shared map ref for flyTo
let globalMapRef: L.Map | null = null;

function MapRefCapture() {
  const map = useMap();
  useEffect(() => { globalMapRef = map; }, [map]);
  return null;
}

function MapController({ region }: { region: 'Urabá' | 'Oriente' | 'Todas' }) {
  const map = useMap();
  useEffect(() => {
    const bounds = REGION_BOUNDS[region];
    map.flyToBounds(bounds.bounds, { duration: 1.2, padding: [30, 30] });
  }, [region, map]);
  return null;
}

function MapModeController({ mapMode }: { mapMode: MapMode }) {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    container.classList.remove('map-mode-dark', 'map-mode-light', 'map-mode-satellite');
    container.classList.add(`map-mode-${mapMode}`);
  }, [mapMode, map]);
  return null;
}

function FlyToHandler({ target }: { target: { lat: number; lng: number; zoom: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom, { duration: 1.5 });
  }, [target, map]);
  return null;
}

function createActorIcon(naturaleza: string): L.DivIcon {
  const color = NATURALEZA_COLORS[naturaleza] || '#888';
  return L.divIcon({
    className: 'custom-actor-icon',
    html: `<div style="width:24px;height:24px;background:${color};border:2px solid rgba(255,255,255,0.3);border-radius:6px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${color}44,0 2px 8px rgba(0,0,0,0.4);transform:rotate(45deg);"><div style="transform:rotate(-45deg);font-size:10px;color:white;font-weight:bold;">${naturaleza === 'Público' ? '⚖' : naturaleza === 'Privado' ? '◆' : naturaleza === 'Comunitario' ? '♦' : '●'}</div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

/** Compute gap score for a municipality (0 = no gaps, 100 = critical) */
function computeGapScore(municipioName: string, inversionMap: Record<string, number>): { score: number; gaps: string[] } {
  const ind = indicadores.find(i => i.municipio === municipioName);
  if (!ind) return { score: 0, gaps: [] };
  const inv = inversionMap[municipioName] || 0;

  const gaps: string[] = [];
  let score = 0;

  if (ind.cobertura_acueducto < 60) { score += 20; gaps.push(`Acueducto ${ind.cobertura_acueducto.toFixed(0)}%`); }
  else if (ind.cobertura_acueducto < 80) { score += 10; }

  if (ind.cobertura_alcantarillado < 40) { score += 20; gaps.push(`Alcantarillado ${ind.cobertura_alcantarillado.toFixed(0)}%`); }
  else if (ind.cobertura_alcantarillado < 60) { score += 10; }

  if (ind.cobertura_gas < 15) { score += 10; gaps.push(`Gas ${ind.cobertura_gas.toFixed(0)}%`); }
  if (ind.cobertura_internet < 20) { score += 10; gaps.push(`Internet ${ind.cobertura_internet.toFixed(0)}%`); }
  if (ind.ipm > 50) { score += 20; gaps.push(`IPM ${ind.ipm.toFixed(0)}%`); }
  else if (ind.ipm > 30) { score += 10; }
  if (ind.nbi > 50) { score += 10; gaps.push(`NBI ${ind.nbi.toFixed(0)}%`); }

  // Bonus: low investment relative to needs
  if (inv < 10000 && score > 30) { score += 10; gaps.push('Baja inversión MIT'); }

  return { score: Math.min(100, score), gaps };
}

/** Generate a curved line between two points */
function getCurvedPoints(from: [number, number], to: [number, number]): [number, number][] {
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[1] - from[1]) ** 2);
  const offsetLat = midLat + dist * 0.15;
  const offsetLng = midLng - dist * 0.1;

  const points: [number, number][] = [];
  for (let t = 0; t <= 1; t += 0.05) {
    const lat = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * offsetLat + t * t * to[0];
    const lng = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * offsetLng + t * t * to[1];
    points.push([lat, lng]);
  }
  return points;
}

const MapView = forwardRef<MapViewHandle, Props>(function MapView(
  { proyectos, actores, layers, mapMode, region, showBrechas, activeEnvLayers, onSelectProject, onSelectActor },
  ref
) {
  const inversionMap = useMemo(() => getInversionPorMunicipio(proyectos), [proyectos]);
  const proyectosByMunicipio = useMemo(() => getProyectosPorMunicipio(proyectos), [proyectos]);
  const maxInversion = useMemo(() => Math.max(...Object.values(inversionMap), 1), [inversionMap]);

  // Gap scores for brechas mode
  const gapScores = useMemo(() => {
    const scores: Record<string, { score: number; gaps: string[] }> = {};
    municipios.forEach(m => {
      scores[m.nombre] = computeGapScore(m.nombre, inversionMap);
    });
    return scores;
  }, [inversionMap]);

  // Actor-project connections
  const connections = useMemo(() => {
    if (!layers.actores || !layers.proyectos) return [];
    const lines: { from: [number, number]; to: [number, number]; color: string }[] = [];

    actores.forEach(actor => {
      if (!actor.coordenadas) return;
      const actorRegion = actor.region;
      proyectos.forEach(proj => {
        if (!proj.coordenadas) return;
        if (actorRegion !== 'Ambas' && actorRegion !== proj.region) return;
        // Only connect if actor is in a municipio where the project operates, or region match for regional actors
        const hasOverlap = actor.municipio_sede && proj.municipios.some(m =>
          m.toLowerCase() === actor.municipio_sede?.toLowerCase()
        );
        const isRegionalMatch = !actor.municipio_sede && (actorRegion === proj.region || actorRegion === 'Ambas');

        if (hasOverlap || isRegionalMatch) {
          lines.push({
            from: [actor.coordenadas!.lat, actor.coordenadas!.lng],
            to: [proj.coordenadas!.lat, proj.coordenadas!.lng],
            color: NATURALEZA_COLORS[actor.naturaleza] || '#888',
          });
        }
      });
    });
    return lines;
  }, [actores, proyectos, layers.actores, layers.proyectos]);

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, zoom: number = 13) => {
      globalMapRef?.flyTo([lat, lng], zoom, { duration: 1.5 });
    },
  }));

  const bounds = REGION_BOUNDS[region];
  const isSatellite = mapMode === 'satellite';

  return (
    <MapContainer
      center={[bounds.center.lat, bounds.center.lng]}
      zoom={bounds.zoom}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={true}
      minZoom={6}
      maxZoom={16}
    >
      <MapRefCapture />
      <MapController region={region} />
      <MapModeController mapMode={mapMode} />

      {/* Base tiles */}
      {!isSatellite && (
        <TileLayer key={mapMode} url={mapMode === 'dark' ? DARK_TILE_URL : LIGHT_TILE_URL} attribution={TILE_ATTRIBUTION} />
      )}
      {isSatellite && (
        <>
          <TileLayer key="sat-base" url={SATELLITE_TILE_URL} attribution={SATELLITE_ATTRIBUTION} className="satellite-base-tiles" />
          <TileLayer key="sat-overlay" url={DARK_TILE_URL} attribution="" className="satellite-dark-overlay" opacity={0.55} />
          <TileLayer key="sat-labels" url={SATELLITE_LABELS_URL} attribution="" className="satellite-labels-layer" />
        </>
      )}

      {/* ========== ENVIRONMENTAL OVERLAY LAYERS ========== */}
      {ENV_LAYERS.filter(l => activeEnvLayers.has(l.id)).map(layer => (
        <TileLayer
          key={`env-${layer.id}`}
          url={layer.url}
          attribution={layer.attribution}
          opacity={layer.opacity}
          className={`env-layer-${layer.id}`}
        />
      ))}

      {/* ========== BRECHAS MODE ========== */}
      {showBrechas && municipios.map(mun => {
        const gap = gapScores[mun.nombre];
        if (!gap || gap.score === 0) return null;
        const ratio = gap.score / 100;
        const ind = indicadores.find(i => i.municipio === mun.nombre);
        const inv = inversionMap[mun.nombre] || 0;
        // Red for high gap, yellow for medium, green for low
        const color = ratio > 0.6 ? '#ef4444' : ratio > 0.3 ? '#F7941D' : '#eab308';
        return (
          <CircleMarker
            key={`gap-${mun.codigo_dane}`}
            center={[mun.coordenadas.lat, mun.coordenadas.lng]}
            radius={12 + ratio * 25}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.15 + ratio * 0.25,
              color: color,
              weight: 2,
              opacity: 0.4 + ratio * 0.5,
              dashArray: ratio > 0.5 ? undefined : '4 4',
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'var(--font-body)', minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>
                    {gap.score}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{mun.nombre}</h3>
                    <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Índice de brecha: {gap.score > 60 ? 'CRÍTICO' : gap.score > 30 ? 'MEDIO' : 'BAJO'}
                    </p>
                  </div>
                </div>

                {/* Gap list */}
                <div style={{ marginBottom: 8, padding: '6px 8px', background: `${color}08`, borderRadius: 6, border: `1px solid ${color}20` }}>
                  <p style={{ fontSize: 9, color, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brechas detectadas</p>
                  {gap.gaps.map((g, i) => (
                    <p key={i} style={{ fontSize: 10, color: '#cbd5e1', marginBottom: 1 }}>· {g}</p>
                  ))}
                </div>

                {/* DANE indicators */}
                {ind && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 8 }}>
                    {[
                      { label: 'Población', value: `${(ind.poblacion_2024/1000).toFixed(0)}k` },
                      { label: 'IPM', value: `${ind.ipm}%` },
                      { label: 'NBI', value: `${ind.nbi}%` },
                      { label: 'Acueducto', value: `${ind.cobertura_acueducto}%` },
                      { label: 'Alcant.', value: `${ind.cobertura_alcantarillado}%` },
                      { label: 'Internet', value: `${ind.cobertura_internet}%` },
                    ].map((s, i) => (
                      <div key={i} style={{ textAlign: 'center', padding: '3px 2px', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
                        <p style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase' }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: '6px 8px', background: 'rgba(0,166,81,0.05)', borderRadius: 6, border: '1px solid rgba(0,166,81,0.15)' }}>
                  <p style={{ fontSize: 9, color: '#64748b' }}>Inversión MIT actual</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: inv > 0 ? '#00A651' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                    {inv > 0 ? formatCOP(Math.round(inv)) : 'Sin inversión directa'}
                  </p>
                  <p style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>
                    {(proyectosByMunicipio[mun.nombre] || []).length} proyectos vinculados
                  </p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* ========== CHOROPLETH ========== */}
      {!showBrechas && layers.choropleth && municipios.map(mun => {
        const inv = inversionMap[mun.nombre] || 0;
        if (inv === 0) return null;
        const ratio = inv / maxInversion;
        const glowColor = isSatellite ? '#00ffaa' : '#00A651';
        const ind = indicadores.find(i => i.municipio === mun.nombre);
        return (
          <CircleMarker
            key={`choro-${mun.codigo_dane}`}
            center={[mun.coordenadas.lat, mun.coordenadas.lng]}
            radius={Math.max(15, 40 * ratio)}
            pathOptions={{
              fillColor: glowColor,
              fillOpacity: isSatellite ? 0.08 + ratio * 0.18 : 0.12 + ratio * 0.2,
              color: glowColor,
              weight: isSatellite ? 1.5 : 1,
              opacity: isSatellite ? 0.5 + ratio * 0.5 : 0.3 + ratio * 0.4,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'var(--font-body)', minWidth: 280 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 2, color: '#fff' }}>
                  {mun.nombre}
                </h3>
                <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  {mun.region} · DANE {mun.codigo_dane}
                </p>

                {/* Indicadores grid */}
                {ind && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 8 }}>
                    {[
                      { label: 'Población', value: `${(ind.poblacion_2024/1000).toFixed(0)}k`, color: '#e2e8f0' },
                      { label: 'IPM', value: `${ind.ipm}%`, color: ind.ipm > 40 ? '#ef4444' : ind.ipm > 20 ? '#F7941D' : '#00A651' },
                      { label: 'NBI', value: `${ind.nbi}%`, color: ind.nbi > 40 ? '#ef4444' : '#F7941D' },
                      { label: 'Acueducto', value: `${ind.cobertura_acueducto}%`, color: ind.cobertura_acueducto > 80 ? '#00A651' : '#F7941D' },
                      { label: 'Energía', value: `${ind.cobertura_energia}%`, color: '#00A651' },
                      { label: 'Internet', value: `${ind.cobertura_internet}%`, color: ind.cobertura_internet > 40 ? '#004F9F' : '#ef4444' },
                      { label: 'Gas', value: `${ind.cobertura_gas}%`, color: ind.cobertura_gas > 30 ? '#58595B' : '#ef4444' },
                      { label: 'Ruralidad', value: `${ind.ruralidad}%`, color: '#00A651' },
                      { label: 'IDM', value: `${ind.indice_desempeno_municipal}`, color: '#004F9F' },
                    ].map((s, i) => (
                      <div key={i} style={{ textAlign: 'center', padding: '4px 2px', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
                        <p style={{ fontSize: 7, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                        <p style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ padding: '6px 8px', borderTop: '1px solid #1e293b', marginBottom: 6 }}>
                  <p style={{ fontSize: 9, color: '#94a3b8' }}>Inversión MIT total</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#00A651', fontFamily: 'var(--font-mono)' }}>
                    {formatCOP(Math.round(inv))}
                  </p>
                </div>

                <p style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>
                  {(proyectosByMunicipio[mun.nombre] || []).length} proyectos:
                </p>
                {proyectosByMunicipio[mun.nombre] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {proyectosByMunicipio[mun.nombre].slice(0, 5).map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 9, color: '#cbd5e1' }}>{p.nombre}</span>
                        <span style={{ fontSize: 8, color: '#00A651', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {formatCOP(p.valor_inversion)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actores in this municipality */}
                {(() => {
                  const localActors = allActores.filter(a =>
                    a.municipio_sede?.toLowerCase() === mun.nombre.toLowerCase() ||
                    (a.region === mun.region || a.region === 'Ambas')
                  ).slice(0, 4);
                  if (localActors.length === 0) return null;
                  return (
                    <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #1e293b' }}>
                      <p style={{ fontSize: 9, color: '#94a3b8', marginBottom: 3 }}>Actores presentes:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {localActors.map(a => (
                          <span key={a.id} style={{
                            fontSize: 8, padding: '2px 6px', borderRadius: 4,
                            background: `${NATURALEZA_COLORS[a.naturaleza] || '#888'}15`,
                            color: NATURALEZA_COLORS[a.naturaleza] || '#888',
                            border: `1px solid ${NATURALEZA_COLORS[a.naturaleza] || '#888'}30`,
                          }}>
                            {a.organizacion}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Estructura MIT overlay */}
      {!showBrechas && layers.estructuras && municipios.map(mun => {
        const muniProjects = proyectosByMunicipio[mun.nombre];
        if (!muniProjects || muniProjects.length === 0) return null;
        const structCount: Record<string, number> = {};
        muniProjects.forEach(p => { structCount[p.estructura_mit] = (structCount[p.estructura_mit] || 0) + p.valor_inversion; });
        const dominant = Object.entries(structCount).sort((a, b) => b[1] - a[1])[0][0];
        const color = ESTRUCTURA_COLORS[dominant] || '#888';
        return (
          <CircleMarker key={`struct-${mun.codigo_dane}`} center={[mun.coordenadas.lat, mun.coordenadas.lng]} radius={20}
            pathOptions={{ fillColor: color, fillOpacity: 0.25, color, weight: 2, opacity: 0.6 }}>
            <Popup>
              <div style={{ fontFamily: 'var(--font-body)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fff' }}>{mun.nombre}</h3>
                <p style={{ fontSize: 11, color, fontWeight: 600, marginTop: 4 }}>Estructura predominante: {dominant}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* ========== ACTOR-PROJECT CONNECTIONS ========== */}
      {layers.actores && layers.proyectos && connections.map((conn, i) => (
        <Polyline
          key={`conn-${i}`}
          positions={getCurvedPoints(conn.from, conn.to)}
          pathOptions={{
            color: conn.color,
            weight: 1,
            opacity: 0.25,
            dashArray: '3 6',
          }}
        />
      ))}

      {/* Project markers */}
      {layers.proyectos && proyectos.map(p => {
        if (!p.coordenadas) return null;
        const size = getMarkerSize(p.valor_inversion);
        const structColor = ESTRUCTURA_COLORS[p.estructura_mit] || '#00A651';
        return (
          <CircleMarker key={`proj-${p.id}`} center={[p.coordenadas.lat, p.coordenadas.lng]} radius={size / 2}
            pathOptions={{ fillColor: isSatellite ? '#fff' : structColor, fillOpacity: isSatellite ? 0.9 : 0.7, color: isSatellite ? structColor : '#fff', weight: isSatellite ? 2.5 : 1.5, opacity: 0.8 }}
            eventHandlers={{ click: () => onSelectProject(p) }}>
            <Popup>
              <div style={{ fontFamily: 'var(--font-body)', minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: structColor, boxShadow: `0 0 8px ${structColor}88` }} />
                  <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: structColor, fontWeight: 600 }}>{p.estructura_mit}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 6 }}>{p.nombre}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <div><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Negocio</p><p style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 500 }}>{p.negocio_epm}</p></div>
                  <div><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Factor</p><p style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 500 }}>{p.factor_interaccion}</p></div>
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(0,166,81,0.08)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(0,166,81,0.15)' }}>
                  <p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Inversión</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#00A651', fontFamily: 'var(--font-mono)' }}>{formatCOP(p.valor_inversion)}</p>
                </div>
                <div><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 }}>Municipios</p><p style={{ fontSize: 11, color: '#cbd5e1' }}>{p.municipios.join(', ')}</p></div>
                <div style={{ marginTop: 6 }}><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 }}>Indicadores</p><p style={{ fontSize: 10, color: '#94a3b8' }}>{p.indicadores}</p></div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Actor markers */}
      {layers.actores && actores.map(a => {
        if (!a.coordenadas) return null;
        return (
          <Marker key={`actor-${a.id}`} position={[a.coordenadas.lat, a.coordenadas.lng]} icon={createActorIcon(a.naturaleza)}
            eventHandlers={{ click: () => onSelectActor(a) }}>
            <Popup>
              <div style={{ fontFamily: 'var(--font-body)', minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: NATURALEZA_COLORS[a.naturaleza] || '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white' }}>
                    {a.naturaleza === 'Público' ? '⚖' : a.naturaleza === 'Privado' ? '◆' : '♦'}
                  </div>
                  <div>
                    <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b' }}>{a.tipo_actor}</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fff' }}>{a.organizacion}</h3>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                  <div><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Naturaleza</p><p style={{ fontSize: 11, color: '#cbd5e1' }}>{a.naturaleza}</p></div>
                  <div><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Posición</p><p style={{ fontSize: 11, color: a.posicion === 'Aliado' ? '#00A651' : a.posicion === 'En tensión' ? '#ef4444' : '#cbd5e1' }}>{a.posicion}</p></div>
                  <div><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Interés</p><p style={{ fontSize: 11, color: '#cbd5e1' }}>{a.intereses}</p></div>
                  <div><p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Influencia</p><p style={{ fontSize: 11, color: a.nivel_influencia === 'Alto' ? '#F7941D' : '#94a3b8' }}>{a.nivel_influencia}</p></div>
                </div>
                <p style={{ fontSize: 10, color: '#94a3b8' }}>Región: {a.region} {a.municipio_sede ? `· ${a.municipio_sede}` : ''}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
});

export default MapView;
