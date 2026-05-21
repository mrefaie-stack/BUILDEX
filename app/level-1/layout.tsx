import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن — قصة البطل',
  description:
    'لسنا وكالة تقليدية. نحن فريق يدخل معك معركة السيطرة الرقمية ويحوّل شركتك إلى قوة لا يمكن تجاوزها.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
