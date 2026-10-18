import type { LoginPayload, RegisterPayload, UserAccount } from '../../shared/types/interfaces.ts';
import type { AuthStatus } from './AuthContext.ts';
import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';

import * as authApi from '../api/auth.ts';
import { AuthContext } from './AuthContext.ts';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let ignore = false;

    authApi.fetchCurrentUser()
      .catch(() => null)
      .then((currentUser) => {
        if (ignore) {
          return;
        }
        setUser(currentUser);
        setStatus(currentUser ? 'authenticated' : 'unauthenticated');
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function login(payload: LoginPayload) {
    const loggedUser = await authApi.login(payload);
    setUser(loggedUser);
    setStatus('authenticated');
  }

  async function register(payload: RegisterPayload) {
    const createdUser = await authApi.register(payload);
    setUser(createdUser);
    setStatus('authenticated');
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
    setStatus('unauthenticated');
  }

  return (
    <AuthContext value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext>
  );
}
