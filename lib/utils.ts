import { ProyectoMIT } from '@/data/proyectos';

export function formatCOP(millones: number): string {
  return `COP $${millones.toLocaleString('es-CO')} M`;
}

export function formatCOPFull(millones: number): string {
  return `COP $${millones.toLocaleString('es-CO')} millones`;
}

export function getInversionPorMunicipio(
  proyectos: ProyectoMIT[]
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const p of proyectos) {
    const share = p.valor_inversion / p.municipios.length;
    for (const m of p.municipios) {
      result[m] = (result[m] || 0) + share;
    }
  }
  return result;
}

export function getProyectosPorMunicipio(
  proyectos: ProyectoMIT[]
): Record<string, ProyectoMIT[]> {
  const result: Record<string, ProyectoMIT[]> = {};
  for (const p of proyectos) {
    for (const m of p.municipios) {
      if (!result[m]) result[m] = [];
      result[m].push(p);
    }
  }
  return result;
}

export function getTotalInversion(proyectos: ProyectoMIT[]): number {
  return proyectos.reduce((sum, p) => sum + p.valor_inversion, 0);
}

export function getDistribucionEstructura(
  proyectos: ProyectoMIT[]
): { name: string; value: number; color: string }[] {
  const map: Record<string, number> = {};
  for (const p of proyectos) {
    map[p.estructura_mit] = (map[p.estructura_mit] || 0) + p.valor_inversion;
  }
  const colors: Record<string, string> = {
    'Ecológica': '#00A651',
    'Físico-Espacial': '#58595B',
    'Institucional': '#004F9F',
    'Socioeconómica': '#F7941D',
  };
  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
    color: colors[name] || '#888',
  }));
}

export function getDistribucionNegocio(
  proyectos: ProyectoMIT[]
): { name: string; value: number; color: string }[] {
  const map: Record<string, number> = {};
  for (const p of proyectos) {
    map[p.negocio_epm] = (map[p.negocio_epm] || 0) + p.valor_inversion;
  }
  const colors: Record<string, string> = {
    'Generación': '#00A651',
    'Transmisión y distribución': '#F7941D',
    'Agua y Saneamiento': '#004F9F',
    'Gas': '#58595B',
    'Presencia Social': '#8B5CF6',
    'Transversal': '#EC4899',
    'Residuos sólidos': '#6B7280',
  };
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, color: colors[name] || '#888' }))
    .sort((a, b) => b.value - a.value);
}

export const ESTRUCTURA_COLORS: Record<string, string> = {
  'Ecológica': '#00A651',
  'Físico-Espacial': '#58595B',
  'Institucional': '#004F9F',
  'Socioeconómica': '#F7941D',
};

export const NATURALEZA_COLORS: Record<string, string> = {
  'Público': '#004F9F',
  'Privado': '#F7941D',
  'Comunitario': '#8B5CF6',
  'EPM': '#00A651',
};

export function getInversionScale(value: number, max: number): string {
  const ratio = value / max;
  if (ratio > 0.7) return 'rgba(0,166,81,0.8)';
  if (ratio > 0.4) return 'rgba(0,166,81,0.5)';
  if (ratio > 0.2) return 'rgba(0,166,81,0.3)';
  return 'rgba(0,166,81,0.15)';
}
