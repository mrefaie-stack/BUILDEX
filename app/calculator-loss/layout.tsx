import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'حاسبة الخسارة الرقمية — MilaKnight',
  description:
    'احسب كم تخسر شركتك شهريًا بسبب ضعف حضورها الرقمي، واستلم تشخيصًا سريعًا لإيقاف هذه الخسارة.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
