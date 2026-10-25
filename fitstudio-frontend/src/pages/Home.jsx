import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Home Page
 * Public landing page for FitStudio.
 * Features:
 * - FitStudio name and clean header
 * - Short gym introduction
 * - Basic services list
 * - Contact details placeholder
 * - Direct Login link
 */
function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero / Introduction Section */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-border)', padding: '3.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem' }}>
            Welcome to <span style={{ color: 'var(--color-primary)' }}>FitStudio</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            FitStudio is a modern gym management platform designed to streamline memberships, personal training schedules, and fitness facility operations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Sign In to FitStudio
            </Link>
          </div>
        </div>
      </section>

      {/* Basic Services Section */}
      <section id="services" style={{ padding: '3.5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Our Gym Services
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Comprehensive fitness facilities and guidance for every goal
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Strength & Conditioning</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Full suite of free weights, Olympic lifting racks, and resistance machines maintained to safety standards.
              </p>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Personal Training</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Dedicated certified trainers offering customized exercise regimens, weekly progress reviews, and technique coaching.
              </p>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Cardio & Functional Zone</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                High-end treadmills, rowing machines, and open turf area designed for agility and functional training routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details Placeholder Section */}
      <section id="contact" style={{ padding: '3.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Contact FitStudio
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Reach out for membership queries or facility visits
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Facility Address</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                [Placeholder: 101 Fitness Boulevard, Bandra West, Mumbai, MH 400050]
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Front Desk Phone</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                [Placeholder: +91 98765 43210]
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Email Inquiries</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                [Placeholder: contact@fitstudio-gym.com]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid var(--color-border)', padding: '1.5rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          &copy; 2026 FitStudio Gym Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
