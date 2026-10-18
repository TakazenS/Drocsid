import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from './useAuth.ts';

import styles from './AuthScreens.module.css';

export default function GuestOnly() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <div className={styles.splash} role="status">Loading Drocsid...</div>;
  }

  if (status === 'authenticated') {
    const from = (location.state as { from?: string; } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
