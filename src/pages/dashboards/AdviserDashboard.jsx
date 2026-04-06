import { useQueries } from '@tanstack/react-query';
import api from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { Users, Clock, AlertCircle } from 'lucide-react';

export const AdviserDashboard = ({ userId }) => {
  const token = localStorage.getItem('token');
  const queries = useQueries({
    queries: [
      { queryKey: ['my-students', userId], queryFn: async () => {
          const { data } = await api.get('/students');
          return (data.data || []).filter(s => String(s.adviserId) === String(userId));
        },
        enabled: !!token
      },
      { queryKey: ['students-no-next-of-kin'], queryFn: () => api.get('/reports/students-no-next-of-kin').then(res => res.data.data || []), enabled: !!token }
    ]
  });

  const isLoading = queries.some(q => q.isLoading);
  const myStudents = queries[0].data || [];
  const noNextOfKinGlobal = queries[1].data || [];
  
  const waitingListCount = myStudents.filter(s => s.waitingList).length;
  
  const myStudentIds = new Set(myStudents.map(s => s.id));
  const myStudentsMissingKinCount = noNextOfKinGlobal.filter(s => myStudentIds.has(s.id)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Assigned Students" value={isLoading ? '...' : myStudents.length} icon={Users} colorClass="text-[var(--color-text-primary)] border-[var(--color-border)]" />
      <StatCard title="On Waiting List" value={isLoading ? '...' : waitingListCount} icon={Clock} colorClass="text-[#f5a623] border-[#f5a623]" />
      <StatCard title="Missing Next of Kin" value={isLoading ? '...' : myStudentsMissingKinCount} icon={AlertCircle} colorClass="text-[#ff0000] border-[#ff0000]" />
    </div>
  );
};
