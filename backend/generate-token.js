import jwt from 'jsonwebtoken';
import dotenv from 'dotenv/config';

// Create a sample user object
const user = {
  id: '65f44c49e686ddd4ad4aaaaa', // This should be a valid MongoDB ObjectId
  email: 'test@example.com'
};

// Generate a token
const token = jwt.sign(user, process.env.JWT_SECRET);

console.log('Generated token:', token);
console.log('\nUse this token in your requests');
console.log('\nFor example, in the Authorization header:');
console.log(`Bearer ${token}`);
console.log('\nOr as a cookie:');
console.log(`token=${token}`);