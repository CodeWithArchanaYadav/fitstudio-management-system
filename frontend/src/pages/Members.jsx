import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiRequest } from '../api';

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', plan: 'Standard' });
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('warning');

  const loadMembers = () => {
    setLoading(true);
    apiRequest('/members')
      .then(setMembers)
      .catch((err) => showMsg(err.message || 'Failed to load members.', 'warning'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMembers(); }, []);

  const showMsg = (msg, type = 'warning') => {
    setStatusMessage(msg);
    setStatusType(type);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ fullName: '', email: '', phone: '', plan: 'Standard' });
    setEditId(null);
    setShowAddForm(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      showMsg('Validation Error: Please provide both full name and email.');
      return;
    }

    const digits = formData.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      showMsg('Validation Error: Phone number must be 10-15 digits.');
      return;
    }

    const payload = {
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: digits,
      plan: formData.plan,
      status: 'Active',
    };

    try {
      if (editId) {
        await apiRequest(`/members/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
        showMsg('Member updated successfully.', 'success');
      } else {
        await apiRequest('/members', { method: 'POST', body: JSON.stringify(payload) });
        showMsg('Member registered successfully.', 'success');
      }
      resetForm();
      loadMembers();
    } catch (err) {
      showMsg(err.message || 'Unable to complete member registration at this time.');
    }
  };

  const handleEdit = (m) => {
    setFormData({ fullName: m.fullName || m.name || '', email: m.email || '', phone: m.phone || '', plan: m.plan || m.membershipPlan || 'Standard' });
    setEditId(m.id);
    setShowAddForm(true);
    setStatusMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await apiRequest(`/members/${id}`, { method: 'DELETE' });
      showMsg('Member deleted.', 'success');
      loadMembers();
    } catch (err) {
      showMsg(err.message || 'Failed to delete member.');
    }
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        <div className="flex-between mb-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Gym Members Management
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              View registered gym members and add new subscriptions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              ← Back to Dashboard
            </Link>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => { resetForm(); setShowAddForm(!showAddForm); setStatusMessage(''); }}
            >
              {showAddForm && !editId ? 'Close Form' : '+ Register New Member'}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className={`notice-box notice-${statusType}`}>
            {statusMessage}
          </div>
        )}

        {showAddForm && (
          <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="card-header">
              <h2 className="card-title">{editId ? 'Edit Member' : 'Register New Member'}</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="member-fullname" className="form-label">Full Name</label>
                  <input id="member-fullname" type="text" name="fullName" className="form-input"
                    placeholder="e.g. Rahul Sharma" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="member-email" className="form-label">Email Address</label>
                  <input id="member-email" type="email" name="email" className="form-input"
                    placeholder="rahul@example.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="member-phone" className="form-label">Phone Number</label>
                  <input id="member-phone" type="tel" name="phone" className="form-input"
                    placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="member-plan" className="form-label">Membership Tier</label>
                  <select id="member-plan" name="plan" className="form-select" value={formData.plan} onChange={handleChange}>
                    <option value="Basic">Basic (Gym Floor)</option>
                    <option value="Standard">Standard (Full Access)</option>
                    <option value="Premium">Premium (Personal Trainer Included)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Update Member' : 'Submit Registration'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Registered Members Directory</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem' }}>Loading…</td></tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                      No registered members found.
                    </td>
                  </tr>
                ) : members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.fullName || m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone || '—'}</td>
                    <td>{m.plan || m.membershipPlan || '—'}</td>
                    <td>
                      <span className={`badge ${m.status === 'ACTIVE' || m.active ? 'badge-green' : 'badge-gray'}`}>
                        {m.status || (m.active ? 'Active' : 'Inactive')}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleEdit(m)}>Edit</button>
                      <button type="button" className="btn btn-sm" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}
                        onClick={() => handleDelete(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Members;
