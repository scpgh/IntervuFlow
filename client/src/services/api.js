const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Helper to make standardized fetch requests
async function apiRequest(endpoint, token, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  return data;
}

// User Endpoints
export const getUserProfile = async (token) => {
  return apiRequest('/users/me', token, { method: 'GET' });
};

export const updateUserProfile = async (token, profileData) => {
  return apiRequest('/users/me', token, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

// Sessions Endpoints
export const startSession = async (token, { domain, difficulty, count, type = 'structured' }) => {
  return apiRequest('/sessions/start', token, {
    method: 'POST',
    body: JSON.stringify({ domain, difficulty, count, type })
  });
};

export const submitAnswers = async (token, { sessionId, answers }) => {
  return apiRequest('/sessions/submit', token, {
    method: 'POST',
    body: JSON.stringify({ sessionId, answers })
  });
};

export const getSessions = async (token) => {
  return apiRequest('/sessions', token, { method: 'GET' });
};

export const getSessionDetails = async (token, sessionId) => {
  return apiRequest(`/sessions/${sessionId}`, token, { method: 'GET' });
};

export const getAnalytics = async (token) => {
  return apiRequest('/sessions/analytics', token, { method: 'GET' });
};

// Conversational Chat Sessions
export const submitChatResponse = async (token, { sessionId, answer }) => {
  return apiRequest('/sessions/chat/respond', token, {
    method: 'POST',
    body: JSON.stringify({ sessionId, answer })
  });
};

export const concludeChatSession = async (token, sessionId) => {
  return apiRequest('/sessions/chat/conclude', token, {
    method: 'POST',
    body: JSON.stringify({ sessionId })
  });
};

// Resume Analysis Endpoints
export const analyzeResume = async (token, { resumeText, domain }) => {
  return apiRequest('/resume/analyze', token, {
    method: 'POST',
    body: JSON.stringify({ resumeText, domain })
  });
};

export const getResumeHistory = async (token) => {
  return apiRequest('/resume', token, { method: 'GET' });
};

export const getResumeDetails = async (token, id) => {
  return apiRequest(`/resume/${id}`, token, { method: 'GET' });
};

// Extract text content from PDF, DOCX, TXT, or MD resume file
export const extractResumeText = async (token, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {
    ...(token && { 'Authorization': `Bearer ${token}` })
    // Let browser set the boundary for multipart/form-data!
  };

  const response = await fetch(`${BASE_URL}/resume/extract-text`, {
    method: 'POST',
    headers,
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  return data;
};

