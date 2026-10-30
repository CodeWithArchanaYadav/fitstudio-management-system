import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

/**
 * Login Page
 * Common login form for all FitStudio roles (Admin, Receptionist, Trainer, Member).
 * Validates inputs, handles offline development states honestly without pretending authentication exists.
 * Preserves the FitStudio theme and direct URL access during frontend development.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address format.';
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter your password.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ type: '', text: '' });

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.login({ email: email.trim(), password });

      if (response.success) {
        setNotice({
          type: 'info',
          text: 'Authentication response received from backend.',
        });
      } else {
        setNotice({
          type: 'warning',
          text: 'The authentication service is currently unavailable. In this frontend development stage without a Spring Boot backend, all dashboard pages are directly accessible via their URLs.',
        });
      }
    } catch {
      setNotice({
        type: 'warning',
        text: 'The authentication service is currently unavailable. All dashboard pages remain directly accessible via their URLs.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
          {/* FitStudio Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
              Fit<span style={{ color: 'var(--color-primary)' }}>Studio</span>
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Sign in to your gym account
            </p>
          </div>

          {/* Notice Banner */}
          {notice.text && (
            <div
              className={`notice-box ${notice.type === 'warning' ? 'notice-warning' : 'notice-box'}`}
              style={{ marginBottom: '1.25rem' }}
            >
              {notice.text}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                disabled={isSubmitting}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                disabled={isSubmitting}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          {/* Offline Registration Information Footer */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              Member accounts are registered offline at the front desk. After registration, login credentials are sent to your registered email address.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
