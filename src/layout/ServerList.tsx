import type { Server } from '../../shared/types/interfaces.ts';

import { useState, useTransition, useEffect } from 'react';
import { LuLogOut } from 'react-icons/lu';

import { getServerList } from '../api/servers.ts';
import ServerIcon from '../components/ServerIcon.tsx';
import { useAuth } from '../hooks/useAuth.ts';

import styles from './ServerList.module.css';

export default function ServerList() {
  const { logout } = useAuth();
  const [serverList, setServerList] = useState<Server[]>([]);
  const [isLoggingOut, startTransition] = useTransition();

  useEffect(() => {
    getServerList()
      .then((data) => {
        setServerList(data);
      })
      .catch((error) => {
        console.error('Error on fetching sever list : ', error);
      });
  }, []);

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <nav className={styles.serverList} aria-label="Servers">

      <button
        type="button"
        className={styles.privateMessage}
        onClick={() => console.log("Private Message")}
        title="Log out"
      >
        <LuLogOut size={20} aria-hidden="true" />
      </button>

      <div className={styles.servers}>
        {serverList.map((s) => (
          <ServerIcon key={s.id} serverIconUrl={s.iconUrl} serverName={s.name} />
        ))}
      </div>

      <button
        type="button"
        className={styles.logout}
        onClick={handleLogout}
        disabled={isLoggingOut}
        title="Log out"
      >
        <LuLogOut size={20} aria-hidden="true" />
      </button>
    </nav>
  );
}
