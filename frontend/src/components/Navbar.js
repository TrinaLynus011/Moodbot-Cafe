  
import React, { useContext } from 'react';
import { Navbar as BSNav, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  return (
    <BSNav bg="light" expand="lg" className="mb-4 shadow-sm" style={{ background: 'linear-gradient(90deg,#f8f1ff,#f0fbff)' }}>
      <Container>
        <BSNav.Brand as={Link} to="/">MoodBot Café</BSNav.Brand>
        <BSNav.Toggle />
        <BSNav.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/journal">Journal</Nav.Link>
            <Nav.Link as={Link} to="/wall">Wall</Nav.Link>
            {user?.role === 'admin' && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
          </Nav>
          <Nav>
            {!user ? <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Button as={Link} to="/signup" variant="outline-primary" size="sm">Sign up</Button>
            </> : <>
              <span className="me-2">Hi, {user.name}</span>
              <Button variant="outline-danger" size="sm" onClick={() => { logout(); nav('/'); }}>Logout</Button>
            </>}
          </Nav>
        </BSNav.Collapse>
      </Container>
    </BSNav>
  );
}
