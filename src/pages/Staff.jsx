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
import toast from 'react-hot-toast';
import { Edit2, Trash2 } from 'lucide-react';

export default function Staff() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', 
    phone: '', role: '', dateOfBirth: '', gender: 'Other', 
    street: '', city: '', postcode: '', location: '', hallId: ''
  });

  const token = localStorage.getItem('token');

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data } = await api.get('/staff');
      return data.data || [];
    },
    enabled: !!token
  });

  const { data: halls = [] } = useQuery({
    queryKey: ['halls'],
    queryFn: () => api.get('/halls').then(res => res.data.data || []),
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/staff', newData),
    onSuccess: () => { queryClient.invalidateQueries(['staff']); toast.success('Staff member created successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create staff')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/staff/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['staff']); toast.success('Staff member updated successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update staff')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/staff/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['staff']); toast.success('Staff deleted successfully'); setIsConfirmOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete staff')
  });

  const handleOpenForm = (item = null) => {
    const isEdit = item && !item.nativeEvent && item.id !== undefined;
    if (isEdit) {
      setEditingItem(item);
      setFormData({ ...item, password: '' });
    } else {
      setEditingItem(null);
      setFormData({ firstName: '', lastName: '', email: '', password: '', phone: '', role: '', dateOfBirth: '', gender: 'Other', street: '', city: '', postcode: '', location: '', hallId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    if (payload.hallId === '') payload.hallId = null;
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = [
    { header: 'Name', render: (row) => <span className="font-medium text-[var(--color-text-primary)]">{row.firstName} {row.lastName}</span> },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', render: (row) => <Badge color="indigo">{row.role}</Badge> },
    { header: 'Location', accessor: 'location' },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] transition-all" onClick={() => handleOpenForm(row)}>
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#ff0000] hover:bg-[#220000] transition-all" onClick={() => { setItemToDelete(row); setIsConfirmOpen(true); }}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )}
  ];

  const hallOptions = halls.map(h => ({ label: h.hallName, value: h.id }));
  hallOptions.unshift({ label: 'None', value: '' });

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="Staff" description="Manage university residence staff and operations team." actions={<Button onClick={() => handleOpenForm()}>Add Staff</Button>} />
      <Table columns={columns} data={staff} isLoading={isLoading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Staff Member" : "Add New Staff"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <FormField label="Last Name" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            <FormField label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <FormField label="Password" type="password" required={!editingItem} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={editingItem ? "Leave blank to keep unchanged" : ""} />
            <FormField label="Role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Hall Manager" />
            <FormField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <FormField label="Date of Birth" type="date" value={formData.dateOfBirth?.split('T')[0] || ''} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
            <FormField label="Gender" type="select" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} options={[
              {label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Other', value: 'Other'}
            ]} />
            <FormField label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Residence Office" />
            <FormField label="Assigned Hall" type="select" value={formData.hallId || ''} onChange={(e) => setFormData({...formData, hallId: e.target.value})} options={hallOptions} />
            <div className="col-span-2 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-4">
              <FormField label="Street" className="col-span-3" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
              <FormField label="City" className="col-span-2" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              <FormField label="Postcode" value={formData.postcode} onChange={(e) => setFormData({...formData, postcode: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => deleteMutation.mutate(itemToDelete?.id)} isDestructive title="Delete Staff" message={`Are you sure you want to delete ${itemToDelete?.firstName}? This action cannot be undone.`} isLoading={deleteMutation.isPending} />
    </div>
  );
}
