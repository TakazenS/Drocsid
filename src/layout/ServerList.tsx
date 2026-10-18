import { useTransition } from 'react';
import { LuLogOut } from 'react-icons/lu';

import { useAuth } from '../auth/useAuth.ts';

import styles from './ServerList.module.css';

export default function ServerList() {
  const { logout } = useAuth();
  const [isLoggingOut, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <nav className={styles.serverList} aria-label="Servers">
      <div className={styles.servers}>
        {/* Server list */}
      </div>

      <button
        type="button"
        className={styles.logout}
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label="Log out"
        title="Log out"
      >
        <LuLogOut size={20} aria-hidden="true" />
      </button>
    </nav>
  );
}
