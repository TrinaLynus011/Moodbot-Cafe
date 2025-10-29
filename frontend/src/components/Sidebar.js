// src/components/Sidebar.js
import React from 'react';
import { Container, Badge, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏡' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/journal', label: 'Journal', icon: '📖' },
    { path: '/moodtype', label: 'MoodType', icon: '🧠' },
    { path: '/wall', label: 'Wall', icon: '💬' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    ...(currentUser?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: '🔒' }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div
      className={`position-fixed top-0 start-0 h-100`}
      style={{
        width: '250px',
        zIndex: 9998,
        backgroundColor: '#fdf2f8',
        borderRight: '1px solid #f48fb1',
        boxShadow: '4px 0 12px rgba(255, 182, 193, 0.25)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-260px)',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem 0.5rem',
      }}
    >
      {/* --- TOP LOGO --- */}
      <div className="px-3 d-flex align-items-center justify-content-start mb-4">
        <div
          className="d-flex align-items-center"
          style={{
            background: '#fff0f6',
            padding: '8px 12px',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(255, 192, 203, 0.4)',
          }}
        >
          <span style={{ fontSize: '1.6rem', color: '#d81b60' }}>🌸</span>
          <h4
            className="ms-2 mb-0"
            style={{ color: '#d81b60', fontWeight: '600', fontSize: '1.1rem', whiteSpace: 'nowrap' }}
          >
            MoodBot Café
          </h4>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-grow-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className="d-flex align-items-center mb-2 text-decoration-none"
            style={{
              fontSize: '1rem',
              fontWeight: '500',
              color: location.pathname === item.path ? '#d81b60' : '#5a5a5a',
              backgroundColor: location.pathname === item.path ? '#f8bbd0' : 'transparent',
              borderRadius: '10px',
              padding: '10px 12px',
              gap: '10px',
              transition: 'all 0.25s ease',
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* --- USER SECTION --- */}
      <div
        className="text-center border-top pt-3 mt-3 px-2"
        style={{ fontSize: '0.9rem', lineHeight: '1.4' }}
      >
        {currentUser ? (
          <>
            <small className="text-muted d-block">Signed in as</small>
            <div className="fw-bold mb-2" style={{ color: '#d81b60' }}>
              {currentUser.name}
            </div>
            <Button
              variant="outline-pink"
              size="sm"
              onClick={handleLogout}
              style={{
                borderColor: '#d81b60',
                color: '#d81b60',
                borderRadius: '20px',
                padding: '4px 12px',
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <div className="d-flex gap-2 justify-content-center">
            <Button as={Link} to="/login" size="sm" style={{ color: '#d81b60', borderColor: '#d81b60' }} variant="outline-light">
              Sign In
            </Button>
            <Button as={Link} to="/signup" size="sm" style={{ backgroundColor: '#d81b60', color: 'white' }}>
              Sign Up
            </Button>
          </div>
        )}

        <div className="mt-3">
          <Badge bg="pink" style={{ backgroundColor: '#f48fb1', color: 'white' }}>
            🌸 Streak: 7 days
          </Badge>
          <Badge bg="success" className="ms-1">🏆 Week Warrior</Badge>
        </div>
      </div>
    </div>
  );
}
