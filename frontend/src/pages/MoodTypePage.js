// src/pages/MoodTypePage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Personality archetypes (emotional wellness focused)
const PERSONALITY_TYPES = [
  { id: 'INFP', name: 'The Empath', emoji: '🕊️', color: '#A5D6A7', desc: 'Compassionate, idealistic, and deeply in tune with emotions.' },
  { id: 'ENFJ', name: 'The Guide', emoji: '🌟', color: '#FFE082', desc: 'Warm, charismatic, and driven to help others grow.' },
  { id: 'INTJ', name: 'The Strategist', emoji: '🧠', color: '#90CAF9', desc: 'Analytical, visionary, and quietly determined.' },
  { id: 'ISFP', name: 'The Artist', emoji: '🎨', color: '#F48FB1', desc: 'Gentle, creative, and lives in the moment.' },
  { id: 'ENTP', name: 'The Innovator', emoji: '💡', color: '#CE93D8', desc: 'Curious, energetic, and loves exploring ideas.' },
  { id: 'ISTJ', name: 'The Guardian', emoji: '🛡️', color: '#B39DDB', desc: 'Reliable, practical, and values stability.' },
  { id: 'ESFP', name: 'The Spark', emoji: '✨', color: '#FFCC80', desc: 'Joyful, spontaneous, and brings light to others.' },
  { id: 'INFJ', name: 'The Healer', emoji: '🌿', color: '#81C784', desc: 'Insightful, nurturing, and seeks deep meaning.' },
];

export default function MoodTypePage() {
  const { currentUser } = useAuth();
  const userName = currentUser?.name || 'Friend';

  const [currentResult, setCurrentResult] = useState(null);
  const [canRetake, setCanRetake] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showReminder, setShowReminder] = useState(false);

  // Check saved result on mount
  useEffect(() => {
    const saved = localStorage.getItem('moodTypeResult');
    if (saved) {
      try {
        const { result, timestamp } = JSON.parse(saved);
        const now = new Date();
        const then = new Date(timestamp);
        const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

        if (diffDays < 15) {
          setCanRetake(false);
          setDaysLeft(15 - diffDays);
          setCurrentResult(result);
          setShowReminder(true);
        } else {
          setCanRetake(true);
          setShowReminder(true); // Show "You can retake now!" banner
        }
      } catch (e) {
        console.warn("Failed to parse MoodType result");
      }
    }
  }, []);

  const takeTest = () => {
    const randomType = PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
    const result = {
      ...randomType,
      date: new Date().toISOString().split('T')[0]
    };

    const payload = {
      result,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('moodTypeResult', JSON.stringify(payload));
    setCurrentResult(result);
    setCanRetake(false);
    setDaysLeft(15);
    setShowReminder(true);
  };

  const personality = currentResult || PERSONALITY_TYPES[0];

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      paddingTop: '2rem',
      backgroundImage: `url('/sakura-5470_256.gif')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(6px)',
        background: 'rgba(255, 255, 255, 0.4)'
      }} />

      <Container style={{ position: 'relative', zIndex: 2 }}>
<h2 className="text-center mb-3" style={{ color: '#d81b60', fontWeight: 700 }}>
  🌸 MoodType Insights, {userName}!
</h2>
        <p className="text-center text-muted mb-4">
          Discover your emotional archetype — your inner compass for wellness.
        </p>

        {/* Reminder Banner */}
        {showReminder && (
          <Row className="mb-4">
            <Col md={8} className="mx-auto">
              <Alert
                variant={canRetake ? 'success' : 'info'}
                className="text-center shadow-sm"
                style={{ borderRadius: '16px' }}
              >
                {canRetake ? (
                  <>
                    🎉 <strong>It’s time!</strong> Retake your MoodType reflection to track your growth.
                  </>
                ) : (
                  <>
                    🕰️ You took this test recently. Come back in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong> for your next insight.
                  </>
                )}
              </Alert>
            </Col>
          </Row>
        )}

        {currentResult && !canRetake ? (
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="p-4 shadow-lg text-center" style={{
                borderRadius: '18px',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #f8bbd0'
              }}>
                <div className="fs-1 mb-2">{personality.emoji}</div>
                <h3 className="mb-2" style={{ color: '#d81b60' }}>
                  {personality.id} — {personality.name}
                </h3>
                <p className="lead">{personality.desc}</p>
                <div className="mt-3">
                  <Badge bg="pink" style={{ backgroundColor: personality.color, color: 'white' }}>
                    📅 Taken on: {personality.date}
                  </Badge>
                </div>
                {!canRetake && (
                  <Button
                    disabled
                    className="mt-3 py-2 px-4"
                    style={{ background: '#e0e0e0', color: '#757575', border: 'none' }}
                  >
                    Retake in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                  </Button>
                )}
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center">
            <Col md={7}>
              <Card className="p-4 shadow-lg text-center" style={{
                borderRadius: '18px',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #f8bbd0'
              }}>
                <h4 className="mb-3" style={{ color: '#d81b60' }}>✨ Ready to Discover Your MoodType?</h4>
                <p>
                  This gentle reflection helps you understand your emotional patterns.  
                  Your result is saved privately, and you’ll be reminded to revisit it every <strong>15 days</strong>.
                </p>
                <Button
                  onClick={takeTest}
                  disabled={!canRetake}
                  className="py-2 px-4 fw-bold mt-3"
                  style={{
                    borderRadius: '12px',
                    background: canRetake ? '#d81b60' : '#e0e0e0',
                    border: 'none',
                    color: canRetake ? 'white' : '#757575'
                  }}
                >
                  {canRetake ? 'Begin Reflection →' : 'Retake Later'}
                </Button>
              </Card>
            </Col>
          </Row>
        )}

        {/* Info Section */}
        <Row className="mt-5">
          <Col md={10} className="mx-auto">
            <Card className="p-4" style={{
              borderRadius: '16px',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,248,225,0.7)',
              border: '1px solid #ffe0b2'
            }}>
              <h5 className="text-center mb-3" style={{ color: '#d81b60' }}>💡 Why Every 15 Days?</h5>
              <ul className="text-start">
                <li>Emotions shift with seasons, stress, and self-care</li>
                <li>Regular reflection builds emotional intelligence</li>
                <li>Track your journey like a mindfulness habit</li>
              </ul>
              <div className="text-center mt-2">
                <small className="text-muted">All data is stored only on your device. No emails. No tracking.</small>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}