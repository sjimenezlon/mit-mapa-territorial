'use client';

import { motion } from 'framer-motion';
import type { Filters, LayerState } from '@/app/page';
import { ENV_LAYERS } from '@/lib/mapStyles';

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  layers: LayerState;
  onToggleLayer: (layer: keyof LayerState) => void;
  maxInversion: number;
  activeEnvLayers: Set<string>;
  setActiveEnvLayers: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const ESTRUCTURAS = ['Ecológica', 'Físico-Espacial', 'Institucional', 'Socioeconómica'];
const NEGOCIOS = ['Generación', 'Transmisión y distribución', 'Agua y Saneamiento', 'Gas', 'Presencia Social', 'Transversal'];
const FACTORES = ['Agua', 'Energía', 'Conectividad', 'Biodiversidad', 'Institucional'];

const ESTRUCTURA_COLORS: Record<string, string> = {
  'Ecológica': '#00A651',
  'Físico-Espacial': '#58595B',
  'Institucional': '#004F9F',
  'Socioeconómica': '#F7941D',
};

function toggleSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function LayerToggle({ label, active, onToggle, color }: { label: string; active: boolean; onToggle: () => void; color: string }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-1.5 group"
    >
      <span className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
      <div className={`w-8 h-[18px] rounded-full transition-all duration-300 flex items-center ${active ? '' : 'bg-gray-700'}`}
        style={{ background: active ? `${color}33` : undefined }}
      >
        <motion.div
          animate={{ x: active ? 14 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-[14px] h-[14px] rounded-full"
          style={{ background: active ? color : '#4b5563' }}
        />
      </div>
    </button>
  );
}

export default function FilterPanel({ filters, setFilters, layers, onToggleLayer, maxInversion, activeEnvLayers, setActiveEnvLayers }: Props) {
  const toggleEnvLayer = (id: string) => {
    setActiveEnvLayers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return (
    <div className="h-full glass overflow-y-auto py-4 px-4 space-y-5">
      <div>
        <h2 className="font-display text-sm font-bold text-white mb-1">Capas</h2>
        <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-3">Visualización activa</p>
        <div className="space-y-1">
          <LayerToggle label="Proyectos" active={layers.proyectos} onToggle={() => onToggleLayer('proyectos')} color="#00A651" />
          <LayerToggle label="Actores territoriales" active={layers.actores} onToggle={() => onToggleLayer('actores')} color="#004F9F" />
          <LayerToggle label="Choropleth inversión" active={layers.choropleth} onToggle={() => onToggleLayer('choropleth')} color="#F7941D" />
          <LayerToggle label="Estructuras MIT" active={layers.estructuras} onToggle={() => onToggleLayer('estructuras')} color="#8B5CF6" />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Environmental / Territorial Layers */}
      <div>
        <h2 className="font-display text-sm font-bold text-white mb-1">Capas territoriales</h2>
        <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-3">NASA · ESRI · OpenTopo</p>
        <div className="space-y-1">
          {ENV_LAYERS.map(layer => (
            <button
              key={layer.id}
              onClick={() => toggleEnvLayer(layer.id)}
              className="flex items-center justify-between w-full py-1.5 group"
            >
              <div className="flex-1 min-w-0 mr-2">
                <span className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors block truncate">{layer.name}</span>
                {activeEnvLayers.has(layer.id) && (
                  <span className="text-[8px] text-gray-600 block truncate">{layer.description.split('—')[1]?.trim() || layer.description}</span>
                )}
              </div>
              <div className={`w-8 h-[18px] rounded-full transition-all duration-300 flex items-center flex-shrink-0 ${activeEnvLayers.has(layer.id) ? '' : 'bg-gray-700'}`}
                style={{ background: activeEnvLayers.has(layer.id) ? `${layer.color}33` : undefined }}>
                <motion.div
                  animate={{ x: activeEnvLayers.has(layer.id) ? 14 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-[14px] h-[14px] rounded-full"
                  style={{ background: activeEnvLayers.has(layer.id) ? layer.color : '#4b5563' }}
                />
              </div>
            </button>
          ))}
        </div>
        {activeEnvLayers.size > 0 && (
          <button
            onClick={() => setActiveEnvLayers(new Set())}
            className="text-[9px] text-gray-500 hover:text-epm-green mt-1.5 transition-colors"
          >
            Desactivar todas
          </button>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Estructura MIT */}
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-2">Estructura MIT</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {ESTRUCTURAS.map(e => {
            const active = filters.estructuras.has(e);
            const color = ESTRUCTURA_COLORS[e];
            return (
              <button
                key={e}
                onClick={() => setFilters(f => ({ ...f, estructuras: toggleSet(f.estructuras, e) }))}
                className={`text-[10px] px-2.5 py-1.5 rounded-md border transition-all duration-200 text-left ${
                  active
                    ? 'border-opacity-50 text-white'
                    : 'border-epm-border text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }`}
                style={active ? {
                  borderColor: color,
                  background: `${color}15`,
                  color: color,
                } : {}}
              >
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: active ? color : '#4b5563' }} />
                  {e}
                </span>
              </button>
            );
          })}
        </div>
        {filters.estructuras.size > 0 && (
          <button
            onClick={() => setFilters(f => ({ ...f, estructuras: new Set() }))}
            className="text-[9px] text-gray-500 hover:text-epm-green mt-1.5 transition-colors"
          >
            Limpiar selección
          </button>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Negocio EPM */}
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-2">Negocio EPM</h3>
        <div className="space-y-1">
          {NEGOCIOS.map(n => {
            const active = filters.negocios.has(n);
            return (
              <button
                key={n}
                onClick={() => setFilters(f => ({ ...f, negocios: toggleSet(f.negocios, n) }))}
                className={`w-full text-left text-[10px] px-2.5 py-1.5 rounded-md border transition-all duration-200 ${
                  active
                    ? 'border-epm-green/40 bg-epm-green/10 text-epm-green'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-epm-green' : 'bg-gray-600'}`} />
                  {n}
                </span>
              </button>
            );
          })}
        </div>
        {filters.negocios.size > 0 && (
          <button
            onClick={() => setFilters(f => ({ ...f, negocios: new Set() }))}
            className="text-[9px] text-gray-500 hover:text-epm-green mt-1.5 transition-colors"
          >
            Limpiar selección
          </button>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Factor de interacción */}
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-2">Factor de interacción</h3>
        <div className="flex flex-wrap gap-1.5">
          {FACTORES.map(f => {
            const active = filters.factores.has(f);
            return (
              <button
                key={f}
                onClick={() => setFilters(prev => ({ ...prev, factores: toggleSet(prev.factores, f) }))}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all duration-200 ${
                  active
                    ? 'border-epm-orange/40 bg-epm-orange/10 text-epm-orange'
                    : 'border-epm-border text-gray-500 hover:text-gray-300'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-epm-border to-transparent" />

      {/* Rango de inversión */}
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-3">Rango de inversión</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] font-mono text-gray-500">
            <span>COP ${filters.inversionMin.toLocaleString('es-CO')} M</span>
            <span>COP ${filters.inversionMax.toLocaleString('es-CO')} M</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxInversion}
            step={1000}
            value={filters.inversionMin}
            onChange={e => setFilters(f => ({ ...f, inversionMin: Number(e.target.value) }))}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-epm-green"
          />
          <input
            type="range"
            min={0}
            max={maxInversion}
            step={1000}
            value={filters.inversionMax}
            onChange={e => setFilters(f => ({ ...f, inversionMax: Number(e.target.value) }))}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-epm-green"
          />
        </div>
      </div>

      {/* Reset all */}
      <button
        onClick={() => setFilters({
          region: 'Todas',
          estructuras: new Set(),
          negocios: new Set(),
          factores: new Set(),
          inversionMin: 0,
          inversionMax: maxInversion,
        })}
        className="w-full text-[10px] py-2 rounded-lg border border-epm-border text-gray-500 hover:text-white hover:border-gray-500 transition-all"
      >
        Restablecer todos los filtros
      </button>
    </div>
  );
}
