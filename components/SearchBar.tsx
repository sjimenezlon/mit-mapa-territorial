'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { proyectos } from '@/data/proyectos';
import { actores } from '@/data/actores';
import { municipios } from '@/data/municipios';
import { indicadores } from '@/data/indicadores';
import { formatCOP } from '@/lib/utils';

type ResultType = 'municipio' | 'proyecto' | 'actor';
interface SearchResult {
  type: ResultType;
  label: string;
  sub: string;
  coords: { lat: number; lng: number };
  id: string;
}

interface Props {
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
}

export default function SearchBar({ onFlyTo }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const allResults = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    municipios.forEach(m => {
      const ind = indicadores.find(i => i.municipio === m.nombre);
      results.push({
        type: 'municipio',
        label: m.nombre,
        sub: `${m.region} · DANE ${m.codigo_dane}${ind ? ` · ${(ind.poblacion_2024/1000).toFixed(0)}k hab.` : ''}`,
        coords: m.coordenadas,
        id: `mun-${m.codigo_dane}`,
      });
    });

    proyectos.forEach(p => {
      if (!p.coordenadas) return;
      results.push({
        type: 'proyecto',
        label: p.nombre,
        sub: `${p.region} · ${p.negocio_epm} · ${formatCOP(p.valor_inversion)}`,
        coords: p.coordenadas,
        id: `proj-${p.id}`,
      });
    });

    actores.forEach(a => {
      if (!a.coordenadas) return;
      results.push({
        type: 'actor',
        label: a.organizacion,
        sub: `${a.tipo_actor} · ${a.naturaleza} · ${a.region}`,
        coords: a.coordenadas,
        id: `act-${a.id}`,
      });
    });

    return results;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allResults.slice(0, 8);
    const q = query.toLowerCase();
    return allResults
      .filter(r => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query, allResults]);

  const typeIcon: Record<ResultType, { color: string; symbol: string }> = {
    municipio: { color: '#00A651', symbol: 'M' },
    proyecto: { color: '#F7941D', symbol: 'P' },
    actor: { color: '#004F9F', symbol: 'A' },
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="px-2.5 py-1 text-[10px] font-medium rounded-lg border border-epm-border text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200 flex items-center gap-1.5"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        Buscar
        <kbd className="text-[8px] text-gray-600 bg-gray-800 px-1 py-0.5 rounded ml-1">⌘K</kbd>
      </button>

      {/* Modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: -20, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -10, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              onClick={e => e.stopPropagation()}
              className="relative w-[480px] max-h-[60vh] glass rounded-xl overflow-hidden border border-epm-border shadow-2xl shadow-black/40"
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-epm-border">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A651" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar municipio, proyecto o actor..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none font-body"
                />
                <kbd className="text-[9px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">ESC</kbd>
              </div>

              {/* Results */}
              <div className="overflow-y-auto max-h-[45vh] py-1">
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-8">Sin resultados para &ldquo;{query}&rdquo;</p>
                )}
                {filtered.map(r => {
                  const icon = typeIcon[r.type];
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onFlyTo(r.coords.lat, r.coords.lng, r.type === 'municipio' ? 12 : 13);
                        setOpen(false);
                        setQuery('');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left group"
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: `${icon.color}20`, color: icon.color }}
                      >
                        {icon.symbol}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-200 group-hover:text-white truncate">{r.label}</p>
                        <p className="text-[9px] text-gray-500 truncate">{r.sub}</p>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 group-hover:text-epm-green flex-shrink-0">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-epm-border flex items-center gap-4 text-[8px] text-gray-600">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-epm-green/20 text-epm-green text-center leading-[12px] font-bold">M</span> Municipio</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-epm-orange/20 text-epm-orange text-center leading-[12px] font-bold">P</span> Proyecto</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-epm-blue/20 text-epm-blue text-center leading-[12px] font-bold">A</span> Actor</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
