import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const USE_LOCAL_DB = process.env.USE_LOCAL_DB === 'true' || !process.env.FIREBASE_PROJECT_ID;
const LOCAL_DB_PATH = path.resolve('data', 'local-db.json');

// Initialize Local DB File if missing
async function ensureLocalDb() {
  try {
    await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
    try {
      await fs.access(LOCAL_DB_PATH);
    } catch {
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify({ users: {}, sessions: {} }, null, 2));
    }
  } catch (err) {
    console.error('Failed to initialize local DB file:', err);
  }
}

// Read/Write Local DB Helpers
async function readLocalDb() {
  await ensureLocalDb();
  const data = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeLocalDb(data) {
  await ensureLocalDb();
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

// Mock Firestore Implementation
const mockDb = {
  collection(collectionName) {
    return {
      doc(docId) {
        return {
          async get() {
            const dbData = await readLocalDb();
            const col = dbData[collectionName] || {};
            const docData = col[docId];
            return {
              exists: !!docData,
              id: docId,
              data: () => docData
            };
          },
          async set(data, options = {}) {
            const dbData = await readLocalDb();
            if (!dbData[collectionName]) dbData[collectionName] = {};
            
            const current = dbData[collectionName][docId] || {};
            const updated = options.merge ? { ...current, ...data } : data;
            
            dbData[collectionName][docId] = updated;
            await writeLocalDb(dbData);
            return { id: docId };
          },
          async update(data) {
            const dbData = await readLocalDb();
            if (!dbData[collectionName]) dbData[collectionName] = {};
            if (!dbData[collectionName][docId]) {
              throw new Error(`Document ${docId} does not exist in collection ${collectionName}`);
            }
            dbData[collectionName][docId] = { ...dbData[collectionName][docId], ...data };
            await writeLocalDb(dbData);
            return { id: docId };
          }
        };
      },
      
      async add(data) {
        const dbData = await readLocalDb();
        if (!dbData[collectionName]) dbData[collectionName] = {};
        
        const docId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        dbData[collectionName][docId] = { ...data, id: docId };
        
        await writeLocalDb(dbData);
        return { id: docId, get: async () => ({ id: docId, data: () => dbData[collectionName][docId] }) };
      },

      where(field, operator, value) {
        return {
          async get() {
            const dbData = await readLocalDb();
            const col = dbData[collectionName] || {};
            const docs = [];
            
            for (const [id, docData] of Object.entries(col)) {
              if (operator === '==' && docData[field] === value) {
                docs.push({ id, data: () => docData });
              }
            }
            
            // Sort by createdAt descending if it exists (standard for dashboard listing)
            docs.sort((a, b) => {
              const aTime = a.data().createdAt ? new Date(a.data().createdAt).getTime() : 0;
              const bTime = b.data().createdAt ? new Date(b.data().createdAt).getTime() : 0;
              return bTime - aTime;
            });
            
            return {
              docs,
              empty: docs.length === 0
            };
          }
        };
      }
    };
  }
};

let db;
let auth;

if (USE_LOCAL_DB) {
  console.log('--- RUNNING IN LOCAL DEVELOPER DB MODE ---');
  db = mockDb;
  auth = {
    async verifyIdToken(token) {
      if (token === 'mock-jwt-token') {
        return { uid: 'mock-user-123', email: 'developer@example.com' };
      }
      throw new Error('Invalid mock token');
    }
  };
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('--- FIREBASE ADMIN CONNECTED SUCCESSFULLY ---');
  } catch (err) {
    console.warn('Firebase Admin init failed, falling back to local developer DB:', err.message);
    db = mockDb;
    auth = {
      async verifyIdToken(token) {
        if (token === 'mock-jwt-token') {
          return { uid: 'mock-user-123', email: 'developer@example.com' };
        }
        throw new Error('Invalid token fallback');
      }
    };
  }
}

export { db, auth, USE_LOCAL_DB };
