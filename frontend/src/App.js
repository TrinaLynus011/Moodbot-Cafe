import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JournalPage from './pages/JournalPage';
import Wall from './pages/Wall';
import MoodTypePage from './pages/MoodTypePage';
import SettingsPage from './pages/SettingsPage';
import ReviewPage from './pages/ReviewPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-outline-pink position-fixed top-0 start-0 m-3"
          style={{
            zIndex: 9999,
            borderColor: '#d81b60',
            color: '#d81b60',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          ☰
        </button>

        <div className="d-flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div
            className="flex-grow-1"
            style={{
              background: 'linear-gradient(135deg, #fdf2f8, #fce4ec)',
              minHeight: '100vh',
              marginLeft: sidebarOpen ? '250px' : '0',
              transition: 'margin-left 0.3s ease',
              padding: '0 1rem',
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
              <Route path="/wall" element={<ProtectedRoute><Wall /></ProtectedRoute>} />
              <Route path="/moodtype" element={<ProtectedRoute><MoodTypePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
