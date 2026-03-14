'use client';

import { useState } from 'react';

interface Props {
  targetId: string;
}

export default function ExportButton({ targetId }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const element = document.getElementById(targetId);
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#060911',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `MIT-EPM-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-2.5 py-1 text-[10px] font-medium rounded-lg border border-epm-border text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-40"
      title="Exportar como imagen"
    >
      {exporting ? (
        <div className="w-[10px] h-[10px] border-2 border-gray-500 border-t-epm-green rounded-full animate-spin" />
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
      )}
      {exporting ? 'Exportando...' : 'Exportar'}
    </button>
  );
}
