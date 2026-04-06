import { useQueries } from '@tanstack/react-query';
import api from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { Users, Building, Bed, FileText, Receipt, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export const StaffDashboard = () => {
    const token = localStorage.getItem('token');
    const queries = useQueries({
      queries: [
        { queryKey: ['students'], queryFn: () => api.get('/students').then(res => res.data.data || []), enabled: !!token },
        { queryKey: ['halls'], queryFn: () => api.get('/halls').then(res => res.data.data || []), enabled: !!token },
        { queryKey: ['leases'], queryFn: () => api.get('/leases').then(res => res.data.data || []), enabled: !!token },
        { queryKey: ['invoices'], queryFn: () => api.get('/invoices').then(res => res.data.data || []), enabled: !!token },
        { queryKey: ['staff'], queryFn: () => api.get('/staff').then(res => res.data.data || []), enabled: !!token }
      ]
  });

  const isLoading = queries.some(q => q.isLoading);

  const students = queries[0].data || [];
  const halls = queries[1].data || [];
  const leases = queries[2].data || [];
  const invoices = queries[3].data || [];
  const staff = queries[4].data || [];

  const waitingListCount = students.filter(s => s.waitingList).length;
  const activeLeasesCount = leases.filter(l => l.status === 'ACTIVE').length;
  const pendingInvoicesCount = invoices.filter(i => i.status === 'PENDING').length;
  const overdueInvoicesCount = invoices.filter(i => i.status === 'OVERDUE').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatCard title="Total Students" value={isLoading ? '...' : students.length} icon={Users} colorClass="text-[var(--color-primary-accent)] border-[var(--color-border)]" delay={0} />
      <StatCard title="Waiting List" value={isLoading ? '...' : waitingListCount} icon={Clock} colorClass="text-[var(--color-warning-accent)] border-[var(--color-border)]" delay={100} />
      <StatCard title="Residence Halls" value={isLoading ? '...' : halls.length} icon={Building} colorClass="text-[var(--color-success-accent)] border-[var(--color-border)]" delay={200} />
      <StatCard title="Staff Members" value={isLoading ? '...' : staff.length} icon={ShieldCheck} colorClass="text-[var(--color-text-muted)] border-[var(--color-border)]" delay={300} />
      <StatCard title="Active Leases" value={isLoading ? '...' : activeLeasesCount} icon={FileText} colorClass="text-[var(--color-primary-accent)] border-[var(--color-border)]" delay={400} />
      <StatCard title="Total Leases" value={isLoading ? '...' : leases.length} icon={Bed} colorClass="text-[var(--color-text-muted)] border-[var(--color-border)]" delay={500} />
      <StatCard title="Pending Invoices" value={isLoading ? '...' : pendingInvoicesCount} icon={Receipt} colorClass="text-[var(--color-warning-accent)] border-[var(--color-border)]" delay={600} />
      <StatCard title="Overdue Invoices" value={isLoading ? '...' : overdueInvoicesCount} icon={AlertTriangle} colorClass="text-[var(--color-danger-accent)] border-[var(--color-border)]" delay={700} />
    </div>
  );
};
