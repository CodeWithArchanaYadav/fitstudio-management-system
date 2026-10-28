import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Fit<span>Studio</span>
        </Link>
        <nav>
          <ul className="nav-links">
            {!isLoggedIn && (
              <>
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><a href="#services" className="nav-link">Services</a></li>
                <li><a href="#contact" className="nav-link">Contact</a></li>
              </>
            )}
            {isLoggedIn ? (
              <>
                {name && (
                  <li>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '0 0.5rem' }}>
                      {name}
                    </span>
                  </li>
                )}
                <li>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
