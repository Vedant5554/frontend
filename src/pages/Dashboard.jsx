import { useRole } from '../hooks/useRole';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { StudentDashboard } from './dashboards/StudentDashboard';
import { AdviserDashboard } from './dashboards/AdviserDashboard';
import { StaffDashboard } from './dashboards/StaffDashboard';

export default function Dashboard() {
  const { role, userId, isStudent, isAdviser, isStaff } = useRole();

  const renderDashboardActions = () => {
    if (isStaff) {
      return (
        <>
          <Link to="/students"><Button variant="outline" size="sm">Add Student</Button></Link>
          <Link to="/leases"><Button variant="outline" size="sm">New Lease</Button></Link>
          <Link to="/invoices"><Button variant="outline" size="sm">New Invoice</Button></Link>
          <Link to="/reports"><Button size="sm">View Reports</Button></Link>
        </>
      );
    }
    if (isAdviser) {
      return <Link to="/reports"><Button size="sm">View Reports</Button></Link>;
    }
    return null;
  };

  return (
    <div className="p-8 page-transition-enter-active flex-1 flex flex-col">
      <PageHeader 
        title={`${role ? role.charAt(0) + role.slice(1).toLowerCase() : ''} Dashboard`} 
        description="Overview of the university accommodation system."
        actions={renderDashboardActions()}
      />

      {isStudent && <StudentDashboard userId={userId} />}
      {isAdviser && <AdviserDashboard userId={userId} />}
      {isStaff && <StaffDashboard />}
      
      {!role && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      )}
    </div>
  );
}
