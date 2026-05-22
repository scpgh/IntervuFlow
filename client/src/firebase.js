import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Retrieve Client Env configurations
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

let app = null;
let auth = null;
let isMockFirebase = false;

// Attempt real Firebase setup if variables are loaded
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_key' && firebaseConfig.apiKey !== '') {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('--- FIREBASE CLIENT CONFIGURED SUCCESSFULLY ---');
  } catch (err) {
    console.warn('Firebase Client init error, enabling developer mock mode:', err.message);
    isMockFirebase = true;
  }
} else {
  console.log('--- RUNNING WITH CLIENT DEVELOPER MOCK AUTH ---');
  isMockFirebase = true;
}

export { auth, isMockFirebase };
export default app;
