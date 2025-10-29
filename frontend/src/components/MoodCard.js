  
import React from 'react';
export default function MoodCard({ mood }) {
  const emojis = { happy: '😊', neutral: '😐', sad: '😔', anxious: '😬', calm: '😌' };
  return (
    <div className="mood-card">
      <div className="mood-emoji">{emojis[mood] || '💭'}</div>
      <div className="mood-text">{mood?.toUpperCase()}</div>
    </div>
  );
}
