import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/ui/PageHeader';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';

export default function MyProfile({ userId, role }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});
  const [kinModalOpen, setKinModalOpen] = useState(false);
  const [editingKin, setEditingKin] = useState(null);
  const [kinForm, setKinForm] = useState({
    firstName: '', lastName: '', relationship: '',
    street: '', city: '', postcode: '',
    phone: '', email: ''
  });

  const isStudent = role === 'STUDENT';
  const endpoint = isStudent ? `/students/${userId}` : `/advisers/${userId}`;

  const token = localStorage.getItem('token');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile', userId, role],
    queryFn: () => api.get(endpoint).then(res => res.data.data),
    enabled: !!token
  });

  const { data: nextOfKin = [] } = useQuery({
    queryKey: ['next-of-kin', userId],
    queryFn: () => api.get(`/students/${userId}/next-of-kin`).then(res => res.data.data || []),
    enabled: !!token && isStudent
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(endpoint, data),
    onSuccess: () => toast.success('Profile updated successfully'),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile')
  });

  const createKinMutation = useMutation({
    mutationFn: (data) => api.post(`/students/${userId}/next-of-kin`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['next-of-kin', userId]);
      toast.success('Next of Kin added');
      setKinModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add next of kin')
  });

  const updateKinMutation = useMutation({
    mutationFn: ({ kinId, data }) => api.put(`/students/${userId}/next-of-kin/${kinId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['next-of-kin', userId]);
      toast.success('Next of Kin updated');
      setKinModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update next of kin')
  });

  const deleteKinMutation = useMutation({
    mutationFn: (kinId) => api.delete(`/students/${userId}/next-of-kin/${kinId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['next-of-kin', userId]);
      toast.success('Next of Kin removed');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to remove next of kin')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    delete payload.password;
    updateMutation.mutate(payload);
  };

  const handleOpenKinForm = (kin = null) => {
    if (kin) {
      setEditingKin(kin);
      setKinForm({ ...kin });
    } else {
      setEditingKin(null);
      setKinForm({
        firstName: '', lastName: '', relationship: '',
        street: '', city: '', postcode: '',
        phone: '', email: ''
      });
    }
    setKinModalOpen(true);
  };

  const handleKinSubmit = (e) => {
    e.preventDefault();
    if (editingKin) {
      updateKinMutation.mutate({ kinId: editingKin.id || editingKin.kinId, data: kinForm });
    } else {
      createKinMutation.mutate(kinForm);
    }
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="p-8 page-transition-enter-active">
      <PageHeader title="My Profile" description="Manage your personal details." />
      
      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]/60 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <FormField label="Last Name" required value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            <FormField label="Email" type="email" required value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <FormField label="Phone" value={formData.phone || formData.mobilePhone || ''} onChange={(e) => setFormData({...formData, [isStudent ? 'mobilePhone' : 'phone']: e.target.value})} />
            
            {isStudent && (
              <>
                <FormField label="Date of Birth" type="date" value={formData.dateOfBirth?.split('T')[0] || ''} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
                <FormField label="Gender" type="select" value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})} options={[
                  {label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Other', value: 'Other'}
                ]} />
                <FormField label="Nationality" value={formData.nationality || ''} onChange={(e) => setFormData({...formData, nationality: e.target.value})} />
                <FormField label="Category" type="select" disabled value={formData.category || ''} options={[
                  {label: formData.category, value: formData.category}
                ]} />
                <FormField label="Banner Number" value={formData.bannerNumber || ''} onChange={(e) => setFormData({...formData, bannerNumber: e.target.value})} />
                <FormField label="Major" value={formData.major || ''} onChange={(e) => setFormData({...formData, major: e.target.value})} />
                <FormField label="Minor" value={formData.minor || ''} onChange={(e) => setFormData({...formData, minor: e.target.value})} />
                <FormField label="Special Needs" className="col-span-2" type="textarea" value={formData.specialNeeds || ''} onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})} />
                <FormField label="Additional Comments" className="col-span-2" type="textarea" value={formData.additionalComments || ''} onChange={(e) => setFormData({...formData, additionalComments: e.target.value})} />
                <div className="col-span-2 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-4">
                  <h4 className="col-span-3 text-sm font-semibold text-[var(--color-text-primary)]">Home Address</h4>
                  <FormField label="Street" className="col-span-3" value={formData.street || ''} onChange={(e) => setFormData({...formData, street: e.target.value})} />
                  <FormField label="City" className="col-span-2" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  <FormField label="Postcode" value={formData.postcode || ''} onChange={(e) => setFormData({...formData, postcode: e.target.value})} />
                </div>
              </>
            )}
            {!isStudent && (
              <FormField label="Department" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            )}
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] modal-actions">
            <Button type="submit" isLoading={updateMutation.isPending}>Save Changes</Button>
          </div>
        </form>
      </div>

      {/* Next of Kin Section */}
      {isStudent && (
        <div className="mt-8 max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Next of Kin</h3>
            <Button size="sm" onClick={() => handleOpenKinForm()}>
              <UserPlus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>

          {nextOfKin.length === 0 ? (
            <div className="bg-[var(--color-surface-hover)] border border-amber-200 rounded-xl p-6 text-center text-amber-700 text-sm">
              No next of kin on file. Please add at least one emergency contact.
            </div>
          ) : (
            <div className="space-y-3">
              {nextOfKin.map((kin, idx) => (
                <div key={kin.id || kin.kinId || idx} className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]/60 p-5 flex items-start justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <div className="font-semibold text-[var(--color-text-primary)]">{kin.firstName} {kin.lastName}</div>
                    <div className="text-sm text-[var(--color-text-muted)] mt-1">{kin.relationship || 'Relationship not specified'}</div>
                    {(kin.street || kin.city || kin.postcode) && (
                      <div className="text-sm text-[var(--color-text-muted)] mt-1">
                        {[kin.street, kin.city, kin.postcode].filter(Boolean).join(', ')}
                      </div>
                    )}
                    <div className="text-sm text-[var(--color-text-muted)] mt-1 space-x-4">
                      {kin.phone && <span>📞 {kin.phone}</span>}
                      {kin.email && <span>✉️ {kin.email}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] transition-all" onClick={() => handleOpenKinForm(kin)}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[#ff0000] hover:bg-[#220000] transition-all" onClick={() => deleteKinMutation.mutate(kin.id || kin.kinId)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal isOpen={kinModalOpen} onClose={() => setKinModalOpen(false)} title={editingKin ? 'Edit Next of Kin' : 'Add Next of Kin'}>
            <form onSubmit={handleKinSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" required value={kinForm.firstName} onChange={(e) => setKinForm({...kinForm, firstName: e.target.value})} />
                <FormField label="Last Name" required value={kinForm.lastName} onChange={(e) => setKinForm({...kinForm, lastName: e.target.value})} />
                <FormField label="Relationship" value={kinForm.relationship} onChange={(e) => setKinForm({...kinForm, relationship: e.target.value})} />
                <FormField label="Phone" value={kinForm.phone} onChange={(e) => setKinForm({...kinForm, phone: e.target.value})} />
                <FormField label="Email" type="email" value={kinForm.email} onChange={(e) => setKinForm({...kinForm, email: e.target.value})} />
                <div className="col-span-2 mt-2 mb-1">
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)] border-b pb-2">Address</h4>
                </div>
                <FormField label="Street" className="col-span-2" value={kinForm.street} onChange={(e) => setKinForm({...kinForm, street: e.target.value})} />
                <FormField label="City" value={kinForm.city} onChange={(e) => setKinForm({...kinForm, city: e.target.value})} />
                <FormField label="Postcode" value={kinForm.postcode} onChange={(e) => setKinForm({...kinForm, postcode: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] modal-actions">
                <Button variant="outline" type="button" onClick={() => setKinModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={createKinMutation.isPending || updateKinMutation.isPending}>Save</Button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}
