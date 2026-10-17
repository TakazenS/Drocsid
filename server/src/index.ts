import express from 'express';

process.loadEnvFile();

const { pool } = await import('./db.ts');

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const result = await pool.query<{ now: Date; }>('SELECT now()');
  res.json({ status: 'ok', databaseTime: result.rows[0].now });
});

app.listen(port, () => {
  console.log(`Application API on http://localhost:${port}`);
});
