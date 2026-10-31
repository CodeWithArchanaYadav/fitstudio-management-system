import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

/** "30 Days" / "1 Month" / "2 Weeks" / "1 Year" -> number of days (backend needs durationDays). */
function parseDurationDays(text) {
  const m = String(text || '').match(/(\d+)\s*([a-zA-Z]*)/);
  if (!m) return 30;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit.startsWith('year')) return n * 365;
  if (unit.startsWith('month')) return n * 30;
  if (unit.startsWith('week')) return n * 7;
  return n;
}

/**
 * AdminPlans Page
 * Dedicated plan template management for Gym Administrators.
 * Administrators have full privileges to create, edit, activate/deactivate, and delete plan templates.
 * Accessible at /admin/plans under DashboardLayout.
 */
function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for creating / editing plans
  const [planForm, setPlanForm] = useState({
    name: '',
    duration: '30 Days',
    fee: '',
    facilities: '',
    benefitsText: '',
    status: 'Active',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Load plans from the Spring Boot backend (the database is the source of truth)
  const loadPlans = useCallback(async () => {
    const res = await api.getPlans();
    if (res.success) {
      setPlans(res.data);
    } else {
      setNotice({
        type: 'warning',
        text: res.status === 0
          ? 'Cannot reach the backend. Make sure the Spring Boot server is running on port 6967.'
          : res.error || 'Could not load plans.',
      });
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const resetForm = () => {
    setPlanForm({
      name: '',
      duration: '30 Days',
      fee: '',
      facilities: '',
      benefitsText: '',
      status: 'Active',
      description: '',
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setEditingPlan(null);
    setShowCreateModal(true);
    setNotice({ type: '', text: '' });
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      duration: plan.duration,
      fee: plan.fee.toString(),
      facilities: plan.facilities || '',
      benefitsText: plan.benefits ? plan.benefits.join(', ') : '',
      status: plan.status || 'Active',
      description: plan.description || '',
    });
    setFormErrors({});
    setShowCreateModal(true);
    setNotice({ type: '', text: '' });
  };

  const validate = () => {
    const errs = {};
    if (!planForm.name.trim()) {
      errs.name = 'Plan name is required.';
    }
    if (!planForm.duration.trim()) {
      errs.duration = 'Duration is required.';
    }
    const feeNum = Number(planForm.fee);
    if (!planForm.fee || isNaN(feeNum) || feeNum <= 0) {
      errs.fee = 'Please enter a valid positive fee in Rupees (₹).';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const parsedBenefits = planForm.benefitsText
      ? planForm.benefitsText.split(',').map((b) => b.trim()).filter(Boolean)
      : ['Gym Floor Access', 'Locker Room Access'];

    const planPayload = {
      name: planForm.name.trim(),
      durationDays: parseDurationDays(planForm.duration),
      fee: Number(planForm.fee),
      features: parsedBenefits.join(', '),
      status: planForm.status,
    };

    try {
      const res = editingPlan
        ? await api.updatePlan(editingPlan.id, planPayload)
        : await api.createPlan(planPayload);

      if (res.success) {
        await loadPlans(); // refresh the list from the database
        setNotice({ type: 'success', text: `Plan "${planPayload.name}" saved successfully.` });
        setShowCreateModal(false);
        resetForm();
      } else {
        setNotice({
          type: 'warning',
          text: res.status === 0
            ? 'Cannot reach the backend. Make sure the Spring Boot server is running on port 6967.'
            : res.error || 'Could not save the plan.',
        });
      }
    } catch {
      setNotice({ type: 'warning', text: 'Something went wrong while saving the plan.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (planId) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    const res = await api.updatePlan(planId, {
      name: plan.name,
      durationDays: plan.durationDays,
      fee: plan.fee,
      features: plan.features,
      status: plan.status === 'Active' ? 'Inactive' : 'Active',
    });
    if (res.success) {
      await loadPlans();
      setNotice({ type: 'success', text: `Plan "${plan.name}" status updated.` });
    } else {
      setNotice({ type: 'warning', text: res.error || 'Could not update the plan status.' });
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    if (!window.confirm(`Are you sure you want to delete the plan "${planName}"? This action cannot be undone.`)) return;
    const res = await api.deletePlan(planId);
    if (res.success) {
      await loadPlans();
      setNotice({ type: 'success', text: `Plan "${planName}" deleted.` });
    } else {
      setNotice({ type: 'warning', text: res.error || 'Could not delete the plan.' });
    }
  };

  return (
    <div>
      <div className="flex-between mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Membership Plans Configuration
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Administer gym pricing tiers, validity periods, access privileges, and plan availability
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={openCreateModal}
        >
          + Create New Plan Template
        </button>
      </div>

      {notice.text && (
        <div
          className={`notice-box ${
            notice.type === 'success'
              ? 'notice-box'
              : notice.type === 'warning'
              ? 'notice-warning'
              : 'notice-error'
          }`}
          style={{ marginBottom: '1.25rem' }}
        >
          {notice.text}
        </div>
      )}

      {/* Plan Cards Overview */}
      <div className="grid-3 mb-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="card"
            style={{
              borderColor: plan.status === 'Active' ? 'var(--color-border)' : 'var(--color-danger)',
              opacity: plan.status === 'Active' ? 1 : 0.8,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="card-header">
                <h3 className="card-title">{plan.name}</h3>
                <span
                  className={`badge ${
                    plan.status === 'Active' ? 'badge-green' : 'badge-danger'
                  }`}
                >
                  {plan.status}
                </span>
              </div>

              <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>
                ₹{plan.fee.toLocaleString('en-IN')}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>
                  / {plan.duration}
                </span>
              </div>

              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                {plan.description}
              </p>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                <strong>Facilities:</strong> {plan.facilities}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0', fontSize: '0.85rem', lineHeight: 1.8 }}>
                {plan.benefits?.map((b, i) => (
                  <li key={i} style={{ color: 'var(--color-text)' }}>✓ {b}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => openEditModal(plan)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={() => handleToggleStatus(plan.id)}
              >
                {plan.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleDeletePlan(plan.id, plan.name)}
                title="Delete Plan Template"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Templates Data Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Membership Plan Templates</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Duration</th>
                <th>Fee (₹)</th>
                <th>Facility Access</th>
                <th>Status</th>
                <th>Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.duration}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      ₹{p.fee.toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{p.facilities}</td>
                    <td>
                      <span className={`badge ${p.status === 'Active' ? 'badge-green' : 'badge-danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(p)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleToggleStatus(p.id)}
                        >
                          {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>
                    No membership plans configured yet. Click "+ Create New Plan Template" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Plan Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-header" style={{ marginBottom: '1.25rem' }}>
              <h2 className="card-title">
                {editingPlan ? 'Edit Membership Plan Template' : 'Create New Plan Template'}
              </h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} noValidate>
              <div className="form-group">
                <label className="form-label">Plan Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Quarterly Pro Tier"
                  value={planForm.name}
                  onChange={(e) => {
                    setPlanForm({ ...planForm, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  disabled={isSubmitting}
                />
                {formErrors.name && <div className="form-error">{formErrors.name}</div>}
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Duration *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 30 Days or 90 Days"
                    value={planForm.duration}
                    onChange={(e) => {
                      setPlanForm({ ...planForm, duration: e.target.value });
                      if (formErrors.duration) setFormErrors({ ...formErrors, duration: '' });
                    }}
                    disabled={isSubmitting}
                  />
                  {formErrors.duration && <div className="form-error">{formErrors.duration}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Fee Amount in INR (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input"
                    placeholder="e.g. 3000"
                    value={planForm.fee}
                    onChange={(e) => {
                      setPlanForm({ ...planForm, fee: e.target.value });
                      if (formErrors.fee) setFormErrors({ ...formErrors, fee: '' });
                    }}
                    disabled={isSubmitting}
                  />
                  {formErrors.fee && <div className="form-error">{formErrors.fee}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Facility Access Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full Facility, Sauna, Group Classes"
                  value={planForm.facilities}
                  onChange={(e) => setPlanForm({ ...planForm, facilities: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Included Privileges / Benefits (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Gym Floor Access, 24/7 Entry, Steam Room"
                  value={planForm.benefitsText}
                  onChange={(e) => setPlanForm({ ...planForm, benefitsText: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Plan Status</label>
                  <select
                    className="form-select"
                    value={planForm.status}
                    onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                    disabled={isSubmitting}
                  >
                    <option value="Active">Active (Available for Enrollment)</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Plan Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Provide a concise description of this membership pass..."
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan Template'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
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

export default AdminPlans;