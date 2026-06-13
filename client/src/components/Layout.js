import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedBanner from './AnimatedBanner';
import { AuthContext } from '../context/AuthContext';

function Layout({ children }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const getLinkClass = (path) => {
    return location.pathname === path ? 'sidebar-btn active' : 'sidebar-btn';
  };

  return (
    <div className="app-layout">
      <header className="app-header slide-down">
        <Link to="/" className="brand">
          <img src="/NoteWise-logo.png" alt="NoteWise logo" className="logo" />
          <div>
            <h1 className="brand-title">NoteWise</h1>
            <p className="nav-subtitle">Secure Notes & Management</p>
          </div>
        </Link>
      </header>

      {/* <AnimatedBanner message="Welcome to NoteWise 🚀" /> */}

      <div className="app-body">
        {user && (
          <aside className="sidebar slide-in-left">
            <h3>Navigation</h3>
            <ul>
              <li>
                <Link to="/notes" className={getLinkClass('/notes')}>
                  📁 Notes Directory
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                  👤 User Manager
                </Link>
              </li>
            </ul>
          </aside>
        )}
        <main className="main-content fade-in">
          {children}
        </main>
      </div>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} NoteWise. All rights reserved. Created by Zaryab Ahmed Khan</p>
      </footer>



      <div className="bubble-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bubble" />
        ))}
      </div>
      <div className="star-container">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="star" />
        ))}
      </div>
    </div>
  );
}

export default Layout;
