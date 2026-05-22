import { auth } from '../services/firebase.service.js';
import dotenv from 'dotenv';

dotenv.config();

const BYPASS_AUTH_FOR_DEV = process.env.BYPASS_AUTH_FOR_DEV === 'true';

export async function verifyAuthToken(req, res, next) {
  // If bypass is active, automatically attach mock user and skip verification
  if (BYPASS_AUTH_FOR_DEV) {
    req.user = {
      uid: 'mock-user-123',
      email: 'developer@example.com',
      displayName: 'Jane Developer'
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email.split('@')[0]
    };
    next();
  } catch (err) {
    console.error('Auth verification error:', err.message);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}
