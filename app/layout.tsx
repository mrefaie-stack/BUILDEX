import type { Metadata, Viewport } from 'next';
import { Cairo, Tajawal, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AnalyticsProvider } from '@/components/tracking/AnalyticsProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { BgEffects } from '@/components/layout/BgEffects';
import { CursorSpotlight } from '@/components/effects/CursorSpotlight';
import { SoundProvider } from '@/components/effects/SoundProvider';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap'
});

// Bold geometric display face that echoes the heavy lettering in the logo.
const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://buildex.mila-knight.com'),
  title: {
    default: 'MILA KNIGHT — ابنِ حضور شركتك الرقمي',
    template: '%s | MILA KNIGHT'
  },
  description:
    'وكالة MILA KNIGHT للتسويق — تجربة تفاعلية لشركات المقاولات والتشطيبات والعقارات لاختيار خدمات التسويق، المواقع، الإعلانات، والسوشيال ميديا.',
  openGraph: {
    title: 'MILA KNIGHT — ابنِ حضور شركتك الرقمي',
    description:
      'وكالة MILA KNIGHT للتسويق — تجربة تفاعلية لشركات المقاولات والتشطيبات والعقارات لاختيار خدمات التسويق، المواقع، الإعلانات، والسوشيال ميديا.',
    type: 'website',
    locale: 'ar_SY',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'MILA KNIGHT' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MILA KNIGHT — ابنِ حضور شركتك الرقمي',
    images: ['/og.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: '/apple-icon.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A1A'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${tajawal.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased">
        <AnalyticsProvider>
          <SoundProvider />
          <BgEffects />
          <CursorSpotlight />
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
          <CookieBanner />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
