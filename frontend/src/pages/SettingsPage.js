// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const DEFAULT_SETTINGS = {
  theme: 'sakura',
  showGifBg: true,
  notifications: true,
  streakGoal: 7,
  autoSaveJournal: true,
  showMoodTypeReminder: true,
};



export default function SettingsPage() {
  const { currentUser, updateUser } = useAuth(); // ✅ keep only this one

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    journalName: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const navigate = useNavigate();

  // Load app settings from localStorage
  useEffect(() => {
    const saved = {};
    for (const key in DEFAULT_SETTINGS) {
      const stored = localStorage.getItem(`appSetting_${key}`);
      if (stored !== null) {
        saved[key] = key === 'streakGoal' 
          ? parseInt(stored, 10) 
          : stored === 'true';
      } else {
        saved[key] = DEFAULT_SETTINGS[key];
      }
    }
    setSettings(saved);
  }, []);

  // Load user profile and settings
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const response = await API.get('/auth/me');
          const userData = response.data.user;
          setProfile({
            id: userData.id || '',
            name: userData.name || '',
            email: userData.email || '',
            journalName: userData.journalName || '',
          });
          // Load settings from backend if available
          if (userData.settings) {
            setSettings(userData.settings);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Fallback to currentUser
          setProfile({
            id: currentUser.id || '',
            name: currentUser.name || '',
            email: currentUser.email || '',
            journalName: currentUser.journalName || '',
          });
        }
      } else {
        navigate('/register');
      }
    };
    fetchUserData();
  }, [currentUser, navigate]);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await handleSaveSettings();
      // Also save to localStorage as backup
      for (const key in settings) {
        localStorage.setItem(`appSetting_${key}`, String(settings[key]));
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default? This cannot be undone.')) {
      for (const key in DEFAULT_SETTINGS) {
        localStorage.removeItem(`appSetting_${key}`);
      }
      setSettings({ ...DEFAULT_SETTINGS });
      setShowResetAlert(true);
      setTimeout(() => setShowResetAlert(false), 2000);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await API.put('/auth/update', profile);
      // Update the AuthContext with the new user data
      updateUser(response.data.user);
      setEditMode(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await API.put('/auth/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? All data will be lost.')) {
      localStorage.removeItem('currentUser');
      for (const key in DEFAULT_SETTINGS) {
        localStorage.removeItem(`appSetting_${key}`);
      }
      navigate('/register');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: settings.showGifBg ? `url('/sakura-5470_256.gif')` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Frosted overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.88), rgba(255,255,255,0.75))',
        backdropFilter: 'blur(6px)',
        zIndex: 1,
      }} />

      <Container 
        fluid 
        className="py-4 px-3" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          position: 'relative', 
          zIndex: 2,
          paddingTop: '2rem'
        }}
      >
        <h2 className="mb-4" style={{ color: '#5a5a5a', fontWeight: 600, fontSize: '1.75rem' }}>
          App Settings
        </h2>

        {saved && (
          <Alert variant="success" className="mb-4 d-flex align-items-center" style={{ borderRadius: '8px' }}>
            <i className="bi bi-check-circle-fill me-2"></i> Settings saved successfully.
          </Alert>
        )}

        {showResetAlert && (
          <Alert variant="info" className="mb-4 d-flex align-items-center" style={{ borderRadius: '8px' }}>
            <i className="bi bi-arrow-clockwise me-2"></i> All settings reset to default.
          </Alert>
        )}

        <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Card.Body style={{ padding: '1.75rem' }}>

            {/* === PROFILE SECTION === */}
            <h5 className="mb-3" style={{ color: '#d81b60', fontWeight: 600, fontSize: '1.25rem' }}>
              🌸 Your Profile
            </h5>
            {profileSaved && (
              <Alert variant="success" className="mb-3 d-flex align-items-center" style={{ borderRadius: '8px' }}>
                <i className="bi bi-check-circle-fill me-2"></i> Profile updated successfully!
              </Alert>
            )}
            <Card 
              className="mb-4 border-0 shadow-sm" 
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.92)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem'
              }}
            >
              {editMode ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#5a5a5a' }}>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      style={{
                        borderColor: '#f48fb1',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(244, 143, 177, 0.2)'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#5a5a5a' }}>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      placeholder="you@example.com"
                      style={{
                        borderColor: '#90caf9',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(144, 202, 249, 0.2)'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold" style={{ color: '#5a5a5a' }}>Journal Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={profile.journalName}
                      onChange={(e) => handleProfileChange('journalName', e.target.value)}
                      placeholder="My Journal"
                      style={{
                        borderColor: '#e0e0e0',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(224, 224, 224, 0.2)'
                      }}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveProfile}
                      style={{
                        backgroundColor: '#d81b60',
                        borderColor: '#d81b60',
                        borderRadius: '10px',
                        fontWeight: '500',
                        padding: '0.5rem 1.2rem'
                      }}
                    >
                      ✅ Save Changes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => setEditMode(false)}
                      style={{
                        borderRadius: '10px',
                        fontWeight: '500',
                        padding: '0.5rem 1.2rem'
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <p className="mb-1" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#5a5a5a' }}>
                        👤 <span style={{ color: '#d81b60' }}>Name:</span> {profile.name || '—'}
                      </p>
                      <p className="mb-1" style={{ fontSize: '1rem', color: '#5a5a5a' }}>
                        📧 <span style={{ color: '#d81b60' }}>Email:</span> {profile.email || '—'}
                      </p>
                      <p className="mb-1" style={{ fontSize: '1rem', color: '#5a5a5a' }}>
                        📓 <span style={{ color: '#d81b60' }}>Journal:</span> {profile.journalName || 'My Journal'}
                      </p>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => setEditMode(true)}
                        style={{
                          borderRadius: '10px',
                          fontWeight: '500',
                          padding: '0.4rem 0.9rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        ✏️ Edit Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={handleDeleteAccount}
                        style={{
                          borderRadius: '10px',
                          fontWeight: '500',
                          padding: '0.4rem 0.9rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        🗑️ Delete Account
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* === APPEARANCE === */}
            <h5 className="mb-3 mt-4" style={{ color: '#d81b60', fontWeight: 600, fontSize: '1.25rem' }}>
              🎨 Appearance
            </h5>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Theme</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {[
                  { id: 'sakura', name: 'Sakura', color: '#f48fb1' },
                  { id: 'calm', name: 'Calm', color: '#90caf9' },
                  { id: 'neutral', name: 'Neutral', color: '#e0e0e0' },
                ].map(theme => (
                  <Button
                    key={theme.id}
                    size="sm"
                    variant={settings.theme === theme.id ? 'primary' : 'outline-secondary'}
                    onClick={() => handleChange('theme', theme.id)}
                    style={{
                      backgroundColor: settings.theme === theme.id ? theme.color : 'transparent',
                      borderColor: settings.theme === theme.id ? theme.color : '#ddd',
                      color: settings.theme === theme.id ? 'white' : '#555',
                      fontWeight: 'normal',
                      borderRadius: '8px',
                      minWidth: '80px'
                    }}
                  >
                    {theme.name}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Check
              type="switch"
              id="showGifBg"
              label="Show animated sakura background"
              checked={settings.showGifBg}
              onChange={(e) => handleChange('showGifBg', e.target.checked)}
              className="mb-4"
              style={{ fontSize: '0.95rem' }}
            />

            {/* === NOTIFICATIONS === */}
            <h5 className="mb-3 mt-4" style={{ color: '#d81b60', fontWeight: 600, fontSize: '1.25rem' }}>
              🔔 Notifications
            </h5>
            <Form.Check
              type="switch"
              id="notifications"
              label="Enable daily mood reminders"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              className="mb-3"
            />
            <Form.Check
              type="switch"
              id="showMoodTypeReminder"
              label="Remind me to retake MoodType every 15 days"
              checked={settings.showMoodTypeReminder}
              onChange={(e) => handleChange('showMoodTypeReminder', e.target.checked)}
              className="mb-4"
            />

            {/* === JOURNAL === */}
            <h5 className="mb-3 mt-4" style={{ color: '#d81b60', fontWeight: 600, fontSize: '1.25rem' }}>
              📓 Journal
            </h5>
            <Form.Check
              type="switch"
              id="autoSaveJournal"
              label="Auto-save journal entries"
              checked={settings.autoSaveJournal}
              onChange={(e) => handleChange('autoSaveJournal', e.target.checked)}
              className="mb-4"
            />

            {/* === WELLNESS GOALS === */}
            <h5 className="mb-3 mt-4" style={{ color: '#d81b60', fontWeight: 600, fontSize: '1.25rem' }}>
              🌱 Wellness Goals
            </h5>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">
                Weekly streak goal: <strong>{settings.streakGoal} days</strong>
              </Form.Label>
              <Form.Range
                min="1"
                max="7"
                value={settings.streakGoal}
                onChange={(e) => handleChange('streakGoal', parseInt(e.target.value))}
              />
            </Form.Group>

            {/* === ACTIONS === */}
            <div className="d-flex justify-content-between mt-5 pt-3 border-top border-secondary">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleReset}
                style={{ borderRadius: '8px', fontWeight: '500' }}
              >
                Reset to Defaults
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                style={{ 
                  backgroundColor: '#d81b60', 
                  borderColor: '#d81b60',
                  borderRadius: '8px',
                  fontWeight: '500',
                  padding: '0.4rem 1.2rem'
                }}
              >
                Save Changes
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}