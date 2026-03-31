import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { User } from 'lucide-react';

export default function MyAdviser({ userId }) {
  const token = localStorage.getItem('token');

  const { data: adviser, isLoading } = useQuery({
    queryKey: ['my-adviser', userId],
    queryFn: () => api.get(`/reports/adviser-for-student/${userId}`).then(res => res.data.data),
    enabled: !!token
  });

  if (isLoading) return <div className="p-8 text-sm text-[#888888]">Loading adviser details...</div>;

  let adviserObj = Array.isArray(adviser) ? adviser[0] : adviser;

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="My Adviser" description="Contact details for your assigned adviser." />

      {adviserObj ? (
        <div className="bg-[#0a0a0a] rounded-xl border border-[#333333]/60 p-8 max-w-lg flex items-start gap-6">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center accent-white text-white flex-shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {adviserObj.firstName} {adviserObj.lastName}
            </h2>
            <div className="space-y-1 text-[#888888]">
              <p><span className="font-medium mr-2">Department:</span> {adviserObj.department || 'N/A'}</p>
              <p><span className="font-medium mr-2">Email:</span> <a href={`mailto:${adviserObj.email}`} className="accent-white text-white hover:underline">{adviserObj.email}</a></p>
              <p><span className="font-medium mr-2">Phone:</span> {adviserObj.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] rounded-xl border border-[#333333]/60 p-8 text-center text-[#888888] text-sm">
          No adviser currently assigned to you.
        </div>
      )}
    </div>
  );
}
