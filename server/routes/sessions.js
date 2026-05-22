import express from 'express';
import { db } from '../services/firebase.service.js';
import { verifyAuthToken } from '../middleware/auth.js';
import { 
  generateQuestions, 
  evaluateAnswer,
  generateChatInitialQuestion,
  generateChatFollowUp,
  evaluateChatTranscript
} from '../services/gemini.service.js';

const router = express.Router();

// GET /api/sessions/analytics -> Compute session aggregates on the backend
router.get('/analytics', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const sessionsSnapshot = await db.collection('sessions').where('userId', '==', uid).get();
    
    if (sessionsSnapshot.empty) {
      return res.json({
        totalSessions: 0,
        overallAverage: 0,
        bestScore: 0,
        domainAverages: [],
        scoreHistory: []
      });
    }

    const sessions = sessionsSnapshot.docs.map(doc => doc.data());
    const completedSessions = sessions.filter(s => s.status === 'completed');

    if (completedSessions.length === 0) {
      return res.json({
        totalSessions: sessions.length,
        overallAverage: 0,
        bestScore: 0,
        domainAverages: [],
        scoreHistory: []
      });
    }

    // 1. Core aggregates
    const totalSessions = completedSessions.length;
    let sumScore = 0;
    let bestScore = 0;
    const domainGroups = {};

    completedSessions.forEach(session => {
      const score = parseFloat(session.overallScore) || 0;
      sumScore += score;
      if (score > bestScore) bestScore = score;

      const dom = session.domain || 'Unknown';
      if (!domainGroups[dom]) {
        domainGroups[dom] = { sum: 0, count: 0 };
      }
      domainGroups[dom].sum += score;
      domainGroups[dom].count += 1;
    });

    const overallAverage = parseFloat((sumScore / totalSessions).toFixed(1));

    // 2. Format Domain Averages for Recharts (BarChart)
    const domainAverages = Object.entries(domainGroups).map(([domain, data]) => ({
      domain,
      averageScore: parseFloat((data.sum / data.count).toFixed(1))
    }));

    // 3. Format Score History for Recharts (LineChart)
    // Sort oldest to newest for chronological progress tracking
    const scoreHistory = completedSessions
      .map(session => ({
        date: session.completedAt ? new Date(session.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown',
        timestamp: session.completedAt ? new Date(session.completedAt).getTime() : 0,
        score: parseFloat((session.overallScore || 0).toFixed(1)),
        domain: session.domain
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      // Limit to last 10 sessions as per spec
      .slice(-10);

    res.json({
      totalSessions: sessions.length,
      overallAverage,
      bestScore,
      domainAverages,
      scoreHistory
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to compile performance analytics' });
  }
});

// GET /api/sessions -> Fetch all sessions for user (Dashboard/Listing)
router.get('/', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const sessionsSnapshot = await db.collection('sessions').where('userId', '==', uid).get();
    
    const sessions = sessionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });

    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to retrieve practice history' });
  }
});

// GET /api/sessions/:id -> Fetch single session details
router.get('/:id', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const sessionId = req.params.id;

    const sessionDocRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionDocRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const sessionData = sessionDoc.data();
    if (sessionData.userId !== uid) {
      return res.status(403).json({ error: 'Access forbidden: unauthorized session access' });
    }

    res.json({ id: sessionDoc.id, ...sessionData });
  } catch (err) {
    console.error('Error fetching session details:', err);
    res.status(500).json({ error: 'Failed to retrieve interview session details' });
  }
});

// POST /api/sessions/start -> Generate questions and launch session
router.post('/start', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { domain, difficulty, count, type = 'structured' } = req.body;

    if (!domain || !difficulty) {
      return res.status(400).json({ error: 'Domain and difficulty are required fields' });
    }

    if (type === 'chat') {
      // 1. Interactive Conversational Chat interview
      const firstQuestion = await generateChatInitialQuestion(domain, difficulty);

      const newSession = {
        userId: uid,
        domain,
        difficulty,
        type: 'chat',
        status: 'in_progress',
        overallScore: 0,
        createdAt: new Date().toISOString(),
        chatLog: [
          {
            id: `interviewer-start-${Date.now()}`,
            sender: 'ai',
            text: firstQuestion,
            timestamp: new Date().toISOString()
          }
        ],
        questions: []
      };

      const sessionDoc = await db.collection('sessions').add(newSession);

      return res.status(201).json({
        id: sessionDoc.id,
        ...newSession
      });
    } else {
      // 2. Standard Structured Questions interview
      const countNum = parseInt(count) || 5;
      const questionStrings = await generateQuestions(domain, difficulty, countNum);

      const questions = questionStrings.map(qText => ({
        question: qText,
        answer: '',
        score: 0,
        strengths: [],
        improvements: [],
        tip: ''
      }));

      const newSession = {
        userId: uid,
        domain,
        difficulty,
        type: 'structured',
        status: 'in_progress',
        overallScore: 0,
        createdAt: new Date().toISOString(),
        questions
      };

      const sessionDoc = await db.collection('sessions').add(newSession);

      return res.status(201).json({
        id: sessionDoc.id,
        ...newSession
      });
    }
  } catch (err) {
    console.error('Error starting interview session:', err);
    res.status(500).json({ error: 'Failed to initiate practice session' });
  }
});

// POST /api/sessions/chat/respond -> Submits user message and returns a context-aware follow-up question
router.post('/chat/respond', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({ error: 'Session ID and answer are required' });
    }

    const sessionDocRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionDocRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    if (sessionData.userId !== uid) {
      return res.status(403).json({ error: 'Access forbidden: unauthorized session' });
    }

    if (sessionData.status === 'completed') {
      return res.status(400).json({ error: 'Session has already been concluded' });
    }

    // Append Candidate message to chatLog
    const updatedChatLog = [
      ...(sessionData.chatLog || []),
      {
        id: `candidate-${Date.now()}`,
        sender: 'user',
        text: answer,
        timestamp: new Date().toISOString()
      }
    ];

    // Count how many responses the user has submitted
    const userMessageCount = updatedChatLog.filter(msg => msg.sender === 'user').length;

    let aiReplyText = "";
    
    // We limit conversational chat interviews to 4 rounds of Q&A
    if (userMessageCount < 4) {
      // Call service to generate contextual follow-up question
      aiReplyText = await generateChatFollowUp(sessionData.domain, sessionData.difficulty, updatedChatLog);
    } else {
      // Gracefully wrap up the chat questions
      aiReplyText = "Thank you for sharing your thoughts on that! We have covered all the major technical aspects of the interview. Please click the 'Conclude and View Feedback' button at the bottom of your screen to compile your final aggregate scores and evaluation dashboard.";
    }

    // Append AI reply to chatLog
    updatedChatLog.push({
      id: `interviewer-${Date.now()}`,
      sender: 'ai',
      text: aiReplyText,
      timestamp: new Date().toISOString()
    });

    // Save updated session
    await sessionDocRef.update({
      chatLog: updatedChatLog
    });

    res.json({
      chatLog: updatedChatLog,
      status: sessionData.status
    });
  } catch (err) {
    console.error('Error submitting chat response:', err);
    res.status(500).json({ error: 'Failed to process chat response' });
  }
});

// POST /api/sessions/chat/conclude -> Grade the complete chat log history
router.post('/chat/conclude', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const sessionDocRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionDocRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    if (sessionData.userId !== uid) {
      return res.status(403).json({ error: 'Access forbidden: unauthorized session' });
    }

    if (sessionData.status === 'completed') {
      return res.json({ id: sessionId, ...sessionData });
    }

    const chatLog = sessionData.chatLog || [];

    // Call service to evaluate the entire transcript
    const evaluation = await evaluateChatTranscript(sessionData.domain, sessionData.difficulty, chatLog);

    // Save completed state
    const completedAt = new Date().toISOString();
    const updatedSession = {
      ...sessionData,
      status: 'completed',
      overallScore: evaluation.score,
      completedAt,
      chatFeedback: {
        score: evaluation.score,
        summary: evaluation.summary,
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || []
      }
    };

    await sessionDocRef.set(updatedSession);

    res.json({
      id: sessionId,
      ...updatedSession
    });
  } catch (err) {
    console.error('Error concluding chat interview:', err);
    res.status(500).json({ error: 'Failed to grade conversational session' });
  }
});

// POST /api/sessions/submit -> Process, evaluate with AI, and complete session
router.post('/submit', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { sessionId, answers } = req.body;

    if (!sessionId || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Session ID and answers array are required' });
    }

    const sessionDocRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionDocRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    if (sessionData.userId !== uid) {
      return res.status(403).json({ error: 'Access forbidden: unauthorized submission' });
    }

    if (sessionData.status === 'completed') {
      return res.status(400).json({ error: 'Session is already evaluated and completed' });
    }

    // Evaluate each question using Gemini (or heuristics fallback)
    const evaluatedQuestions = [];
    let scoreSum = 0;

    for (let i = 0; i < sessionData.questions.length; i++) {
      const q = sessionData.questions[i];
      const answer = answers[i] || '';
      
      // Perform AI evaluation
      const evaluation = await evaluateAnswer(q.question, answer, sessionData.domain);
      
      evaluatedQuestions.push({
        question: q.question,
        answer: answer,
        score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        tip: evaluation.tip
      });

      scoreSum += evaluation.score;
    }

    const overallScore = parseFloat((scoreSum / evaluatedQuestions.length).toFixed(1));
    const completedAt = new Date().toISOString();

    const updatedSession = {
      ...sessionData,
      status: 'completed',
      overallScore,
      completedAt,
      questions: evaluatedQuestions
    };

    await sessionDocRef.set(updatedSession);

    res.json({
      id: sessionId,
      ...updatedSession
    });
  } catch (err) {
    console.error('Error submitting session:', err);
    res.status(500).json({ error: 'Failed to process and score interview session' });
  }
});

export default router;
