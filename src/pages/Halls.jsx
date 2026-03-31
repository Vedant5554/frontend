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

export default function Halls() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({ hallName: '', address: '', telephoneNumber: '' });

  const token = localStorage.getItem('token');

  const { data: halls = [], isLoading } = useQuery({
    queryKey: ['halls'],
    queryFn: () => api.get('/halls').then(res => res.data.data || []),
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/halls', newData),
    onSuccess: () => { queryClient.invalidateQueries(['halls']); toast.success('Hall created successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create hall')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/halls/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['halls']); toast.success('Hall updated successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update hall')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/halls/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['halls']); toast.success('Hall deleted successfully'); setIsConfirmOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete hall')
  });

  const handleOpenForm = (item = null) => {
    const isEdit = item && !item.nativeEvent && item.id !== undefined;
    if (isEdit) { setEditingItem(item); setFormData(item); }
    else { setEditingItem(null); setFormData({ hallName: '', address: '', telephoneNumber: '' }); }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns = [
    { header: 'Hall Name', render: (row) => <span className="font-medium text-white">{row.hallName}</span> },
    { header: 'Address', accessor: 'address' },
    { header: 'Telephone', accessor: 'telephoneNumber' },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#222222] transition-all" onClick={() => handleOpenForm(row)}><Edit2 className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg text-[#888888] hover:text-[#ff0000] hover:bg-[#220000] transition-all" onClick={() => { setItemToDelete(row); setIsConfirmOpen(true); }}><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="Residence Halls" description="Manage university student residence halls." actions={<Button onClick={() => handleOpenForm()}>Add Hall</Button>} />
      <Table columns={columns} data={halls} isLoading={isLoading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Hall" : "Add New Hall"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Hall Name" required value={formData.hallName} onChange={(e) => setFormData({...formData, hallName: e.target.value})} />
          <FormField label="Address" type="textarea" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <FormField label="Telephone Number" value={formData.telephoneNumber} onChange={(e) => setFormData({...formData, telephoneNumber: e.target.value})} />
          <div className="pt-4 flex justify-end gap-3 border-t border-[#333333] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => deleteMutation.mutate(itemToDelete?.id)} isDestructive title="Delete Hall" message={`Are you sure you want to delete ${itemToDelete?.hallName}? All associated rooms and data will be affected.`} isLoading={deleteMutation.isPending} />
    </div>
  );
}
