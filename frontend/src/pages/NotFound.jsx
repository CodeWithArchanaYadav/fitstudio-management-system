import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * NotFound Component
 * Graceful 404 page for unknown URLs.
 * Maintains FitStudio styling and provides intuitive recovery navigation.
 */
function NotFound() {
  return (
    <div>
      <Navbar />

      <main style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div className="card" style={{ maxWidth: '480px', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
              404 — Not Found
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Page Not Found
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            The page URL you requested is not recognized. Please check the address or return to the main application.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
