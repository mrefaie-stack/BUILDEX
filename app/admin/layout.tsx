import type { ReactNode } from 'react';
import { Cairo, JetBrains_Mono } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap'
});
const jet = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap'
});

export const metadata = {
  title: 'لوحة الإدارة | MilaKnight',
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${cairo.variable} ${jet.variable} relative min-h-screen`}>
      {children}
    </div>
  );
}
