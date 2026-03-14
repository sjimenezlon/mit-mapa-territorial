'use client';

import { motion } from 'framer-motion';
import type { LayerState } from '@/app/page';
import { ESTRUCTURA_COLORS, NATURALEZA_COLORS } from '@/lib/utils';

interface Props {
  layers: LayerState;
  showBrechas?: boolean;
}

export default function Legend({ layers, showBrechas }: Props) {
  const showProjectLegend = layers.proyectos || layers.estructuras;
  const showActorLegend = layers.actores;

  if (!showProjectLegend && !showActorLegend && !layers.choropleth && !showBrechas) return null;

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="glass rounded-lg px-3 py-2.5 space-y-2 max-w-[200px]">

      {showBrechas && (
        <div>
          <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1.5">Índice de Brecha</p>
          <div className="space-y-1">
            {[
              { label: 'Crítico (60-100)', color: '#ef4444' },
              { label: 'Medio (30-60)', color: '#F7941D' },
              { label: 'Bajo (0-30)', color: '#eab308' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}44` }} />
                <span className="text-[9px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-[7px] text-gray-600 mt-1">Cruza indicadores DANE vs inversión MIT</p>
        </div>
      )}

      {!showBrechas && showProjectLegend && (
        <div>
          <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1.5">Estructura MIT</p>
          <div className="space-y-1">
            {Object.entries(ESTRUCTURA_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}44` }} />
                <span className="text-[9px] text-gray-400">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showActorLegend && (
        <div>
          <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1.5">Naturaleza Actor</p>
          <div className="space-y-1">
            {Object.entries(NATURALEZA_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded" style={{ background: color, transform: 'rotate(45deg)' }} />
                <span className="text-[9px] text-gray-400">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {layers.actores && layers.proyectos && (
        <div>
          <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">Conexiones</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0 border-t border-dashed border-gray-500" />
            <span className="text-[8px] text-gray-500">Actor → Proyecto</span>
          </div>
        </div>
      )}

      {!showBrechas && layers.choropleth && (
        <div>
          <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1.5">Inversión</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-gray-500">Baja</span>
            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-epm-green/10 via-epm-green/40 to-epm-green" />
            <span className="text-[8px] text-gray-500">Alta</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
