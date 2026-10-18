import pg from 'pg';

const { Pool } = pg;

pg.types.setTypeParser(1184, (value) => new Date(value).toISOString());
pg.types.setTypeParser(1082, (value) => value);

export const pool = new Pool({});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(1);
});

export async function queryRows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await queryRows<T>(sql, params);
  return rows[0] ?? null;
}
