import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navbar Component
 * Simple top navigation header for FitStudio.
 * Includes logo/branding, public links, and direct link to /login.
 */
function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Fit<span>Studio</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <a href="#services" className="nav-link">Services</a>
            </li>
            <li>
              <a href="#contact" className="nav-link">Contact</a>
            </li>
            <li>
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
