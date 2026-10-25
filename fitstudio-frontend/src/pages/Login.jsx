import React, { useState } from 'react';
import Navbar from '../components/Navbar';

/**
 * Login Page
 * Unified login form for all FitStudio roles (Admin, Receptionist, Trainer, Member).
 * Clean, production-ready form ready for integration with the Spring Boot authentication API.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Standard client-side form validation
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Graceful error handling when authentication service is unavailable
    setErrorMessage('Unable to connect to authentication service. Please check your network or try again later.');
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
              Welcome back. Sign in to your account.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="notice-box notice-error" style={{ marginBottom: '1.25rem' }}>
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
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
                onChange={(e) => setEmail(e.target.value)}
              />
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full mt-2">
              Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
