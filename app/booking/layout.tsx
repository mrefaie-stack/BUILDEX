import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'احجز جلسة مع MILA KNIGHT',
  description: 'احجز جلسة تشخيص مجانية وابدأ بناء حضور شركتك الرقمي.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
