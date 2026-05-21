import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المعركة الأخيرة — MilaKnight',
  description: 'قرارك الآن يحدد مستقبل شركتك. ابدأ معركتك أو توقف عن الخسارة.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
