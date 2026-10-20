import type { Server } from '../../shared/types/interfaces.ts';

import { getJson } from '../helpers.ts';

export function getServerList(): Promise<Server> {
  return getJson<Server>('/api/me/servers');
}
