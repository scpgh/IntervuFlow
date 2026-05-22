import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Route Handlers
import usersRouter from './routes/users.js';
import sessionsRouter from './routes/sessions.js';
import resumeRouter from './routes/resume.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Setup Middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://127.0.0.1:5173',
      process.env.CLIENT_ORIGIN // e.g., https://intervuflow.vercel.app
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes Mounts
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/resume', resumeRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mode: process.env.USE_LOCAL_DB === 'true' ? 'developer-mock' : 'production'
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` AI INTERVIEW PLATFORM BACKEND STARTED `);
  console.log(` Server active on port: ${PORT} `);
  console.log(` Environment: ${process.env.USE_LOCAL_DB === 'true' ? 'Developer Demo' : 'Production'} `);
  console.log(`===============================================`);
});

export default app;
