import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from '../hooks/useAuth.ts';

import styles from './AuthScreens.module.css';

export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <div className={styles.splash} role="status">Loading Drocsid...</div>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
