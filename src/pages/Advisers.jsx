import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Table } from '../components/ui/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';
import { Edit2, Trash2 } from 'lucide-react';

export default function Advisers() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', 
    phone: '', department: ''
  });

  const token = localStorage.getItem('token');

  const { data = [], isLoading } = useQuery({
    queryKey: ['advisers'],
    queryFn: async () => {
      const { data } = await api.get('/advisers');
      return data.data || [];
    },
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/advisers', newData),
    onSuccess: () => {
      queryClient.invalidateQueries(['advisers']);
      toast.success('Adviser created successfully');
      setIsModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create adviser')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/advisers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['advisers']);
      toast.success('Adviser updated successfully');
      setIsModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update adviser')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/advisers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['advisers']);
      toast.success('Adviser deleted successfully');
      setIsConfirmOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete adviser')
  });

  const handleOpenForm = (item = null) => {
    const isEdit = item && !item.nativeEvent && item.id !== undefined;
    if (isEdit) {
      setEditingItem(item);
      setFormData({ ...item, password: '' });
    } else {
      setEditingItem(null);
      setFormData({ firstName: '', lastName: '', email: '', password: '', phone: '', department: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = [
    { header: 'Name', render: (row) => (
      <span className="font-medium text-white">{row.firstName} {row.lastName}</span>
    )},
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#222222] transition-all" onClick={() => handleOpenForm(row)}>
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg text-[#888888] hover:text-[#ff0000] hover:bg-[#220000] transition-all" onClick={() => {
          setItemToDelete(row);
          setIsConfirmOpen(true);
        }}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )}
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader
        title="Advisers"
        description="Manage academic advisers and staff counselors."
        actions={<Button onClick={() => handleOpenForm()}>Add Adviser</Button>}
      />
      <Table columns={columns} data={data} isLoading={isLoading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Adviser" : "Add New Adviser"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <FormField label="Last Name" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            <FormField label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <FormField label="Password" type="password" required={!editingItem} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={editingItem ? "Leave blank to keep unchanged" : ""} />
            <FormField label="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            <FormField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#333333] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => deleteMutation.mutate(itemToDelete?.id)} isDestructive title="Delete Adviser" message={`Are you sure you want to delete ${itemToDelete?.firstName}? This action cannot be undone.`} isLoading={deleteMutation.isPending} />
    </div>
  );
}
