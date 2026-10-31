import React, { useState } from 'react';
import { api } from '../services/api';
import { getStoredPlans } from '../services/plansData';
import { useGymData, gymStore } from '../services/gymData';

/**
 * ReceptionistMembers Page
 * Front Desk member lookup, offline registration, details viewing, and contact updates.
 * Accessible at /receptionist/members under DashboardLayout.
 */
function ReceptionistMembers() {
  const { members, addMember, updateMember } = useGymData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({ phone: '', emergencyContact: '', address: '' });
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin-configured active plans for registration
  const activePlans = getStoredPlans().filter((p) => p.status === 'Active');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    plan: activePlans[0]?.name || 'Standard Pro Plan',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 10) {
      errs.phone = 'Enter a valid 10-digit phone number.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterOfflineMember = async (e) => {
    e.preventDefault();
    setNotice({ type: '', text: '' });

    if (!validate()) return;

    setIsSubmitting(true);

    const selectedPlanObj = activePlans.find((p) => p.name === formData.plan) || activePlans[0];
    const newMemberId = `MEM-${Math.floor(1004 + Math.random() * 800)}`;

    const newMember = {
      id: newMemberId,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      plan: formData.plan,
      planFee: selectedPlanObj?.fee || 3000,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalCheckIns: 0,
      lastCheckIn: 'Never',
    };

    addMember(newMember);

    try {
      await api.createMember(formData);
    } catch {
      // In offline/frontend preview mode, fallback safely
    }

    setNotice({
      type: 'info',
      text: `Offline registration recorded for ${newMember.fullName} (${newMember.id}). Member record is now active and ready for personal trainer assignment.`,
    });

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      plan: activePlans[0]?.name || 'Standard Pro Plan',
      password: '',
    });
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setEditFormData({
      phone: member.phone,
      emergencyContact: member.emergencyContact || '',
      address: member.address || '',
    });
  };

  const handleSaveContactUpdate = (e) => {
    e.preventDefault();
    if (!editFormData.phone.trim()) return;

    updateMember(editingMember.id, {
      phone: editFormData.phone.trim(),
      emergencyContact: editFormData.emergencyContact.trim(),
      address: editFormData.address.trim(),
    });

    setNotice({
      type: 'info',
      text: `Contact information updated for ${editingMember.fullName} (${editingMember.id}).`,
    });
    setEditingMember(null);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || m.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Front Desk Member Directory
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Register walk-in members, view membership details, and update contact information
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setNotice({ type: '', text: '' });
          }}
        >
          {showAddForm ? 'Close Registration Form' : '+ Register Walk-In Member'}
        </button>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${notice.type === 'error' ? 'notice-error' : notice.type === 'warning' ? 'notice-warning' : 'notice-box'}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {notice.text}
        </div>
      )}

      {/* Offline Walk-In Member Registration Form */}
      {showAddForm && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <h2 className="card-title">Register New Member (Front Desk)</h2>
          </div>

          <form onSubmit={handleRegisterOfflineMember} noValidate>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="receptionist-member-name" className="form-label">
                  Full Name *
                </label>
                <input
                  id="receptionist-member-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sameer Kulkarni"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                  }}
                  disabled={isSubmitting}
                />
                {formErrors.fullName && <div className="form-error">{formErrors.fullName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="receptionist-member-email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="receptionist-member-email"
                  type="email"
                  className="form-input"
                  placeholder="sameer.k@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  disabled={isSubmitting}
                />
                {formErrors.email && <div className="form-error">{formErrors.email}</div>}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="receptionist-member-phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  id="receptionist-member-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                  }}
                  disabled={isSubmitting}
                />
                {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="receptionist-member-plan" className="form-label">
                  Membership Tier *
                </label>
                <select
                  id="receptionist-member-plan"
                  className="form-select"
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  disabled={isSubmitting}
                >
                  {activePlans.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (₹{p.fee.toLocaleString('en-IN')}/{p.duration})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="receptionist-member-password" className="form-label">
                Password * (min 6 characters)
              </label>
              <input
                id="receptionist-member-password"
                type="password"
                className="form-input"
                placeholder="Set account password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                }}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {formErrors.password && <div className="form-error">{formErrors.password}</div>}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Submit Registration'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members Directory Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title">Registered Members List</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Preview data in development mode. Inspect member details or update permitted contact information.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '240px', padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '130px', padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Plan Tier</th>
                <th>Trainer</th>
                <th>Status</th>
                <th>Total Check-Ins</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const assignedCoach = gymStore.getTrainerForMember(member.id);
                  const coachName = assignedCoach ? assignedCoach.name : 'Unassigned';
                  const checkInsCount = member.totalCheckIns ?? (member.status === 'Active' ? 18 : 0);

                  return (
                    <tr key={member.id}>
                      <td style={{ fontWeight: 600 }}>{member.id}</td>
                      <td style={{ fontWeight: 500 }}>{member.fullName}</td>
                      <td>
                        <div>{member.phone}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{member.email}</div>
                      </td>
                      <td>{member.plan}</td>
                      <td>
                        <span className={`badge ${coachName !== 'Unassigned' ? 'badge-blue' : 'badge-gray'}`}>
                          {coachName}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${member.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{checkInsCount}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedMember(member)}
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleOpenEdit(member)}
                          >
                            Edit Contact
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No members found matching "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="modal-backdrop" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div>
                <h2 className="card-title">{selectedMember.fullName} ({selectedMember.id})</h2>
                <span className={`badge ${selectedMember.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                  {selectedMember.status} Membership
                </span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedMember(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Email Address</span>
                <strong>{selectedMember.email}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Phone Number</span>
                <strong>{selectedMember.phone}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Current Plan Tier</span>
                <strong>{selectedMember.plan} {selectedMember.planFee ? `(₹${Number(selectedMember.planFee).toLocaleString('en-IN')})` : ''}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Assigned Coach</span>
                <strong>{gymStore.getTrainerForMember(selectedMember.id)?.name || 'Unassigned'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Joined Date</span>
                <span>{selectedMember.joinedDate}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Pass Expiry Date</span>
                <span>{selectedMember.expiryDate}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Last Recorded Check-In</span>
                <span>{selectedMember.lastCheckIn}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Total Lifetime Visits</span>
                <strong>{selectedMember.totalCheckIns} Visits</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Residential Address</span>
              <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>{selectedMember.address}</p>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>Emergency Contact</span>
              <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>{selectedMember.emergencyContact}</p>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedMember(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permitted Contact Info Modal */}
      {editingMember && (
        <div className="modal-backdrop" onClick={() => setEditingMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">Update Contact Info: {editingMember.fullName}</h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditingMember(null)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Receptionists may update contact phone, address, and emergency contact. Plan modifications and status are governed by Admin plan policies.
            </p>

            <form onSubmit={handleSaveContactUpdate}>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.emergencyContact}
                  onChange={(e) => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Contact Updates
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingMember(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceptionistMembers;
