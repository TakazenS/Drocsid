import type { UserAccount, Server } from '../../../shared/types/interfaces.ts';

import { Router } from 'express';

import { queryRows, queryOne } from '../db.ts';
import { requireAuth } from '../middleware/requireAuth.ts';
import { USER_ACCOUNT_COLUMNS } from '../helpers.ts';

export const meRoutes = Router();

meRoutes.use(requireAuth);

// GET /api/me/whois
meRoutes.get('/whois', async (req, res) => {
  const { userId } = req.session;

  const user = await queryOne<UserAccount>(
    `SELECT ${USER_ACCOUNT_COLUMNS} FROM users WHERE id = $1`,
    [userId],
  );

  res.status(200).json(user);
});

// GET /api/me/servers
meRoutes.get('/servers', async (req, res) => {
  const { userId } = req.session;

  const servers = await queryRows<Server>(
    `SELECT
       s.id,
       s.name,
       s.description,
       s.icon_url   AS "iconUrl",
       s.banner_url AS "bannerUrl",
       s.owner_id   AS "ownerId",
       s.created_at AS "createdAt"
     FROM servers s
     JOIN members m ON m.server_id = s.id
     WHERE m.user_id = $1
     ORDER BY m.joined_at ASC`,
    [userId],
  );

  res.status(200).json(servers);
});
