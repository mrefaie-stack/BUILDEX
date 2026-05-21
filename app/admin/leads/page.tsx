import { isAdminAuthenticated } from '@/lib/admin';
import { LoginCard } from '@/components/admin/LoginCard';
import { LeadsClient } from '@/components/admin/LeadsClient';

export const dynamic = 'force-dynamic';

export default function AdminLeadsPage() {
  if (!isAdminAuthenticated()) {
    return <LoginCard />;
  }
  return <LeadsClient />;
}
