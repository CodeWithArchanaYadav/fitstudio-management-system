import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Home Page
 * Public landing page for FitStudio Gym & Fitness Studio.
 * Preserves the FitStudio emerald & slate theme.
 * Displays gym facilities, operating hours, and front desk contact information.
 * Offline registration is conducted in person at the gym front desk.
 */
function Home() {
  const gymPhone = '+91 98765 43210';
  const gymTelHref = 'tel:+919876543210';

  return (
    <div>
      <Navbar />

      {/* Hero / Introduction Section */}
      <section style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '4.5rem 0 3.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
              Gym & Fitness Studio • Front Desk Offline Registration
            </span>
          </div>

          <h1 style={{ fontSize: '2.85rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            Elevate Your Training at <span style={{ color: 'var(--color-primary)' }}>FitStudio</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', maxWidth: '720px', margin: '0 auto 2.25rem auto', lineHeight: 1.65 }}>
            A premier fitness and strength training facility built for dedicated athletes and everyday fitness enthusiasts.
            Featuring Olympic lifting platforms, functional turf, certified personal coaches, and dedicated front desk operations.
          </p>

          {/* Prominent Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a
              href={gymTelHref}
              className="btn btn-primary"
              style={{ padding: '0.8rem 2rem', fontSize: '1.02rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>📞</span>
              <span>Call Now: {gymPhone}</span>
            </a>
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ padding: '0.8rem 2rem', fontSize: '1.02rem' }}
            >
              Member & Staff Sign In
            </Link>
            <a
              href="#contact"
              className="btn btn-outline"
              style={{ padding: '0.8rem 1.75rem', fontSize: '1.02rem' }}
            >
              Visit Front Desk
            </a>
          </div>

          {/* Facility Highlights Banner */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)', maxWidth: '820px', margin: '0 auto 3rem auto' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0 }}>
              📍 <strong>Offline Registration Note:</strong> Member accounts and subscriptions are registered in-person at our front desk reception. Once registered, credentials are sent to your email to access your personal member portal.
            </p>
          </div>

          {/* Quick Facility Pillars */}
          <div className="grid-4" style={{ textAlign: 'left' }}>
            <div className="card" style={{ marginBottom: 0, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                🏋️ Heavy Resistance Floor
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Olympic platforms, bumper plates, power cages, and calibrated dumbbells up to 50kg.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                🏃 Functional & Cardio Turf
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Curved treadmills, Concept2 rowing ergs, assault bikes, and a 25m indoor sled track.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                🎯 Certified Instructors
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Expert personal trainers on the floor to design custom splits, improve biomechanics, and track goals.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 0, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                📋 Front Desk Support
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Walk-in registrations, rapid check-ins, membership renewals, and billing assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gym Services & Facilities Section */}
      <section id="services" style={{ padding: '4rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <span className="badge badge-green mb-1">Facility Overview</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Our Gym Facilities & Training Zones
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '1rem', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
              Engineered for athletic performance, functional movement, and sustainable wellbeing
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div className="badge badge-green mb-1">Strength Zone</div>
              <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Strength & Conditioning</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Full suite of calibrated bumper plates, power racks, kettlebells, and heavy dumbbells. Maintained daily to rigorous safety and cleanliness standards.
              </p>
            </div>

            <div className="card">
              <div className="badge badge-blue mb-1">Personalized Coaching</div>
              <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Personal Training</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                One-on-one sessions with certified fitness coaches providing movement screening, posture correction, personalized routines, and progressive overload tracking.
              </p>
            </div>

            <div className="card">
              <div className="badge badge-green mb-1">Endurance & Agility</div>
              <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Cardio & Functional Turf</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                High-performance curved treadmills, Concept2 rowers, ski ergs, and an indoor synthetic turf strip for sled pushes, plyometrics, and agility conditioning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours & Facility Access */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '880px', margin: '0 auto', padding: '2.25rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span className="badge badge-green mb-1">Facility Schedule</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                FitStudio Operating Hours & Access
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
                Open 7 days a week with certified fitness staff and front desk reception on duty
              </p>
            </div>

            <div className="grid-3" style={{ textAlign: 'center' }}>
              <div style={{ padding: '1rem', borderRight: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                  Monday – Friday
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  5:30 AM – 10:30 PM
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  Full Facility & Trainer Floor Duty
                </div>
              </div>

              <div style={{ padding: '1rem', borderRight: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                  Saturday
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  6:00 AM – 9:30 PM
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  Group Classes & Open Gym Floor
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                  Sunday
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  7:00 AM – 8:00 PM
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  Open Gym & Recovery Suite
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '4rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-green mb-1">Get in Touch</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Contact FitStudio Front Desk
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.98rem' }}>
              Reach out for facility tours, member registrations, or training consultations
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📍</div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Facility Address</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                101 Fitness Boulevard, Bandra West<br />
                Mumbai, Maharashtra 400050
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📞</div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Front Desk Phone</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                <a href={gymTelHref} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  {gymPhone}
                </a><br />
                Mon – Sun: 6:00 AM – 10:00 PM
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✉️</div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Email Inquiries</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                contact@fitstudio-gym.com<br />
                support@fitstudio.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '2.25rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1.75rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
            <a href="#services" style={{ color: 'var(--color-text-muted)' }}>Facilities</a>
            <a href="#contact" style={{ color: 'var(--color-text-muted)' }}>Contact & Hours</a>
            <Link to="/login" style={{ color: 'var(--color-text-muted)' }}>Sign In</Link>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            &copy; 2026 FitStudio — Gym & Fitness Studio Management System. All rights reserved. Offline registration conducted at front desk.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
