import type { Metadata, Viewport } from 'next';
import { Cairo, Rakkas, JetBrains_Mono, Cinzel } from 'next/font/google';
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

const rakkas = Rakkas({
  subsets: ['arabic', 'latin'],
  weight: ['400'],
  variable: '--font-rakkas',
  display: 'swap'
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://milaknight.example'),
  title: {
    default: 'MilaKnight — ابنِ حضور شركتك الرقمي',
    template: '%s | MilaKnight'
  },
  description:
    'تجربة تفاعلية لشركات المقاولات والتشطيبات والعقارات لاختيار خدمات التسويق، المواقع، الإعلانات، والسوشيال ميديا.',
  openGraph: {
    title: 'MilaKnight — ابنِ حضور شركتك الرقمي',
    description:
      'تجربة تفاعلية لشركات المقاولات والتشطيبات والعقارات لاختيار خدمات التسويق، المواقع، الإعلانات، والسوشيال ميديا.',
    type: 'website',
    locale: 'ar_SY'
  },
  themeColor: '#05070D',
  icons: { icon: '/favicon.svg' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05070D'
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
      className={`${cairo.variable} ${rakkas.variable} ${cinzel.variable} ${jetbrains.variable}`}
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
