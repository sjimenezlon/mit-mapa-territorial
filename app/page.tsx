'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { proyectos, ProyectoMIT } from '@/data/proyectos';
import { actores, ActorTerritorial } from '@/data/actores';
import type { MapMode } from '@/lib/mapStyles';
import FilterPanel from '@/components/FilterPanel';
import MetricsPanel from '@/components/MetricsPanel';
import Legend from '@/components/Legend';
import SearchBar from '@/components/SearchBar';
import ExportButton from '@/components/ExportButton';
import type { MapViewHandle } from '@/components/MapView';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export interface Filters {
  region: 'Urabá' | 'Oriente' | 'Todas';
  estructuras: Set<string>;
  negocios: Set<string>;
  factores: Set<string>;
  inversionMin: number;
  inversionMax: number;
}

export interface LayerState {
  proyectos: boolean;
  actores: boolean;
  choropleth: boolean;
  estructuras: boolean;
}

const MAX_INVERSION = Math.max(...proyectos.map(p => p.valor_inversion));

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    region: 'Todas',
    estructuras: new Set(),
    negocios: new Set(),
    factores: new Set(),
    inversionMin: 0,
    inversionMax: MAX_INVERSION,
  });

  const [layers, setLayers] = useState<LayerState>({
    proyectos: true,
    actores: false,
    choropleth: true,
    estructuras: false,
  });

  const [mapMode, setMapMode] = useState<MapMode>('dark');
  const [panelOpen, setPanelOpen] = useState(true);
  const [showBrechas, setShowBrechas] = useState(false);
  const [activeEnvLayers, setActiveEnvLayers] = useState<Set<string>>(new Set());
  const [selectedProject, setSelectedProject] = useState<ProyectoMIT | null>(null);
  const [selectedActor, setSelectedActor] = useState<ActorTerritorial | null>(null);
  const mapRef = useRef<MapViewHandle>(null);

  const filteredProyectos = useMemo(() => {
    return proyectos.filter(p => {
      if (filters.region !== 'Todas' && p.region !== filters.region) return false;
      if (filters.estructuras.size > 0 && !filters.estructuras.has(p.estructura_mit)) return false;
      if (filters.negocios.size > 0 && !filters.negocios.has(p.negocio_epm)) return false;
      if (filters.factores.size > 0) {
        const pFactors = p.factor_interaccion.toLowerCase();
        let match = false;
        filters.factores.forEach(f => {
          if (pFactors.includes(f.toLowerCase())) match = true;
        });
        if (!match) return false;
      }
      if (p.valor_inversion < filters.inversionMin || p.valor_inversion > filters.inversionMax) return false;
      return true;
    });
  }, [filters]);

  const filteredActores = useMemo(() => {
    return actores.filter(a => {
      if (filters.region === 'Todas') return true;
      return a.region === filters.region || a.region === 'Ambas';
    });
  }, [filters]);

  const handleToggleLayer = useCallback((layer: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const handleFlyTo = useCallback((lat: number, lng: number, zoom?: number) => {
    mapRef.current?.flyTo(lat, lng, zoom);
  }, []);

  return (
    <div id="mit-app" className="h-screen w-screen flex flex-col relative overflow-hidden bg-epm-darker">
      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-5 py-2.5 glass border-b border-epm-border">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-epm-green to-epm-blue flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-base font-bold tracking-tight text-white leading-none">MIT EPM</h1>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-epm-green/70">Modelo de Integración en el Territorio</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <SearchBar onFlyTo={handleFlyTo} />

          {/* Region selector */}
          <div className="flex items-center bg-epm-dark rounded-lg p-0.5 border border-epm-border">
            {(['Todas', 'Urabá', 'Oriente'] as const).map(r => (
              <button key={r} onClick={() => setFilters(f => ({ ...f, region: r }))}
                className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all duration-200 ${
                  filters.region === r ? 'bg-epm-green text-white shadow-lg shadow-epm-green/20' : 'text-gray-400 hover:text-white'
                }`}>{r}</button>
            ))}
          </div>

          {/* Map mode */}
          <div className="flex items-center bg-epm-dark rounded-lg p-0.5 border border-epm-border">
            {([
              { mode: 'dark' as MapMode, label: 'Oscuro', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> },
              { mode: 'light' as MapMode, label: 'Claro', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
              { mode: 'satellite' as MapMode, label: 'Orbital', icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
            ]).map(({ mode, icon, label }) => (
              <button key={mode} onClick={() => setMapMode(mode)}
                className={`px-2 py-1 rounded-md transition-all duration-200 flex items-center gap-1 ${
                  mapMode === mode ? mode === 'satellite' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-epm-green text-white' : 'text-gray-500 hover:text-white'
                }`} title={label}>
                {icon}<span className="text-[9px] font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Brechas toggle */}
          <button
            onClick={() => setShowBrechas(!showBrechas)}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${
              showBrechas
                ? 'border-red-500/40 bg-red-500/10 text-red-400'
                : 'border-epm-border text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Brechas
          </button>

          {/* Filter toggle */}
          <button onClick={() => setPanelOpen(!panelOpen)}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${
              panelOpen ? 'border-epm-green bg-epm-green/10 text-epm-green' : 'border-epm-border text-gray-400 hover:text-white hover:border-gray-600'
            }`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
            Filtros
          </button>

          {/* Export */}
          <ExportButton targetId="mit-app" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Filters */}
        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="flex-shrink-0 overflow-hidden border-r border-epm-border">
              <div className="w-[260px] h-full">
                <FilterPanel filters={filters} setFilters={setFilters} layers={layers} onToggleLayer={handleToggleLayer} maxInversion={MAX_INVERSION} activeEnvLayers={activeEnvLayers} setActiveEnvLayers={setActiveEnvLayers} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center: Map */}
        <div className="flex-1 relative min-w-0">
          <MapView
            ref={mapRef}
            proyectos={filteredProyectos}
            actores={filteredActores}
            layers={layers}
            mapMode={mapMode}
            region={filters.region}
            showBrechas={showBrechas}
            activeEnvLayers={activeEnvLayers}
            onSelectProject={setSelectedProject}
            onSelectActor={setSelectedActor}
          />

          <div className="absolute bottom-4 left-4 z-30">
            <Legend layers={layers} showBrechas={showBrechas} />
          </div>

          {/* Quick stats */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="glass rounded-full px-5 py-1.5 flex items-center gap-5">
              {showBrechas ? (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 glow-dot" style={{ animationDuration: '2s' }} />
                  <span className="text-[10px] font-mono text-red-400">
                    MODO BRECHAS <span className="text-gray-500">· Necesidades vs inversión</span>
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-epm-green glow-dot" />
                    <span className="text-[10px] font-mono text-gray-400">{filteredProyectos.length} <span className="text-gray-500">proyectos</span></span>
                  </div>
                  <div className="w-px h-3 bg-epm-border" />
                  <div className="text-[10px] font-mono">
                    <span className="text-epm-green font-bold">COP ${(filteredProyectos.reduce((s, p) => s + p.valor_inversion, 0)).toLocaleString('es-CO')}</span>
                    <span className="text-gray-500"> M</span>
                  </div>
                  <div className="w-px h-3 bg-epm-border" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-epm-blue" />
                    <span className="text-[10px] font-mono text-gray-400">{filteredActores.length} <span className="text-gray-500">actores</span></span>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right: Metrics */}
        <aside className="w-[320px] flex-shrink-0 border-l border-epm-border">
          <MetricsPanel proyectos={filteredProyectos} actores={filteredActores} region={filters.region} />
        </aside>
      </div>
    </div>
  );
}
