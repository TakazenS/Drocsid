import connectPgSimple from 'connect-pg-simple';
import express from 'express';
import session from 'express-session';

import { queryOne } from './db.ts';

process.loadEnvFile();

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is missing in server/.env');
}

const { pool } = await import('./db.ts');
const { authRoutes } = await import('./routes/authRoutes.ts');

const app = express();
const port = Number(process.env.PORT ?? 3001);

const PgSessionStore = connectPgSimple(session);
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

app.use(express.json());

app.use(session({
  store: new PgSessionStore({ pool, tableName: 'session' }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: NINETY_DAYS_MS,
  },
}));

app.use('/api/auth', authRoutes);

// GET /api/health
app.get('/api/health', async (_req, res) => {
  const TIMESTAMP = (new Date).toISOString();
  try {
    await queryOne('SELECT 1;');
    res.json({ status: 'connected', message: 'Database connexion successfuly established!', timestamp: TIMESTAMP });
  } catch {
    res.json({ status: 'unreachable', message: 'Database connexion failed.', timestamp: TIMESTAMP });
  }
});

app.listen(port, () => {
  console.log(`Application API on http://localhost:${port}`);
});
