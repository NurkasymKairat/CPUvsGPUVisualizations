import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, JetBrains_Mono } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import '@/styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'GPU vs CPU — Parallelism Comparison',
  description:
    'A computer architecture project comparing GPU and CPU performance across three parallelism patterns: embarrassingly parallel, reduction, and stencil.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
