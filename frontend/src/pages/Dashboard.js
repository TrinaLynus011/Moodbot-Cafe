import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const MOODS = [
  { id: "happy", emoji: "😊", color: "#F7D96F", label: "Happy" },
  { id: "calm", emoji: "😌", color: "#A7D8C9", label: "Calm" },
  { id: "neutral", emoji: "😐", color: "#CFCFCF", label: "Neutral" },
  { id: "sad", emoji: "😔", color: "#9DC4F0", label: "Sad" },
  { id: "anxious", emoji: "😰", color: "#F3A9A0", label: "Anxious" },
];

const SAYINGS = [
  "Even the softest petals return in spring — and so will you. 🌸",
  "Hey, you’re doing your best. I’m really proud of you. 💗",
  "You are here. You are safe. Breathe. 🌿"
];

const AFFIRMATIONS = [
  "Your feelings are valid. You are not alone. 💞",
  "You deserve peace, joy, and patience with yourself. 🌷",
  "Small steps count. Every bit of effort matters. 🌱",
  "Be gentle with yourself — you're trying, and that's enough. 🤍"
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [todayMood, setTodayMood] = useState("calm");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [saved, setSaved] = useState(false);
  const [sayingIndex, setSayingIndex] = useState(0);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get('/notes');
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }
    };
    if (currentUser) fetchNotes();
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSayingIndex((i) => (i + 1) % SAYINGS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const saveMood = async () => {
    try {
      const res = await API.post('/notes', { mood: todayMood, note, date: new Date().toISOString().split("T")[0] });
      setNotes([res.data, ...notes]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setNote("");
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const affirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/sakura-5470_256.gif')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative"
    }}>
      {/* Overlay gradient */}
      <div style={{
        position: "fixed",  // changed from absolute to fixed
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.3), rgba(255,255,255,0))",
        zIndex: 1
      }} />

      {/* Scrollable content */}
      <Container style={{ paddingTop: "3rem", position: "relative", zIndex: 2 }}>
        <h2 className="text-center mb-2" style={{ color: "#B33B83", fontWeight: 700 }}>
          Welcome back, <span style={{ fontStyle: "italic" }}>{currentUser?.name}</span> 🌿
        </h2>

        <p className="text-center mb-4" style={{ color: "#6A1B5D", fontSize: "1.15rem" }}>
          {SAYINGS[sayingIndex]}
        </p>

        <Card className="p-3 mb-4 text-center shadow-sm" style={{
          borderRadius: 18, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)"
        }}>
          <strong style={{ color: "#C95FA3" }}>{affirmation}</strong>
        </Card>

        <Row className="g-4 justify-content-center">

          {/* Left — Mood Input */}
          <Col md={5}>
            <Card className="p-4 shadow-lg" style={{
              borderRadius: 20, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(10px)"
            }}>
              <h5 className="text-center mb-3" style={{ color: "#B33B83" }}>How are you feeling?</h5>

              <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                {MOODS.map(m => (
                  <div key={m.id}
                    onClick={() => setTodayMood(m.id)}
                    style={{
                      width: 70, height: 70, borderRadius: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: "1.9rem", background: m.color,
                      transform: todayMood === m.id ? "scale(1.12)" : "scale(1)",
                      transition: ".25s"
                    }}>
                    {m.emoji}
                  </div>
                ))}
              </div>

              <Form.Control
                as="textarea" rows={3}
                placeholder="Write your thoughts…"
                className="mb-3" style={{ borderRadius: 14 }}
                value={note} onChange={(e) => setNote(e.target.value)}
              />

              <Button onClick={saveMood} className="w-100"
                style={{ borderRadius: 14, background: "#C95FA3", border: "none" }}>
                {saved ? "✅ Saved!" : "Save Mood"}
              </Button>
            </Card>
          </Col>

          {/* Right — Explore + Recent Notes */}
          <Col md={5}>
            <Card className="p-4 shadow-lg" style={{
              borderRadius: 20, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)"
            }}>
              <h5 className="text-center" style={{ color: "#B33B83" }}>✨ Explore</h5>
              <p className="text-center" style={{ color: "#6A1B5D" }}>
                Grow your emotional garden.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                <Button as={Link} to="/journal"
                  style={{ borderRadius: 16, background: "#E9A8C8", border: "none" }}>
                  Journal
                </Button>
                <Button as={Link} to="/wall"
                  style={{ borderRadius: 16, background: "#B084C9", border: "none" }}>
                  Community Wall
                </Button>
              </div>
            </Card>

            {/* Recent Notes */}
            <Card className="p-4 mt-4 shadow-lg" style={{
              borderRadius: 18, background: "rgba(255,255,255,0.58)", backdropFilter: "blur(8px)",
              maxHeight: "350px", overflowY: "auto"
            }}>
              <h6 className="text-center mb-3" style={{ color: "#B33B83" }}>Recent Notes</h6>
              {notes.length === 0 ?
                <Alert variant="light" className="text-center">No notes yet.</Alert>
                :
                notes.slice(0, 50).map(n => (
                  <div key={n._id} className="p-2 mb-2 rounded shadow-sm"
                    style={{ background: `${MOODS.find(m => m.id === n.mood)?.color}55` }}>
                    <small>{n.date}</small> — {n.emoji} {n.note}
                  </div>
                ))
              }
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
