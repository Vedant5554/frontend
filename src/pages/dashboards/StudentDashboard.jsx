import { useQueries } from '@tanstack/react-query';
import api from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { FileText, Receipt, User } from 'lucide-react';

export const StudentDashboard = ({ userId }) => {
  const token = localStorage.getItem('token');
  const queries = useQueries({
    queries: [
      { queryKey: ['my-lease', userId], queryFn: () => api.get(`/leases/student/${userId}`).then(res => res.data.data || []), enabled: !!token },
      { queryKey: ['my-invoices', userId], queryFn: () => api.get(`/invoices/student/${userId}`).then(res => res.data.data || []), enabled: !!token },
      { queryKey: ['my-adviser', userId], queryFn: () => api.get(`/reports/adviser-for-student/${userId}`).then(res => res.data.data), enabled: !!token }
    ]
  });

  const isLoading = queries.some(q => q.isLoading);
  const leases = queries[0].data || [];
  const invoices = queries[1].data || [];
  const adviserData = queries[2].data;

  const activeLease = leases.find(l => l.status === 'ACTIVE');
  const leaseStatus = activeLease ? 'ACTIVE' : 'NONE';

  const pendingInvoices = invoices.filter(i => i.status === 'PENDING');
  const totalOutstanding = pendingInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  const adviserName = adviserData?.adviserName || 'Unassigned';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Lease Status" value={isLoading ? '...' : leaseStatus} icon={FileText} colorClass={leaseStatus === 'ACTIVE' ? "text-[#50e3c2] border-[#50e3c2]" : "text-[var(--color-text-muted)] border-[var(--color-border)]"} />
      <StatCard title="Outstanding Balance" value={isLoading ? '...' : `£${totalOutstanding}`} icon={Receipt} colorClass="text-[#f5a623] border-[#f5a623]" />
      <StatCard title="Overdue Invoices" value={isLoading ? '...' : overdueCount} icon={Receipt} colorClass={overdueCount > 0 ? "text-[#ff0000] border-[#ff0000]" : "text-[#50e3c2] border-[#50e3c2]"} />
      <StatCard title="My Adviser" value={isLoading ? '...' : adviserName} icon={User} colorClass="text-[var(--color-text-primary)] border-[var(--color-border)]" />
    </div>
  );
};
