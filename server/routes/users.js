import express from 'express';
import { db } from '../services/firebase.service.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me -> Get current user profile
router.get('/me', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // First-time user setup in DB
      const defaultUser = {
        uid,
        email: req.user.email,
        displayName: req.user.displayName || 'Developer Guest',
        domainPreference: 'DSA',
        createdAt: new Date().toISOString()
      };
      await userDocRef.set(defaultUser);
      return res.json(defaultUser);
    }

    res.json(userDoc.data());
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to retrieve profile data' });
  }
});

// PUT /api/users/me -> Update user profile
router.put('/me', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { displayName, domainPreference } = req.body;
    
    if (!displayName && !domainPreference) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (domainPreference) updates.domainPreference = domainPreference;
    updates.updatedAt = new Date().toISOString();

    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.set(updates, { merge: true });

    // Fetch the updated profile to return
    const updatedDoc = await userDocRef.get();
    res.json(updatedDoc.data());
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update profile data' });
  }
});

export default router;
