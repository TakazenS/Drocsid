import type { Server } from '../../../shared/types/interfaces.ts';

import { Router } from 'express';

import { queryRows } from '../db.ts';
import { requireAuth } from '../middleware/requireAuth.ts';

export const meRoutes = Router();

meRoutes.use(requireAuth);

// GET /api/me/servers
meRoutes.get('/servers', async (req, res) => {
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
    [req.session.userId],
  );

  res.json(servers);
});
