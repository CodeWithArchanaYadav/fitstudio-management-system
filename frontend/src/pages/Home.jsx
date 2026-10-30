import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

function Home() {
  // Replace the sample contact details, address, and hours with verified gym information.
  const gymPhone = '+91 98765 43210';
  const gymTelHref = 'tel:+919876543210';
  const gymEmail = 'contact@fitstudio-gym.com';

  const managementFeatures = [
    { number: '01', title: 'Member Management', description: 'Keep member profiles and membership information organized in one place.', icon: '♙' },
    { number: '02', title: 'Trainer Management', description: 'Keep trainer details organized and coordinate fitness support.', icon: '✦' },
    { number: '03', title: 'Membership Tracking', description: 'Review membership plans, renewals, and subscription details.', icon: '↻' },
    { number: '04', title: 'Reports & Overview', description: 'Give authorized staff a clear overview of gym activity and records.', icon: '▤' },
  ];

  const facilities = [
    {
      tag: 'STRENGTH ZONE',
      title: 'Strength & Conditioning',
      description: 'Train with free weights, resistance equipment, and space for building strength at your own pace.',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=85',
      alt: 'Strength training equipment in a gym',
    },
    {
      tag: 'PERSONAL COACHING',
      title: 'Personal Training',
      description: 'Get guidance with exercise technique, workout planning, and progress toward your fitness goals.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=85',
      alt: 'Personal trainer coaching a gym member',
    },
    {
      tag: 'CARDIO & ENDURANCE',
      title: 'Cardio & Functional Fitness',
      description: 'Build stamina and mobility with cardio machines and functional movement sessions.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85',
      alt: 'Modern gym floor with cardio and strength equipment',
    },
  ];

  return (
    <div className="fit-home">
      <Navbar />
      <main>
        <section className="fh-hero">
          <div className="fh-hero-copy">
            <span className="fh-kicker"><span className="fh-kicker-dot" /> FITNESS, MADE PERSONAL</span>
            <h1>Make room for your <em>strongest</em> self.</h1>
            <p className="fh-lead">Train with purpose at FitStudio. Explore our facilities, connect with our team, and take the next step toward a stronger, healthier routine.</p>
            <div className="fh-actions">
              <a className="fh-btn fh-btn-primary" href="#facilities">Explore facilities <span aria-hidden="true">↗</span></a>
              <Link className="fh-btn fh-btn-secondary" to="/login">Member & staff sign in</Link>
            </div>
            <p className="fh-note">New here? Membership registration is completed in person at our front desk.</p>
          </div>
          <div className="fh-hero-photo" role="img" aria-label="Modern fitness studio with strength equipment">
            <div className="fh-photo-card"><span>YOUR SPACE TO</span><strong>MOVE BETTER.</strong><strong>FEEL STRONGER.</strong></div>
            <span className="fh-photo-caption">FITSTUDIO · TRAINING FLOOR</span>
          </div>
        </section>

        <section className="fh-trust-row" aria-label="FitStudio highlights">
          <div><span>01</span><strong>Member-first experience</strong></div>
          <div><span>02</span><strong>Expert training support</strong></div>
          <div><span>03</span><strong>Organized gym management</strong></div>
        </section>

        <section className="fh-section fh-management" id="management">
          <div className="fh-section-head">
            <div><span className="fh-overline">THE FITSTUDIO SYSTEM</span><h2>Your gym. <em>Well managed.</em></h2></div>
            <p>Keep the important parts of your fitness studio organized—from member information to everyday operations.</p>
          </div>
          <div className="fh-feature-grid">
            {managementFeatures.map((feature) => (
              <article className="fh-feature-card" key={feature.number}>
                <div className="fh-feature-top"><span>{feature.number}</span><span className="fh-feature-icon" aria-hidden="true">{feature.icon}</span></div>
                <h3>{feature.title}</h3><p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fh-section fh-facilities" id="facilities">
          <div className="fh-section-head">
            <div><span className="fh-overline">FIND YOUR FOCUS</span><h2>Space to move. <em>Room to grow.</em></h2></div>
            <p>Discover training options designed to support strength, endurance, and sustainable progress.</p>
          </div>
          <div className="fh-facility-grid">
            {facilities.map((facility) => (
              <article className="fh-facility-card" key={facility.title}>
                <div className="fh-facility-image-wrap"><img src={facility.image} alt={facility.alt} loading="lazy" /><span className="fh-image-arrow" aria-hidden="true">↗</span></div>
                <div className="fh-facility-body"><span className="fh-overline">{facility.tag}</span><h3>{facility.title}</h3><p>{facility.description}</p><a href="#contact" className="fh-text-link">Ask us about this <span aria-hidden="true">→</span></a></div>
              </article>
            ))}
          </div>
        </section>

        <section className="fh-hours-section" id="hours">
          <div className="fh-hours-intro"><span className="fh-overline">PLAN YOUR VISIT</span><h2>Make time for <em>yourself.</em></h2><p>Visit the front desk for membership registration, renewals, and help getting started.</p><a className="fh-btn fh-btn-primary" href={gymTelHref}>Call the front desk <span aria-hidden="true">↗</span></a></div>
          <div className="fh-hours-card">
            <div className="fh-hours-title"><span className="fh-overline">OPENING HOURS</span><span className="fh-hours-mark" aria-hidden="true">◷</span></div>
            <div className="fh-hours-row"><span>Monday – Friday</span><strong>5:30 AM – 10:30 PM</strong></div>
            <div className="fh-hours-row"><span>Saturday</span><strong>6:00 AM – 9:30 PM</strong></div>
            <div className="fh-hours-row"><span>Sunday</span><strong>7:00 AM – 8:00 PM</strong></div>
            <p className="fh-hours-footnote">Sample hours — please confirm with the gym before publishing.</p>
          </div>
        </section>

        <section className="fh-contact fh-section" id="contact">
          <div className="fh-contact-heading"><span className="fh-overline">LET'S GET STARTED</span><h2>Have a question? <em>Let's talk.</em></h2><p>Reach out for facility tours, member registration, or training consultations.</p></div>
          <div className="fh-contact-grid">
            <article className="fh-contact-card"><span className="fh-contact-icon" aria-hidden="true">⌖</span><span className="fh-overline">COME VISIT</span><h3>Our front desk</h3><p>101 Fitness Boulevard, Bandra West<br />Mumbai, Maharashtra 400050</p><span className="fh-contact-note">Replace with your actual gym address.</span></article>
            <article className="fh-contact-card"><span className="fh-contact-icon" aria-hidden="true">↗</span><span className="fh-overline">GIVE US A CALL</span><h3>Front desk phone</h3><p><a href={gymTelHref}>{gymPhone}</a></p><span className="fh-contact-note">Confirm phone and reception hours.</span></article>
            <article className="fh-contact-card"><span className="fh-contact-icon" aria-hidden="true">✉</span><span className="fh-overline">SEND AN EMAIL</span><h3>General enquiries</h3><p><a href={`mailto:${gymEmail}`}>{gymEmail}</a><br /><a href="mailto:support@fitstudio.com">support@fitstudio.com</a></p><span className="fh-contact-note">Replace with your real email addresses.</span></article>
          </div>
        </section>

        <section className="fh-bottom-cta"><div><span className="fh-overline">YOUR NEXT CHAPTER STARTS HERE</span><h2>Show up for yourself.</h2><p>Visit FitStudio and take the first step toward your fitness goals.</p></div><a className="fh-btn fh-btn-dark" href={gymTelHref}>Contact FitStudio <span aria-hidden="true">↗</span></a></section>
      </main>
      <footer className="fh-footer"><Link to="/" className="fh-footer-brand">FIT<span>STUDIO</span></Link><p>Gym & Fitness Studio Management System</p><div className="fh-footer-links"><a href="#management">Management</a><a href="#facilities">Facilities</a><a href="#hours">Hours</a><a href="#contact">Contact</a><Link to="/login">Sign in</Link></div><small>© {new Date().getFullYear()} FitStudio. All rights reserved.</small></footer>
    </div>
  );
}

export default Home;
