# IntervuFlow — Next-Gen AI Interview Preparation Platform

IntervuFlow is a high-fidelity, production-grade, end-to-end AI-powered mock interview practice platform. It enables candidates and students to configure tailored practice rounds across standard engineering and behavioral domains, execute timed live interview simulations, receive structured multi-dimensional AI scoring reports from Google Gemini, and monitor overall analytical trends using interactive charts.

The codebase is engineered to be **instantly runnable and deployable** on free-tier services. It features an integrated **Developer Demo Mode** (toggled in `.env` files) that allows the entire application to operate seamlessly with a simulated authorization state and local file-based database—enabling rapid showcase demonstrations without configuring complex cloud instances first.

---

## 🚀 Key Features

*   **Tailored Mock Rounds:** Visually configure domains (DSA, System Design, Frontend, Backend, Behavioural, HR) and custom difficulties (Easy, Medium, Hard).
*   **Assessment Console:** Live timed room with individual question countdowns, text response inputs, character counters, and AI guidelines.
*   **Multi-Dimensional Feedback:** Overall averages, color-coded gauges, segmented core strengths, targeted improvements, and model advice tips compiled by Gemini.
*   **Performance Metrics:** Real-time analytics dashboards presenting chronological timeline progress (Line Chart) and comparative domain averages (Bar Chart).
*   **Developer Demo Mode:** Runs offline or in-sandbox instantly using local mocks, meaning **zero setup is required to review or demo the full UX.**

---

## 🛠️ Technology Stack

*   **Frontend:** React + Vite + Tailwind CSS v3 (Utility-first responsive layouts, custom glassmorphism components, custom transition animations).
*   **Backend:** Node.js + Express + Helmet security headers + Morgan traffic logging.
*   **AI Integration:** Google Gemini 2.5 Flash (`@google/generative-ai` with structured JSON mode).
*   **Database:** Firebase Firestore (Production) / Local simulated JSON file database (Developer Mode).
*   **Authentication:** Firebase Auth SDK & ID Token JWT Bearer verification (Production) / Bypass mock token (Developer Mode).
*   **Analytics:** Recharts responsive visualizers.

---

## 📂 Folder Structure

```text
ai-interview-platform/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI controls (Navbar, ScoreGauge, PrivateRoute)
│   │   ├── context/             # React AuthContext (Real Auth + Developer Mocks)
│   │   ├── pages/               # Routing views (Login, Register, Dashboard, Setup, Room, Feedback, Analytics)
│   │   ├── services/            # Centralized API fetch wrapper (attaches JWT headers)
│   │   ├── firebase.js          # Firebase Client wrapper
│   │   ├── App.jsx              # App Routing configuration
│   │   └── index.css            # Styles, scrollbars, and background gradient layers
│   └── .env                     # Client environment settings
│
├── server/                      # Express Backend
│   ├── data/
│   │   └── local-db.json        # Dynamic simulated local JSON database (Developer Mode)
│   ├── middleware/
│   │   └── auth.js              # Token JWT decoder (Bypass option for Developer Mode)
│   ├── routes/
│   │   ├── users.js             # User profiles profile CRUD
│   │   └── sessions.js          # Mock start, AI grading submit, and compiled Recharts aggregates
│   ├── services/
│   │   ├── firebase.service.js  # Firebase Admin wrapper / local mock switch
│   │   └── gemini.service.js    # Gemini API prompt templates and heuristic fallbacks
│   ├── index.js                 # Express Entry setup
│   └── .env                     # Server environment settings
```

---

## ⚙️ Environment Variables Setup

### 1. Backend (`/server/.env`)

```env
PORT=4000

# Google AI Studio API Key (https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="your_api_key_here"

# Firebase Service Account Credentials (For Production Firestore)
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_CLIENT_EMAIL="your_client_email"
FIREBASE_PRIVATE_KEY="your_private_key_here"

# --- DEVELOPER DEMO MODE SETTINGS ---
# Set to 'true' to allow testing and demoing without configuring real Firebase accounts
BYPASS_AUTH_FOR_DEV=true
USE_LOCAL_DB=true
```

### 2. Frontend (`/client/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000/api

# Firebase Web App Config (Optional for Developer Demo Mode)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
```

---

## 🏃 Running the Project Locally

To run the full stack in your local environment, follow these instructions:

### Prerequisites
Make sure you have Node.js installed on your system.

### Step 1: Install Dependencies
Open two terminals or command prompts:

*   **In Terminal 1 (Backend):**
    ```bash
    cd server
    npm install
    ```
*   **In Terminal 2 (Frontend):**
    ```bash
    cd client
    npm install
    ```

### Step 2: Start Servers
With standard environment variables set to **Developer Demo Mode** (`BYPASS_AUTH_FOR_DEV=true` and `USE_LOCAL_DB=true`), you can run the services immediately:

*   **In Terminal 1 (Backend):**
    ```bash
    npm run dev
    ```
    This activates the Node Express server on `http://localhost:4000`.

*   **In Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```
    This activates the Vite React server on `http://localhost:5173`. Open this URL in your web browser!

---

## 🧪 Quick Walkthrough of Demo Mode

1.  **Register/Login:** Visit `http://localhost:5173`. Click Register or Sign In—any email and password combination will log you in instantly.
2.  **Dashboard:** Click "Launch Mock Interview" to open the Setup panel.
3.  **Setup:** Pick your practice topic (e.g. *System Design*), set target difficulty to *Hard*, choose *5 Questions*, and click "Generate".
4.  **Live Assessment:** Go through the questions. Type your solution, navigate back/forth, watch the 3-minute timer reset, and click "Submit & Grade" when finished.
5.  **Report Feedback:** Review your circular score gauge, detailed strengths, areas to improve, and model advice tips.
6.  **Analytics:** Navigate to the Analytics tab to view your score trend lines and domain bar graphs!

---

## 🛡️ Production Migration & Deployment Guide

For a complete, highly detailed step-by-step walkthrough on how to deploy IntervuFlow to **Vercel** (frontend) and **Render** (backend) alongside **Firebase** and **Google Gemini 2.5 Flash**, please refer to our dedicated [Deployment Guide](file:///C:/Users/user/.gemini/antigravity/brain/247512ac-2f2f-458b-a279-077b66b7f087/deployment_guide.md).

Here is a quick summary checklist for production migration:

1.  Create a Firebase Project at [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Firestore Database** and **Authentication** (Email/Password & Google Provider).
3.  Register a Web App in your Firebase console and copy the credentials to `client/.env` (filling in `VITE_FIREBASE_API_KEY`, etc.).
4.  Navigate to Firebase Project Settings -> Service Accounts, generate a new Node.js Private Key, and paste the values into `server/.env` (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
5.  Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and paste it into `server/.env` as `GEMINI_API_KEY`.
6.  Set `BYPASS_AUTH_FOR_DEV=false` and `USE_LOCAL_DB=false` in `server/.env`.
7.  Restart both servers!
