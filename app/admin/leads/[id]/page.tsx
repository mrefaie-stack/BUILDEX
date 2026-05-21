import { isAdminAuthenticated } from '@/lib/admin';
import { LoginCard } from '@/components/admin/LoginCard';
import { LeadDetailClient } from '@/components/admin/LeadDetailClient';

export const dynamic = 'force-dynamic';

export default function LeadDetailPage({
  params
}: {
  params: { id: string };
}) {
  if (!isAdminAuthenticated()) {
    return <LoginCard />;
  }
  return <LeadDetailClient id={params.id} />;
}
