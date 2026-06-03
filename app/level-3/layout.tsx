import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الخدمات والباقات — MILA KNIGHT',
  description:
    'تعرّف على خدمات التسويق والمواقع والإعلانات والفيديو، واختر باقة جاهزة أو ابنِ ترسانتك المخصصة بسعر لحظي.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
