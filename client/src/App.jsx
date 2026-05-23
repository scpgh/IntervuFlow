import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

// Layout & Core components
import Navbar from './components/Navbar';

// Page components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SetupInterview from './pages/SetupInterview';
import InterviewRoom from './pages/InterviewRoom';
import FeedbackDetail from './pages/FeedbackDetail';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ChatInterview from './pages/ChatInterview';
import Landing from './pages/Landing';
import { useAuth } from './context/AuthContext';

function HomeRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : <Landing />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="relative min-h-screen bg-transparent text-brand-textMainLight dark:text-brand-textMain flex flex-col transition-colors duration-300">
            
            {/* Main Navigation Header */}
            <Navbar />
            
            {/* Page Routing Console */}
            <main className="flex-1 flex flex-col relative">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Guarded Core Application Routes */}
                <Route path="/" element={<HomeRoute />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/setup" 
                  element={
                    <PrivateRoute>
                      <SetupInterview />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/interview/:id" 
                  element={
                    <PrivateRoute>
                      <InterviewRoom />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/chat-interview/:id" 
                  element={
                    <PrivateRoute>
                      <ChatInterview />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/resume-analysis" 
                  element={
                    <PrivateRoute>
                      <ResumeAnalysis />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/feedback/:id" 
                  element={
                    <PrivateRoute>
                      <FeedbackDetail />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <PrivateRoute>
                      <Analytics />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />

                {/* Redirect fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
