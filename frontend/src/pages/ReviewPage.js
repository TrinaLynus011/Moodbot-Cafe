import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ReviewPage() {
  const { currentUser } = useAuth();
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', { review, user: currentUser.name });
      setMessage('Thank you for your feedback!');
      setReview('');
    } catch {
      setMessage('Failed to submit review.');
    }
  };

  if (currentUser?.role === 'guest') {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning">Guests cannot submit reviews. Please sign up or log in.</Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: '16px' }}>
        <h3 className="text-center mb-4" style={{ color: '#d81b60' }}>Share Your Feedback</h3>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you think..."
              required
            />
          </Form.Group>
          <Button
            type="submit"
            className="mt-3 w-100"
            style={{ backgroundColor: '#d81b60', borderColor: '#d81b60' }}
          >
            Submit Review
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
