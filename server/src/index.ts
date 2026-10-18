import connectPgSimple from 'connect-pg-simple';
import express from 'express';
import session from 'express-session';

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

app.get('/api/health', async (_req, res) => {
  const result = await pool.query<{ now: Date; }>('SELECT now()');

  res.json({ status: 'ok', databaseTime: result.rows[0].now });
});

app.listen(port, () => {
  console.log(`Application API on http://localhost:${port}`);
});
