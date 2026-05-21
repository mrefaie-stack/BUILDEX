import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'خدمات MilaKnight — اختر سلاحك الرقمي',
  description:
    'بناء مواقع، إدارة سوشيال ميديا، إعلانات ممولة، إنتاج فيديو، SEO، واستشارات للشركات التي تريد السيطرة على السوق.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
