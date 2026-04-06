import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Table } from '../components/ui/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { Badge } from '../components/ui/Badge';
import { formatSemester } from '../utils/formatters';

import toast from 'react-hot-toast';
import { Edit2, CheckCircle, Download } from 'lucide-react';

export default function Invoices() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToPay, setItemToPay] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const downloadInvoice = async (invoiceId) => {
    try {
      setDownloadingId(invoiceId);
      const response = await api.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch (error) {
      console.error('Download failed', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const [formData, setFormData] = useState({
    studentId: '', invoiceNumber: '', semester: 'YEAR1_SEM1',
    description: '', amount: 0, issueDate: new Date().toISOString().split('T')[0],
    dueDate: '', paymentMethod: 'CASH',
    firstReminderDate: '', secondReminderDate: ''
  });

  const token = localStorage.getItem('token');

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get('/invoices').then(res => res.data.data || []),
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

  const selectedStudent = students.find(s => String(s.studentId) === String(formData.studentId));
  const semesterOptions = selectedStudent?.category === 'POSTGRADUATE' ? PG_SEMESTERS : UG_SEMESTERS;

  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/invoices', newData),
    onSuccess: () => { queryClient.invalidateQueries(['invoices']); toast.success('Invoice created successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create invoice')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/invoices/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['invoices']); toast.success('Invoice updated successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update invoice')
  });

  const payMutation = useMutation({
    mutationFn: ({ id, method }) => api.put(`/invoices/${id}/pay`, { paymentMethod: method, paidDate: new Date().toISOString() }),
    onSuccess: () => { queryClient.invalidateQueries(['invoices']); toast.success('Payment recorded successfully'); setIsPayOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to process payment')
  });

  const handleOpenForm = (item = null) => {
    const isEdit = item && !item.nativeEvent && item.invoiceId !== undefined;
    if (isEdit) {
      setEditingItem(item);
      setFormData({
        ...item,
        issueDate: item.issueDate ? item.issueDate.split('T')[0] : '',
        dueDate: item.dueDate ? item.dueDate.split('T')[0] : '',
        firstReminderDate: item.firstReminderDate ? item.firstReminderDate.split('T')[0] : '',
        secondReminderDate: item.secondReminderDate ? item.secondReminderDate.split('T')[0] : ''
      });
    } else {
      setEditingItem(null);
      setFormData({ studentId: '', invoiceNumber: '', semester: 'YEAR1_SEM1', description: '', amount: 0, issueDate: new Date().toISOString().split('T')[0], dueDate: '', paymentMethod: 'CASH', firstReminderDate: '', secondReminderDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) updateMutation.mutate({ id: editingItem.invoiceId, data: formData });
    else createMutation.mutate(formData);
  };

  const studentOptions = students.map(s => ({ label: `${s.firstName} ${s.lastName} (${s.studentId})`, value: s.studentId }));

  const columns = [
    { header: 'Invoice #', render: (row) => <span className="font-medium text-[var(--color-text-primary)]">{row.invoiceNumber || 'N/A'} <span className="text-[var(--color-text-muted)]">#{row.invoiceId}</span></span> },
    { header: 'Student', render: (row) => `${row.studentName || 'N/A'} (${row.studentId})` },
    { header: 'Semester', render: (row) => <Badge color="indigo">{formatSemester(row.semester)}</Badge> },
    { header: 'Due Date', render: (row) => new Date(row.dueDate).toLocaleDateString() },
    { header: 'Amount', render: (row) => <span className="font-medium">£{row.amount}</span> },
    { header: 'Payment', render: (row) => row.paymentMethod || 'N/A' },
    { header: 'Status', render: (row) => (
      row.status === 'PAID' ? <Badge color="green">Paid</Badge> : 
      row.status === 'OVERDUE' ? <Badge color="red">Overdue</Badge> : 
      <Badge color="amber">{row.status || 'Pending'}</Badge>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] transition-all" onClick={() => handleOpenForm(row)}>
          <Edit2 className="w-4 h-4" />
        </button>
        {row.status !== 'PAID' && (
          <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#50e3c2] hover:bg-[var(--color-surface-hover)] transition-all" title="Mark as Paid" onClick={() => { setItemToPay(row); setIsPayOpen(true); }}>
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all disabled:opacity-50" title="Download PDF" disabled={downloadingId === row.invoiceId} onClick={() => downloadInvoice(row.invoiceId)}>
          {downloadingId === row.invoiceId
            ? <span className="w-4 h-4 block border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            : <Download className="w-4 h-4" />}
        </button>
      </div>
    )}
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="Invoices" description="Manage accommodation invoices and rent payments." actions={<Button onClick={() => handleOpenForm()}>Create Invoice</Button>} />
      <Table columns={columns} data={invoices} isLoading={isLoading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Invoice" : "Create New Invoice"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Student" type="select" required value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} options={studentOptions} />
            <FormField label="Invoice Number" required value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} />
            <FormField label="Amount (£)" type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
            <FormField label="Semester" type="select" required value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} options={semesterOptions} />
            <FormField label="Issue Date" type="date" required value={formData.issueDate} onChange={(e) => setFormData({...formData, issueDate: e.target.value})} />
            <FormField label="Due Date" type="date" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
            <FormField label="Payment Method" type="select" required value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} options={[
              {label: 'Cash', value: 'CASH'}, {label: 'Visa', value: 'VISA'}, {label: 'Check', value: 'CHECK'}
            ]} />
            <FormField label="First Reminder" type="date" value={formData.firstReminderDate} onChange={(e) => setFormData({...formData, firstReminderDate: e.target.value})} />
            <FormField label="Second Reminder" type="date" value={formData.secondReminderDate} onChange={(e) => setFormData({...formData, secondReminderDate: e.target.value})} />
            <FormField label="Description" className="col-span-2" type="textarea" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title="Process Payment">
        <div className="mb-6 mt-2">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Record payment for Invoice #{itemToPay?.invoiceId} — <span className="font-semibold text-[var(--color-text-primary)]">£{itemToPay?.amount}</span>
          </p>
          <FormField label="Payment Method" type="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} options={[
            {label: 'Credit Card', value: 'Credit Card'}, {label: 'Bank Transfer', value: 'Bank Transfer'}, {label: 'Cash', value: 'Cash'}
          ]} />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] modal-actions">
          <Button variant="outline" onClick={() => setIsPayOpen(false)}>Cancel</Button>
          <Button variant="success" onClick={() => payMutation.mutate({ id: itemToPay?.invoiceId, method: paymentMethod })} isLoading={payMutation.isPending}>
            Mark Paid
          </Button>
        </div>
      </Modal>
    </div>
  );
}
