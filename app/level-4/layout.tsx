import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'باقات MilaKnight — اختر ترسانتك',
  description:
    'باقات مرنة لكل حجم شركة — أو ابنِ ترسانتك المخصصة من خدمات التسويق والمواقع والإعلانات والفيديو.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
