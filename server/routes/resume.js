import express from 'express';
import multer from 'multer';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { db } from '../services/firebase.service.js';
import { verifyAuthToken } from '../middleware/auth.js';
import { analyzeResume } from '../services/gemini.service.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();

// Configure Multer for in-memory temporary storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/resume/extract-text -> Parse PDF/DOCX/TXT/MD files and return raw text to frontend
router.post('/extract-text', verifyAuthToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const { originalname, buffer } = req.file;
    const extension = originalname.split('.').pop().toLowerCase();
    
    let extractedText = '';

    if (extension === 'pdf') {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (extension === 'txt' || extension === 'md') {
      extractedText = buffer.toString('utf-8');
    } else {
      return res.status(400).json({ 
        error: 'Unsupported file extension. Please upload a .pdf, .docx, .txt, or .md file.' 
      });
    }

    if (!extractedText || !extractedText.trim()) {
      return res.status(422).json({ 
        error: 'Failed to extract text. The document appears to be empty, password-protected, or scanned images only.' 
      });
    }

    res.json({ text: extractedText });
  } catch (err) {
    console.error('Error during document parsing:', err);
    res.status(500).json({ 
      error: 'Failed to process file parsing. Please ensure the file is valid or directly copy-paste the details.' 
    });
  }
});

// POST /api/resume/analyze -> Analyze resume content with AI and store
router.post('/analyze', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { resumeText, domain } = req.body;

    if (!resumeText || !domain) {
      return res.status(400).json({ error: 'Resume text and target domain are required fields' });
    }

    // Call the Gemini service to analyze the resume
    const analysis = await analyzeResume(resumeText, domain);

    // Prepare record for database storage
    const newAnalysisRecord = {
      userId: uid,
      domain,
      resumeText: resumeText.substring(0, 10000), // cap to prevent database abuse
      score: analysis.score,
      summary: analysis.summary,
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      missingKeywords: analysis.missingKeywords || [],
      starCalibration: analysis.starCalibration || '',
      recommendedQuestions: analysis.recommendedQuestions || [],
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('resumes').add(newAnalysisRecord);

    res.status(201).json({
      id: docRef.id,
      ...newAnalysisRecord
    });
  } catch (err) {
    console.error('Error analyzing resume:', err);
    res.status(500).json({ error: 'Failed to complete resume analysis' });
  }
});

// GET /api/resume -> Fetch previous analysis history
router.get('/', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snapshot = await db.collection('resumes').where('userId', '==', uid).get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const history = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        score: data.score,
        domain: data.domain,
        summary: data.summary,
        createdAt: data.createdAt
      };
    });

    // Sort by newest first
    history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(history);
  } catch (err) {
    console.error('Error fetching resume history:', err);
    res.status(500).json({ error: 'Failed to retrieve resume review history' });
  }
});

// GET /api/resume/:id -> Fetch specific resume details
router.get('/:id', verifyAuthToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const analysisId = req.params.id;

    const doc = await db.collection('resumes').doc(analysisId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Resume analysis record not found' });
    }

    const data = doc.data();
    if (data.userId !== uid) {
      return res.status(403).json({ error: 'Access forbidden: unauthorized analysis access' });
    }

    res.json({
      id: doc.id,
      ...data
    });
  } catch (err) {
    console.error('Error fetching resume details:', err);
    res.status(500).json({ error: 'Failed to retrieve resume analysis details' });
  }
});

export default router;
