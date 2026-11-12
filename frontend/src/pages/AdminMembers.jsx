import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { getStoredPlans } from '../services/plansData';

/**
 * AdminMembers Page
 * Full member directory and registration for Gym Administrators.
 * Accessible at /admin/members under DashboardLayout.
 */
function AdminMembers() {
  // Members come from the backend (real DB ids), not from localStorage.
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    const res = await api.getMembers();
    if (res.success) {
      setMembers(Array.isArray(res.data) ? res.data : []);
    } else {
      setStatusNotice({ type: 'error', text: res.error || 'Could not load members from the server.' });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    plan: 'Standard Pro Plan',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [statusNotice, setStatusNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePlans = getStoredPlans().filter((p) => p.status === 'Active');

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatusNotice({ type: '', text: '' });

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const res = await api.createMember(formData);
    if (!res.success) {
      setStatusNotice({ type: 'error', text: res.error || 'Could not register the member.' });
      setIsSubmitting(false);
      return;
    }

    await loadMembers();
    setStatusNotice({
      type: 'success',
      text: `Member ${res.data.fullName} registered with ID ${res.data.id}.`,
    });
    setFormData({ fullName: '', email: '', phone: '', plan: activePlans[0]?.name || 'Standard Pro Plan', password: '' });
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    // "5", "MEM-5" or "#5" -> exact Member ID match only (no phone/other partial matches)
    const idQuery = q.replace(/^(mem-?|id:?|#)\s*/, '');
    const isIdSearch = /^\d{1,6}$/.test(idQuery);
    const matchesSearch =
      !q ||
      (isIdSearch
        ? String(m.id) === String(Number(idQuery))
        : (m.fullName || '').toLowerCase().includes(q) ||
          (m.email || '').toLowerCase().includes(q) ||
          String(m.phone || '').includes(q) ||
          String(m.id).toLowerCase().includes(q));
    const matchesStatus =
      statusFilter === 'ALL' || (m.status || '').toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Admin Member Directory
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Inspect registered gym members, subscription tiers, and register new members
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setStatusNotice({ type: '', text: '' });
          }}
        >
          {showAddForm ? 'Close Form' : '+ Register New Member'}
        </button>
      </div>

      {statusNotice.text && (
        <div
          className={`notice-box ${statusNotice.type === 'success' ? 'notice-box' : 'notice-error'}`}
          style={{ marginBottom: '1.25rem' }}
        >
          {statusNotice.text}
        </div>
      )}

      {/* Member Registration Form */}
      {showAddForm && (
        <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="card-header">
            <h2 className="card-title">Register New Member (Admin Portal)</h2>
          </div>
          <form onSubmit={handleFormSubmit} noValidate>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="admin-member-name" className="form-label">
                  Full Name *
                </label>
                <input
                  id="admin-member-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ananya Deshmukh"
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
                <label htmlFor="admin-member-email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="admin-member-email"
                  type="email"
                  className="form-input"
                  placeholder="ananya@example.com"
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
                <label htmlFor="admin-member-phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  id="admin-member-phone"
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
                <label htmlFor="admin-member-plan" className="form-label">
                  Membership Tier *
                </label>
                <select
                  id="admin-member-plan"
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
              <label htmlFor="admin-member-password" className="form-label">
                Password * (min 6 characters)
              </label>
              <input
                id="admin-member-password"
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

      {/* Member Directory Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="card-title">Registered Members Directory</h2>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search member name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
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
                <th>Email</th>
                <th>Phone</th>
                <th>Plan Tier</th>
                <th>Joined Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{member.id}</td>
                    <td style={{ fontWeight: 500 }}>{member.fullName}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.plan}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{member.joinedDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          member.status === 'Active'
                            ? 'badge-green'
                            : member.status === 'Pending'
                            ? 'badge-warning'
                            : 'badge-gray'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    {loading ? 'Loading members...' : 'No members match the selected criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminMembers;