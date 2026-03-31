import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

export default function MyStudents({ userId }) {
  const token = localStorage.getItem('token');

  const { data: myStudents = [], isLoading } = useQuery({
    queryKey: ['my-students', userId],
    queryFn: async () => {
      const { data } = await api.get('/students');
      return (data.data || []).filter(s => String(s.adviserId) === String(userId));
    },
    enabled: !!token
  });

  const columns = [
    { header: 'Banner #', render: (row) => row.bannerNumber || 'N/A' },
    { header: 'Student Name', render: (row) => `${row.firstName} ${row.lastName}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Major', render: (row) => row.major || 'N/A' },
    {
      header: 'Category', render: (row) => (
        <Badge color={row.category === 'UNDERGRADUATE' ? 'indigo' : row.category === 'POSTGRADUATE' ? 'blue' : 'amber'}>
          {row.category}
        </Badge>
      )
    },
    {
      header: 'Status', render: (row) => (
        row.waitingList ? <Badge color="amber">Waiting</Badge> : <Badge color="green">Active</Badge>
      )
    }
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="My Students" description="View details of students currently assigned to you." />
      <Table columns={columns} data={myStudents} isLoading={isLoading} />
    </div>
  );
}
