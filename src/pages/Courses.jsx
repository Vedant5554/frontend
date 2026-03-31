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

export default function Courses() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    courseCode: '', courseName: '', department: '', 
    instructorName: '', instructorPhone: '', instructorEmail: '', 
    instructorRoomNumber: ''
  });

  const token = localStorage.getItem('token');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(res => res.data.data || []),
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (newData) => api.post('/courses', newData),
    onSuccess: () => { queryClient.invalidateQueries(['courses']); toast.success('Course created successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create course')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/courses/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['courses']); toast.success('Course updated successfully'); setIsModalOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update course')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/courses/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['courses']); toast.success('Course deleted successfully'); setIsConfirmOpen(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete course')
  });

  const handleOpenForm = (item = null) => {
    const isEdit = item && !item.nativeEvent && item.id !== undefined;
    if (isEdit) { setEditingItem(item); setFormData(item); }
    else {
      setEditingItem(null);
      setFormData({ courseCode: '', courseName: '', department: '', instructorName: '', instructorPhone: '', instructorEmail: '', instructorRoomNumber: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns = [
    { header: 'Course Code', render: (row) => <span className="font-medium text-white">{row.courseCode}</span> },
    { header: 'Title', accessor: 'courseName' },
    { header: 'Department', accessor: 'department' },
    { header: 'Instructor', accessor: 'instructorName' },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#222222] transition-all" onClick={() => handleOpenForm(row)}><Edit2 className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg text-[#888888] hover:text-[#ff0000] hover:bg-[#220000] transition-all" onClick={() => { setItemToDelete(row); setIsConfirmOpen(true); }}><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="Courses" description="Manage university courses and instructor assignments." actions={<Button onClick={() => handleOpenForm()}>Add Course</Button>} />
      <Table columns={columns} data={courses} isLoading={isLoading} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Course" : "Add New Course"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Course Title" className="col-span-2" required value={formData.courseName} onChange={(e) => setFormData({...formData, courseName: e.target.value})} />
            <FormField label="Course Number" required value={formData.courseCode} onChange={(e) => setFormData({...formData, courseCode: e.target.value})} />
            <FormField label="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            <div className="col-span-2 mt-4 mb-2">
              <h4 className="text-sm font-semibold text-white border-b border-[#333333] pb-2">Instructor Details</h4>
            </div>
            <FormField label="Instructor Name" value={formData.instructorName} onChange={(e) => setFormData({...formData, instructorName: e.target.value})} />
            <FormField label="Instructor Email" type="email" value={formData.instructorEmail} onChange={(e) => setFormData({...formData, instructorEmail: e.target.value})} />
            <FormField label="Instructor Phone" value={formData.instructorPhone} onChange={(e) => setFormData({...formData, instructorPhone: e.target.value})} />
            <FormField label="Room Number" value={formData.instructorRoomNumber} onChange={(e) => setFormData({...formData, instructorRoomNumber: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#333333] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => deleteMutation.mutate(itemToDelete?.id)} isDestructive title="Delete Course" message={`Are you sure you want to delete ${itemToDelete?.courseTitle}?`} isLoading={deleteMutation.isPending} />
    </div>
  );
}
