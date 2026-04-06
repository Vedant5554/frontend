import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Table } from '../components/ui/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Badge } from '../components/ui/Badge';
import { formatSemester } from '../utils/formatters';
import toast from 'react-hot-toast';
import { Edit2, XCircle } from 'lucide-react';

export default function Leases() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToTerminate, setItemToTerminate] = useState(null);

  const [formData, setFormData] = useState({
    studentId: '', leaseNumber: '', placeNumber: '',
    semester: 'YEAR1_SEM1', monthlyRent: 0, depositAmount: 0,
    startDate: '', endDate: '', enterDate: '', leaveDate: '',
    notes: ''
  });

  const token = localStorage.getItem('token');

  const { data: leases = [], isLoading } = useQuery({
    queryKey: ['leases'],
    queryFn: () => api.get('/leases').then(res => res.data.data || []),
    enabled: !!token
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/students').then(res => res.data.data || []),
    enabled: !!token
  });

  const UG_SEMESTERS = [
    {label: 'Year 1 - Sem 1', value: 'YEAR1_SEM1'}, {label: 'Year 1 - Sem 2', value: 'YEAR1_SEM2'},
    {label: 'Year 2 - Sem 1', value: 'YEAR2_SEM1'}, {label: 'Year 2 - Sem 2', value: 'YEAR2_SEM2'},
    {label: 'Year 3 - Sem 1', value: 'YEAR3_SEM1'}, {label: 'Year 3 - Sem 2', value: 'YEAR3_SEM2'},
    {label: 'Year 4 - Sem 1', value: 'YEAR4_SEM1'}, {label: 'Year 4 - Sem 2', value: 'YEAR4_SEM2'},
    {label: 'Summer', value: 'SUMMER'}
  ];

  const PG_SEMESTERS = [
    {label: 'PG Sem 1', value: 'PG_SEM1'}, {label: 'PG Sem 2', value: 'PG_SEM2'},
    {label: 'Summer', value: 'SUMMER'}
  ];

  const selectedStudent = students.find(s => String(s.studentId || s.id) === String(formData.studentId));
  const semesterOptions = selectedStudent?.category === 'POSTGRADUATE' ? PG_SEMESTERS : UG_SEMESTERS;

  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/leases', newData),
    onSuccess: () => { queryClient.invalidateQueries(['leases']); toast.success('Lease created successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create lease')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/leases/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['leases']); toast.success('Lease updated successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update lease')
  });

  const terminateMutation = useMutation({
    mutationFn: (id) => api.put(`/leases/${id}/terminate`),
    onSuccess: () => { queryClient.invalidateQueries(['leases']); toast.success('Lease terminated successfully'); setIsTerminateOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to terminate lease')
  });

  const handleOpenForm = (item = null) => {
    const isEdit = item && !item.nativeEvent && item.leaseId !== undefined;
    if (isEdit) {
      setEditingItem(item);
      setFormData({
        ...item,
        startDate: item.startDate ? item.startDate.split('T')[0] : '',
        endDate: item.endDate ? item.endDate.split('T')[0] : '',
        enterDate: item.enterDate ? item.enterDate.split('T')[0] : '',
        leaveDate: item.leaveDate ? item.leaveDate.split('T')[0] : ''
      });
    } else {
      setEditingItem(null);
      setFormData({ studentId: '', leaseNumber: '', placeNumber: '', semester: 'YEAR1_SEM1', monthlyRent: 0, depositAmount: 0, startDate: '', endDate: '', enterDate: '', leaveDate: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) updateMutation.mutate({ id: editingItem.leaseId, data: formData });
    else createMutation.mutate(formData);
  };

  const columns = [
    { header: 'Lease #', render: (row) => <span className="font-medium text-[var(--color-text-primary)]">{row.leaseNumber || 'N/A'} <span className="text-[var(--color-text-muted)]">#{row.leaseId}</span></span> },
    { header: 'Student', render: (row) => `${row.studentName || 'N/A'} (${row.studentId})` },
    { header: 'Place', render: (row) => row.placeNumber || 'N/A' },
    { header: 'Semester', render: (row) => <Badge color={row.semester === 'SUMMER' ? 'amber' : 'indigo'}>{formatSemester(row.semester)}</Badge> },
    { header: 'Status', render: (row) => (
      row.status === 'TERMINATED' ? <Badge color="gray">Terminated</Badge> : 
      row.status === 'ACTIVE' ? <Badge color="green">Active</Badge> : 
      <Badge color="blue">{row.status || 'Active'}</Badge>
    )},
    { header: 'Rent', render: (row) => <span className="font-medium">£{row.monthlyRent}</span> },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] transition-all" onClick={() => handleOpenForm(row)}>
          <Edit2 className="w-4 h-4" />
        </button>
        {row.status !== 'TERMINATED' && (
          <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#f5a623] hover:bg-[var(--color-surface-hover)] transition-all" title="Terminate Lease" onClick={() => { setItemToTerminate(row); setIsTerminateOpen(true); }}>
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    )}
  ];

  const studentOptions = students.map(s => ({ label: `${s.firstName} ${s.lastName} (${s.id})`, value: s.id }));

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="Leases" description="Manage student accommodation lease agreements." actions={<Button onClick={() => handleOpenForm()}>Create Lease</Button>} />
      <Table columns={columns} data={leases} isLoading={isLoading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Lease" : "Create New Lease"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Student" type="select" required value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} options={studentOptions} />
            <FormField label="Lease Number" required value={formData.leaseNumber} onChange={(e) => setFormData({...formData, leaseNumber: e.target.value})} />
            <FormField label="Semester" type="select" required value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} options={semesterOptions} />
            <FormField label="Place Number" required value={formData.placeNumber} onChange={(e) => setFormData({...formData, placeNumber: e.target.value})} />
            <FormField label="Monthly Rent (£)" type="number" required value={formData.monthlyRent} onChange={(e) => setFormData({...formData, monthlyRent: parseFloat(e.target.value) || 0})} />
            <FormField label="Deposit Amount (£)" type="number" required value={formData.depositAmount} onChange={(e) => setFormData({...formData, depositAmount: parseFloat(e.target.value) || 0})} />
            <FormField label="Start Date" type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            <FormField label="End Date" type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            <FormField label="Enter Date" type="date" required value={formData.enterDate} onChange={(e) => setFormData({...formData, enterDate: e.target.value})} />
            <FormField label="Leave Date" type="date" required value={formData.leaveDate} onChange={(e) => setFormData({...formData, leaveDate: e.target.value})} />
            <FormField label="Notes" type="textarea" className="col-span-2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isTerminateOpen} onClose={() => setIsTerminateOpen(false)} onConfirm={() => terminateMutation.mutate(itemToTerminate?.leaseId)} isDestructive={false} title="Terminate Lease" message={`Are you sure you want to terminate the lease for student ID ${itemToTerminate?.studentId}?`} confirmText="Terminate" isLoading={terminateMutation.isPending} />
    </div>
  );
}
