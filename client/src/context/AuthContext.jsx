import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, isMockFirebase } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user ID token for backend authentication
  const getIdToken = async () => {
    if (isMockFirebase) {
      return 'mock-jwt-token';
    }
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  };

  // Auth Operations
  const register = async (name, email, password, domainPreference) => {
    if (isMockFirebase) {
      const mockUser = {
        uid: 'mock-user-123',
        email,
        displayName: name,
        domainPreference: domainPreference || 'DSA'
      };
      localStorage.setItem('intervuflow_mock_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      
      // Seed default profile in local DB via backend
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer mock-jwt-token' }
        });
      } catch (e) {
        console.warn('Backend connection ignored during mock registration');
      }
      return mockUser;
    }

    // Real Firebase registration
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    // Sync with backend
    const token = await userCredential.user.getIdToken();
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ displayName: name, domainPreference })
    });
    
    return userCredential.user;
  };

  const login = async (email, password) => {
    if (isMockFirebase) {
      const mockUser = {
        uid: 'mock-user-123',
        email,
        displayName: 'Jane Developer',
        domainPreference: 'DSA'
      };
      localStorage.setItem('intervuflow_mock_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return mockUser;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    if (isMockFirebase) {
      const mockUser = {
        uid: 'mock-user-123',
        email: 'developer@example.com',
        displayName: 'Jane Developer',
        domainPreference: 'DSA'
      };
      localStorage.setItem('intervuflow_mock_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return mockUser;
    }

    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Initialize profile on backend if first-time
    const token = await userCredential.user.getIdToken();
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return userCredential.user;
  };

  const logout = async () => {
    if (isMockFirebase) {
      localStorage.removeItem('intervuflow_mock_user');
      setCurrentUser(null);
      return;
    }
    await signOut(auth);
  };

  const updateProfileDetails = async (name, domainPreference) => {
    if (isMockFirebase) {
      const mockUser = {
        ...currentUser,
        displayName: name,
        domainPreference: domainPreference || 'DSA'
      };
      localStorage.setItem('intervuflow_mock_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return mockUser;
    } else {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        // Update user state using a new object with exact properties
        setCurrentUser({
          ...auth.currentUser,
          displayName: name
        });
      }
    }
  };

  // Auth State Listener
  useEffect(() => {
    if (isMockFirebase) {
      const savedUser = localStorage.getItem('intervuflow_mock_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, user => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    getIdToken,
    updateProfileDetails,
    isMock: isMockFirebase
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
