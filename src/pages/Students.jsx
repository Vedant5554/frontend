import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Table } from '../components/ui/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/ui/SearchBar';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function Students() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    dateOfBirth: '', street: '', city: '', postcode: '',
    mobilePhone: '', gender: 'Other', nationality: '',
    category: 'UNDERGRADUATE', waitingList: false,
    bannerNumber: '', major: '', minor: '',
    specialNeeds: '', additionalComments: ''
  });

  const token = localStorage.getItem('token');

  const { data: allStudents = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data } = await api.get('/students');
      return data.data || [];
    },
    enabled: !!token
  });

  // Instant client-side search filtering
  const students = search
    ? allStudents.filter(s =>
        `${s.firstName} ${s.lastName} ${s.email} ${s.bannerNumber} ${s.major}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : allStudents;

  const createMutation = useMutation({
    mutationFn: (newStudent) => api.post('/students', newStudent),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      toast.success('Student created successfully');
      setIsModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create student')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/students/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      toast.success('Student updated successfully');
      setIsModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update student')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      toast.success('Student deleted successfully');
      setIsConfirmOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete student')
  });

  const handleOpenForm = (student = null) => {
    const isEdit = student && !student.nativeEvent && student.studentId !== undefined;

    if (isEdit) {
      setEditingStudent(student);
      setFormData({
        ...student,
        password: '',
      });
    } else {
      setEditingStudent(null);
      setFormData({
        firstName: '', lastName: '', email: '', password: '',
        dateOfBirth: '', street: '', city: '', postcode: '',
        mobilePhone: '', gender: 'Other', nationality: '',
        category: 'UNDERGRADUATE', waitingList: false,
        bannerNumber: '', major: '', minor: '',
        specialNeeds: '', additionalComments: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      updateMutation.mutate({ id: editingStudent.studentId, data: payload });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { header: 'Banner/Name', render: (row) => (
      <div>
        <div className="font-medium text-[var(--color-text-primary)]">{row.firstName} {row.lastName}</div>
        <div className="text-xs text-[var(--color-text-muted)]">{row.bannerNumber || 'No Banner #'}</div>
      </div>
    )},
    { header: 'Email/Major', render: (row) => (
      <div>
        <div className="text-[var(--color-text-secondary)]">{row.email}</div>
        <div className="text-xs text-[var(--color-text-muted)]">{row.major || 'No Major'}</div>
      </div>
    )},
    { header: 'Category', render: (row) => (
      <Badge color={row.category === 'UNDERGRADUATE' ? 'indigo' : row.category === 'POSTGRADUATE' ? 'blue' : 'amber'}>
        {row.category}
      </Badge>
    )},
    { header: 'Status', render: (row) => (
      row.waitingList ? <Badge color="amber">Waiting</Badge> : <Badge color="green">Active</Badge>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] transition-all" onClick={() => handleOpenForm(row)}>
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#ff0000] hover:bg-[#220000] transition-all" onClick={() => {
          setStudentToDelete(row);
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
        title="Students"
        description="Manage university student records and accommodation assignments."
        actions={
          <Button onClick={() => handleOpenForm()} size="md">
            <Plus className="w-4 h-4" />
            Add New Student
          </Button>
        }
      />

      <div className="mb-6 w-full max-w-sm">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search students..." 
        />
      </div>

      <Table 
        columns={columns} 
        data={students} 
        isLoading={isLoading} 
        pagination={true}
        pageSize={50}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <FormField label="Last Name" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            <FormField label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <FormField label="Password" type="password" required={!editingStudent} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={editingStudent ? "Leave blank to keep unchanged" : ""} />
            <FormField label="Date of Birth" type="date" value={formData.dateOfBirth?.split('T')[0] || ''} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
            <FormField label="Mobile Phone" value={formData.mobilePhone} onChange={(e) => setFormData({...formData, mobilePhone: e.target.value})} />
            <FormField label="Gender" type="select" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} options={[
              {label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Other', value: 'Other'}
            ]} />
            <FormField label="Nationality" value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} />
            <FormField label="Category" type="select" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} options={[
              {label: 'Undergraduate', value: 'UNDERGRADUATE'}, {label: 'Postgraduate', value: 'POSTGRADUATE'}, {label: 'International', value: 'INTERNATIONAL'}
            ]} />
            <FormField label="Banner Number" value={formData.bannerNumber} onChange={(e) => setFormData({...formData, bannerNumber: e.target.value})} />

            <div className="col-span-2 mt-2 mb-1">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Address</h4>
            </div>
            <FormField label="Street" className="col-span-2" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
            <FormField label="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            <FormField label="Postcode" value={formData.postcode} onChange={(e) => setFormData({...formData, postcode: e.target.value})} />

            <div className="col-span-2 mt-2 mb-1">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Academic Details</h4>
            </div>
            <FormField label="Major" value={formData.major} onChange={(e) => setFormData({...formData, major: e.target.value})} />
            <FormField label="Minor" value={formData.minor} onChange={(e) => setFormData({...formData, minor: e.target.value})} />
            <FormField label="Special Needs" className="col-span-2" type="textarea" value={formData.specialNeeds} onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})} />
            <FormField label="Additional Comments" className="col-span-2" type="textarea" value={formData.additionalComments} onChange={(e) => setFormData({...formData, additionalComments: e.target.value})} />
            <div className="col-span-2 flex items-center mt-2">
              <input type="checkbox" id="waitingList" className="w-4 h-4 accent-white text-[var(--color-text-primary)] border-[var(--color-border)] rounded focus:ring-white" checked={formData.waitingList} onChange={(e) => setFormData({...formData, waitingList: e.target.checked})} />
              <label htmlFor="waitingList" className="ml-2 text-sm text-[var(--color-text-secondary)]">Add to Waiting List</label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] modal-actions">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(studentToDelete?.studentId)}
        isDestructive
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.firstName}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
