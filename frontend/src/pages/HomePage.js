// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// --- NO IMPORT IS NEEDED ---
// (Remove the 'import sakuraGif...' line if you added it)

export default function HomePage() {
  const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    const gifSetting = localStorage.getItem('showGifBg');
    setShowGif(gifSetting !== 'false');
  }, []);

  return (
    <>
      {/* 🌸 Sakura GIF Background */}
      {showGif && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            
            // --- THIS IS THE CORRECT PATH ---
            // It points directly to your 'public' folder root.
            backgroundImage: "url('/sakura-5470_256.gif')",
            
            backgroundRepeat: 'repeat',
            backgroundSize: '300px',
            pointerEvents: 'none',
            zIndex: -2,
            animation: 'fallPetals 14s linear infinite',
          }}
        />
      )}

      {/* 🌸 Optional overlay for readability */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.3)',
          zIndex: -1,
        }}
      />

      <style>
        {`
          @keyframes fallPetals {
            from { background-position: 0 -200px; }
            to { background-position: 0 600px; }
          }
        `}
      </style>

      {/* 🌸 Main Content */}
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight: '100vh',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          padding: '0 1.5rem',
        }}
      >
        <Card
          className="p-4 shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '20px',
            maxWidth: '700px',
            border: '1px solid #f48fb1',
          }}
        >
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#d81b60' }}>
            Welcome to MoodBot Café
          </h1>

          <p className="lead mb-4" style={{ color: '#d81b60' }}>
            A peaceful space to reflect, journal, and connect with your emotions.  
            Be kind to yourself today. 🌸
          </p>

          <div className="d-flex gap-3 flex-wrap justify-content-center">
            <Button as={Link} to="/login" variant="outline-pink" size="lg">
              Log In
            </Button>
            <Button as={Link} to="/signup" variant="pink" size="lg">
              Sign Up
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
}