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

export default function Apartments() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({ apartmentName: '', address: '', flatNumber: '', totalBedrooms: 0 });

  const token = localStorage.getItem('token');

  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['apartments'],
    queryFn: () => api.get('/apartments').then(res => res.data.data || []),
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/apartments', newData),
    onSuccess: () => { queryClient.invalidateQueries(['apartments']); toast.success('Apartment created successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create apartment')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/apartments/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['apartments']); toast.success('Apartment updated successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update apartment')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/apartments/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['apartments']); toast.success('Apartment deleted successfully'); setIsConfirmOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete apartment')
  });

  const handleOpenForm = (item = null) => {
    const isEdit = item && !item.nativeEvent && item.id !== undefined;
    if (isEdit) { setEditingItem(item); setFormData(item); }
    else { setEditingItem(null); setFormData({ apartmentName: '', address: '', flatNumber: '', totalBedrooms: 0 }); }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns = [
    { header: 'Name', render: (row) => <span className="font-medium text-[var(--color-text-primary)]">{row.apartmentName}</span> },
    { header: 'Flat Number', accessor: 'flatNumber' },
    { header: 'Bedrooms', accessor: 'totalBedrooms' },
    { header: 'Address', accessor: 'address' },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] transition-all" onClick={() => handleOpenForm(row)}><Edit2 className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#ff0000] hover:bg-[#220000] transition-all" onClick={() => { setItemToDelete(row); setIsConfirmOpen(true); }}><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="Apartments" description="Manage student apartments and flat listings." actions={<Button onClick={() => handleOpenForm()}>Add Apartment</Button>} />
      <Table columns={columns} data={apartments} isLoading={isLoading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Apartment" : "Add New Apartment"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Apartment Name" required value={formData.apartmentName} onChange={(e) => setFormData({...formData, apartmentName: e.target.value})} />
          <FormField label="Flat Number / Code" required value={formData.flatNumber} onChange={(e) => setFormData({...formData, flatNumber: e.target.value})} />
          <FormField label="Total Bedrooms" type="number" required value={formData.totalBedrooms} onChange={(e) => setFormData({...formData, totalBedrooms: parseInt(e.target.value) || 0})} />
          <FormField label="Address" type="textarea" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => deleteMutation.mutate(itemToDelete?.id)} isDestructive title="Delete Apartment" message={`Are you sure you want to delete ${itemToDelete?.apartmentName}?`} isLoading={deleteMutation.isPending} />
    </div>
  );
}
