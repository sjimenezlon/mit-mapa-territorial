import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MIT EPM — Mapa Territorial Interactivo',
  description: 'Modelo de Integración en el Territorio - Visualización de proyectos EPM en Urabá y Oriente Antioqueño',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
