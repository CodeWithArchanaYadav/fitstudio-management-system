import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiRequest } from '../api';

function Memberships() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', duration: '', fee: '', description: '' });
  const [notice, setNotice] = useState('');

  const loadPlans = () => {
    setLoading(true);
    apiRequest('/plans')
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPlans(); }, []);

  const resetForm = () => {
    setFormData({ name: '', duration: '', fee: '', description: '' });
    setEditId(null);
    setShowPlanForm(false);
  };

  const parseDays = (text) => {
    const s = String(text).toLowerCase();
    const n = parseInt(s.replace(/[^\d]/g, ''), 10);
    if (!n) return null;
    if (s.includes('year')) return n * 365;
    if (s.includes('month')) return n * 30;
    return n;
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    const durationDays = parseDays(formData.duration);
    if (!durationDays) {
      setNotice('Please enter duration as a number of days, e.g. 30 or "30 days".');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      durationDays,
      fee: Number(formData.fee),
      features: formData.description,
      status: 'Active',
    };

    try {
      if (editId) {
        await apiRequest(`/plans/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
        setNotice('Plan updated successfully.');
      } else {
        await apiRequest('/plans', { method: 'POST', body: JSON.stringify(payload) });
        setNotice('Plan created successfully.');
      }
      resetForm();
      loadPlans();
    } catch (err) {
      setNotice(err.message || 'Unable to save membership plan at this time.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await apiRequest(`/plans/${id}`, { method: 'DELETE' });
      setNotice('Plan deleted.');
      loadPlans();
    } catch (err) {
      setNotice(err.message || 'Failed to delete plan.');
    }
  };

  const handleEdit = (p) => {
    setFormData({ name: p.name || '', duration: p.duration || p.durationDays || '', fee: p.fee || p.price || '', description: p.description || p.features || '' });
    setEditId(p.id);
    setShowPlanForm(true);
    setNotice('');
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '2rem 1.25rem' }}>
        <div className="flex-between mb-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Membership Plans &amp; Subscriptions
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Gym membership tiers, durations, and pricing structures
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              ← Back to Dashboard
            </Link>
            <button type="button" className="btn btn-primary btn-sm"
              onClick={() => { resetForm(); setShowPlanForm(!showPlanForm); setNotice(''); }}>
              {showPlanForm && !editId ? 'Close Plan Form' : '+ Add Plan Template'}
            </button>
          </div>
        </div>

        {notice && (
          <div className="notice-box notice-warning">
            {notice}
          </div>
        )}

        {/* Create / Edit Plan Form */}
        {showPlanForm && (
          <div className="card mb-3" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="card-header">
              <h2 className="card-title">{editId ? 'Edit Membership Plan' : 'New Membership Plan Form'}</h2>
            </div>
            <form onSubmit={handleCreatePlan}>
              <div className="grid-3">
                <div className="form-group">
                  <label htmlFor="plan-name" className="form-label">Plan Name</label>
                  <input id="plan-name" type="text" className="form-input" placeholder="e.g. Monthly Standard"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="plan-duration" className="form-label">Duration (Days / Months)</label>
                  <input id="plan-duration" type="text" className="form-input" placeholder="e.g. 30 Days"
                    value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="plan-fee" className="form-label">Fee Amount (₹)</label>
                  <input id="plan-fee" type="number" className="form-input" placeholder="e.g. 1500"
                    value={formData.fee} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="plan-desc" className="form-label">Plan Features &amp; Privileges</label>
                <textarea id="plan-desc" className="form-textarea" rows="2"
                  placeholder="Describe facilities included in this plan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">Save Plan</button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Plan Cards — from API or static fallback */}
        {!loading && plans.length === 0 && (
          <div className="grid-3 mb-3">
            {[
              { name: 'Basic Gym Plan', price: '₹1,500', badge: 'Starter', badgeClass: 'badge-gray', features: ['✓ Gym Floor Access', '✓ Locker Room Access', '✗ Personal Trainer', '✗ Weekend Guest Passes'], btnClass: 'btn-secondary' },
              { name: 'Standard Pro Plan', price: '₹3,000', badge: 'Popular', badgeClass: 'badge-green', features: ['✓ Full Facility 24/7 Access', '✓ Group Fitness Classes', '✓ Locker & Sauna Access', '✗ Personal Trainer'], btnClass: 'btn-primary' },
              { name: 'Premium Elite Plan', price: '₹5,000', badge: 'VIP', badgeClass: 'badge-blue', features: ['✓ All Standard Features', '✓ Assigned Personal Trainer', '✓ Custom Nutrition Plan', '✓ Unlimited Guest Passes'], btnClass: 'btn-secondary' },
            ].map((p) => (
              <div key={p.name} className="card" style={p.btnClass === 'btn-primary' ? { borderColor: 'var(--color-primary)' } : {}}>
                <div className="card-header">
                  <h3 className="card-title">{p.name}</h3>
                  <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>
                  {p.price} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <button type="button" className={`btn ${p.btnClass} btn-full btn-sm`}
                  onClick={() => setNotice('Enrollment service is currently unavailable. Please try again later.')}>
                  Enroll Member
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Member Subscriptions Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active Member Subscriptions</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Duration</th>
                  <th>Fee (₹)</th>
                  <th>Features</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem' }}>Loading…</td></tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                      No active member subscriptions found.
                    </td>
                  </tr>
                ) : plans.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.duration || (p.durationDays ? `${p.durationDays} Days` : '—')}</td>
                    <td>₹{(p.fee || p.price || 0).toLocaleString('en-IN')}</td>
                    <td>{p.description || p.features || '—'}</td>
                    <td style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                      <button type="button" className="btn btn-sm" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}
                        onClick={() => handleDelete(p.id)}>Delete</button>
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

export default Memberships;
