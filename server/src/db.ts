import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({});

pool.on('connect', () => {
  console.log('Successfully connected to the database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(1);
});
