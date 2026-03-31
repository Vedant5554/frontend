import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { formatSemester } from '../../utils/formatters';

export default function MyLease({ userId }) {
  const token = localStorage.getItem('token');

  const { data: leases = [], isLoading } = useQuery({
    queryKey: ['my-lease', userId],
    queryFn: () => api.get(`/leases/student/${userId}`).then(res => res.data.data || []),
    enabled: !!token
  });

  const columns = [
    { header: 'Lease # / Place', render: (row) => `${row.leaseNumber || 'N/A'} / ${row.placeNumber}` },
    { header: 'Semester', render: (row) => formatSemester(row.semester) },
    {
      header: 'Status', render: (row) => (
        row.status === 'TERMINATED' ? <Badge color="gray">Terminated</Badge> :
          row.status === 'ACTIVE' ? <Badge color="green">Active</Badge> :
            <Badge color="blue">{row.status || 'Active'}</Badge>
      )
    },
    { header: 'Rent', render: (row) => `£${row.monthlyRent}/mo` },
    { header: 'Enter Date', render: (row) => new Date(row.enterDate).toLocaleDateString() },
    { header: 'Leave Date', render: (row) => new Date(row.leaveDate).toLocaleDateString() }
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="My Lease" description="View your accommodation lease details." />
      <Table columns={columns} data={leases} isLoading={isLoading} />
    </div>
  );
}
