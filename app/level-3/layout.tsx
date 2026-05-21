import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سجل المعارك — MilaKnight',
  description:
    'كل مشروع كان معركة. تصفح المعارك التي ربحناها لشركات المقاولات والتشطيبات والعقارات.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
