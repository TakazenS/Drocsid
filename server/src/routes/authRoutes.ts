import type { LoginPayload, RegisterPayload, UserAccount } from '../../../shared/types/interfaces.ts';
import type { Request } from 'express';

import * as argon2 from 'argon2';
import { Router } from 'express';

import { PASSWORD_REGEX, PASSWORD_RULES_MESSAGE } from '../../../shared/validation/password.ts';
import { queryOne } from '../db.ts';

export const authRoutes = Router();

const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,32}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_ACCOUNT_COLUMNS = `
  id,
  username,
  email,
  bio,
  avatar_url AS "avatarUrl",
  banner_url AS "bannerUrl",
  status,
  created_at AS "createdAt"
`;

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error != null && 'code' in error && error.code === '23505';
}

function startSession(req: Request, userId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) {
        reject(regenerateErr);
        return;
      }
      req.session.userId = userId;
      req.session.save((SaveError) => (SaveError ? reject(SaveError): resolve()));
    });
  });
}

async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

// POST /api/auth/register
authRoutes.post('/register', async (req, res) => {
  const { username, email, password } = (req.body ?? {}) as Partial<RegisterPayload>;

  if (typeof username !== 'string' || !USERNAME_REGEX.test(username)) {
    res.status(400).json({ error: 'Usernames use 3 to 32 letters, numbers, dots or underscores.' });
    return;
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ error: 'Enter a valid email address.' });
    return;
  }
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    res.status(400).json({ error: `${PASSWORD_RULES_MESSAGE}` });
    return;
  }

  const passwordHash = await argon2.hash(password);

  let user: UserAccount | null;
  try {
    user = await queryOne<UserAccount>(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING ${USER_ACCOUNT_COLUMNS}`,
      [username, email.trim(), passwordHash],
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: 'This username or email is already used by another account.' });
      return;
    }
    throw error;
  }

  if (!user) {
    throw new Error('User insert returned no row');
  }

  await startSession(req, user.id);
  res.status(201).json(user);
});

// POST /api/auth/login
authRoutes.post('/login', async (req, res) => {
  const { email, password } = (req.body ?? {}) as Partial<LoginPayload>;

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Enter your email and password.' });
    return;
  }

  const credentials = await queryOne<{ id: string; passwordHash: string; }>(
    `SELECT id, password_hash AS "passwordHash"
     FROM users
     WHERE lower(email) = lower($1)`,
    [email.trim()],
  );

  const isValid = credentials ? await verifyPassword(credentials.passwordHash, password) : false;

  if (!credentials || !isValid) {
    res.status(401).json({ error: 'Incorrect email or password.' });
    return;
  }

  const user = await queryOne<UserAccount>(
    `SELECT ${USER_ACCOUNT_COLUMNS} FROM users WHERE id = $1`,
    [credentials.id],
  );

  await startSession(req, credentials.id);
  res.json(user);
});

// POST /api/auth/logout
authRoutes.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
});

// GET /api/auth/me
authRoutes.get('/me', async (req, res) => {
  const { userId } = req.session;

  if (!userId) {
    res.status(401).json({ error: 'Not logged in.' });
    return;
  }

  const user = await queryOne<UserAccount>(
    `SELECT ${USER_ACCOUNT_COLUMNS} FROM users WHERE id = $1`,
    [userId],
  );

  if (!user) {
    res.status(401).json({ error: 'Not logged in.' });
    return;
  }

  res.status(200).json(user);
});
