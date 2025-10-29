// src/pages/JournalPage.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function JournalPage() {
  const { currentUser } = useAuth();
  const defaultUserName = currentUser?.name || 'Friend';

  // State
  const [diaryName, setDiaryName] = useState('');
  const [entry, setEntry] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState([]);

  // Mood options
  const MOODS = [
    { id: 'happy', emoji: '😊', color: '#FFD700' },
    { id: 'calm', emoji: '😌', color: '#81C784' },
    { id: 'neutral', emoji: '😐', color: '#BDBDBD' },
    { id: 'sad', emoji: '😔', color: '#64B5F6' },
    { id: 'anxious', emoji: '😰', color: '#FF8A65' },
    { id: 'loved', emoji: '❤️', color: '#E91E63' },
    { id: 'sleepy', emoji: '😴', color: '#9575CD' },
  ];

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load diary name from user
        if (currentUser?.journalName) {
          setDiaryName(currentUser.journalName);
        } else {
          // Prompt for name and save to DB
          const name = prompt("✨ What would you like to name your diary?", "My Secret Garden");
          const finalName = name?.trim() || "My Journal";
          setDiaryName(finalName);
          await API.put('/auth/update', { journalName: finalName });
        }

        // Load entries from DB
        const res = await API.get('/journal');
        setEntries(res.data);
      } catch (err) {
        console.error('Failed to load journal data:', err);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const saveEntry = async () => {
    if (!entry.trim()) {
      alert("Please write something before saving!");
      return;
    }

    try {
      const res = await API.post('/journal', {
        text: entry,
        gratitude: gratitude || null,
        mood: selectedMood?.id || null,
        date: new Date().toISOString().split("T")[0]
      });
      setEntries([res.data, ...entries]);

      // Clear form
      setEntry('');
      setGratitude('');
      setSelectedMood(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save entry:', err);
    }
  };

  const downloadEntry = () => {
    if (!entry.trim()) return;
    const content = `
Dear ${defaultUserName},

${entry}

I'm grateful for:
${gratitude || '—'}

Mood: ${selectedMood?.emoji || '—'}
Diary: ${diaryName}

Date: ${new Date().toLocaleDateString()}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal_entry_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearEntry = () => {
    if (window.confirm('Clear current entry? (Past entries are safe)')) {
      setEntry('');
      setGratitude('');
      setSelectedMood(null);
    }
  };

  const startBreathing = () => {
    alert("Breathe in... hold... breathe out... 🧘‍♀️\nRepeat 3 times.");
  };

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
          📖 {diaryName}
        </h2>
        <p className="text-center text-muted mb-4">
          Dear {defaultUserName}, your private space for reflection
        </p>

        {/* Mood Selector */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          {MOODS.map(mood => (
            <div
              key={mood.id}
              onClick={() => setSelectedMood(mood)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: selectedMood?.id === mood.id ? mood.color : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'transform .2s, box-shadow .2s',
                boxShadow: selectedMood?.id === mood.id ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
                transform: selectedMood?.id === mood.id ? 'scale(1.2)' : 'scale(1)'
              }}
            >
              {mood.emoji}
            </div>
          ))}
          <div className="ms-auto" style={{ fontSize: '0.9rem', color: '#5a5a5a' }}>
            Mood: {selectedMood?.emoji || '—'}
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-white p-3 rounded shadow-sm mb-4" style={{ border: '1px solid #f8bbd0' }}>
          <div className="d-flex align-items-center gap-2">
            <span>🖋️</span>
            <span>What emotions are present for you right now?</span>
          </div>
        </div>

        {/* Journal Editor */}
        <Card className="mb-4" style={{
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid #f8bbd0'
        }}>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder={`Write in ${diaryName}...`}
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="border-0"
            style={{ resize: 'none', fontSize: '1.1rem' }}
          />
        </Card>

        {/* Gratitude */}
        <Form.Control
          type="text"
          placeholder="I'm grateful for..."
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          className="rounded-pill mb-4"
          style={{ borderColor: '#f48fb1', padding: '0.75rem 1rem' }}
        />

        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">
          <Button onClick={saveEntry} className="py-2 px-3 fw-bold" style={{ background: '#d81b60', border: 'none' }}>
            {saved ? '✅ Saved!' : 'Save Entry'}
          </Button>
          <Button onClick={downloadEntry} variant="outline-pink" size="sm" className="py-2 px-3">📥 Download</Button>
          <Button onClick={clearEntry} variant="outline-pink" size="sm" className="py-2 px-3">🧹 Clear</Button>
          <Button onClick={startBreathing} variant="outline-pink" size="sm" className="py-2 px-3">🧘‍♀️ Breathing</Button>
        </div>

        {/* Past Entries */}
        <Card className="p-3" style={{
          borderRadius: '16px',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255,248,225,0.7)',
          border: '1px solid #ffe0b2'
        }}>
          <h5 className="text-center mb-3" style={{ color: '#d81b60' }}>📜 Your Past Entries</h5>
          {entries.length === 0 ? (
            <Alert variant="light" className="text-center">
              No entries yet. Start writing! 🌸
            </Alert>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {entries.map((e) => {
                const moodObj = MOODS.find(m => m.id === e.mood);
                return (
                  <Card key={e._id} className="mb-2 p-2" style={{ background: 'rgba(255,255,255,0.6)' }}>
                    <div className="d-flex justify-content-between">
                      <strong>{moodObj?.emoji || '—'}</strong>
                      <small>{new Date(e.date).toLocaleDateString()}</small>
                    </div>
                    <div className="mt-1" style={{ fontSize: '0.9rem' }}>{e.text.substring(0, 80)}{e.text.length > 80 ? '...' : ''}</div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}