import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar Component
 * Main header navigation for FitStudio.
 * Includes logo/branding, public links, and direct access to Login & Registration.
 */
function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Fit<span>Studio</span>
        </Link>
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              {isHome ? (
                <a href="#services" className="nav-link">Facilities</a>
              ) : (
                <Link to="/#services" className="nav-link">Facilities</Link>
              )}
            </li>
            <li>
              {isHome ? (
                <a href="#contact" className="nav-link">Contact</a>
              ) : (
                <Link to="/#contact" className="nav-link">Contact</Link>
              )}
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
