import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function LoginPage() {
  const { login, setCurrentUser } = useAuth(); // Context-based login function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const navigate = useNavigate();

  // ✅ Login function with session + role management
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 🔹 Example backend call
      const res = await API.post('/auth/login', { email: email.trim(), password });

      // The backend should return: { user, token, role }
      const { user, token, role } = res.data;

      // ✅ Add session expiration (1 hour)
      const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour in ms

      // ✅ Store in localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ user, token, role, expiryTime }));

      // ✅ Update context (AuthProvider)
      setCurrentUser(user);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async () => {
    setForgotSubmitting(true);
    setError(null);
    try {
      await API.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        }}
      >
        <h3 className="text-center mb-4" style={{ color: '#d81b60' }}>
          Welcome Back
        </h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 mb-2"
            style={{
              backgroundColor: '#d81b60',
              borderColor: '#d81b60',
              borderRadius: '8px',
            }}
          >
            Login
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setShowForgotModal(true)}
              style={{ padding: 0, fontSize: '0.9rem' }}
            >
              Forgot your password?
            </Button>
          </div>

          <div className="text-center mt-3">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </Form>
      </Card>

      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forgotSuccess ? (
            <Alert variant="success">
              If an account exists for {forgotEmail}, you’ll receive a password reset link.
            </Alert>
          ) : (
            <>
              <p>Enter your email address and we’ll send you a reset link.</p>
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!forgotSuccess ? (
            <>
              <Button variant="secondary" onClick={() => setShowForgotModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleForgotPassword}
                disabled={!forgotEmail || forgotSubmitting}
              >
                {forgotSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setShowForgotModal(false)}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
