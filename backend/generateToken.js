const jwt = require('jsonwebtoken');

// Example JWT_SECRET (replace with your actual secret)
const JWT_SECRET = 'your-jwt-secret-here'; // Replace with your actual JWT_SECRET

// Example payload for a test user (replace with actual user data as needed)
const payload = {
  id: 'example-user-id', // Replace with actual user ID
  role: 'user', // Replace with actual role, e.g., 'admin' or 'user'
  name: 'Example User' // Replace with actual name
};

// Generate JWT token
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

console.log('Generated JWT Token:', token);
