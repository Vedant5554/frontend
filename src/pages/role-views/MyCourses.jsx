import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

export default function MyCourses({ userId }) {
  const token = localStorage.getItem('token');

  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['my-courses', userId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/by-student/${userId}`);
      console.log('My Courses API response:', data);
      return data.data || [];
    },
    enabled: !!token
  });

  const columns = [
    { header: 'Course Code', accessor: 'courseCode' },
    { header: 'Course Name', accessor: 'courseName' },
    { header: 'Department', accessor: 'department' },
    { header: 'Instructor', render: (row) => row.instructorName || 'N/A' },
    { header: 'Instructor Email', render: (row) => row.instructorEmail || 'N/A' },
    {
      header: 'Enrolled Date', render: (row) => (
        row.enrolledDate
          ? new Date(row.enrolledDate).toLocaleDateString()
          : 'N/A'
      )
    },
    {
      header: 'Status', render: () => (
        <Badge color="green">Enrolled</Badge>
      )
    }
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="My Courses" description="View courses you are currently enrolled in." />

      {isError && (
        <div className="mb-4 p-4 bg-[#111111] border border-red-200 rounded-lg text-red-700">
          Failed to load courses. Please try again later.
        </div>
      )}

      {!isLoading && !isError && courses.length === 0 ? (
        <div className="text-center py-12 text-[#888888]">
          <p className="text-lg font-medium">No courses enrolled</p>
          <p className="text-sm mt-1">You are not currently enrolled in any courses.</p>
        </div>
      ) : (
        <Table columns={columns} data={courses} isLoading={isLoading} />
      )}
    </div>
  );
}
