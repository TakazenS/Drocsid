import type { LoginPayload, RegisterPayload, UserAccount } from '../../shared/types/interfaces.ts';

const FALLBACK_ERROR = 'The server did not respond. Check your connection and try again.';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as { error?: string; } | null)?.error ?? FALLBACK_ERROR;
    throw new Error(message);
  }

  return data as T;
}

export function login(payload: LoginPayload): Promise<UserAccount> {
  return postJson<UserAccount>('/api/auth/login', payload);
}

export function register(payload: RegisterPayload): Promise<UserAccount> {
  return postJson<UserAccount>('/api/auth/register', payload);
}

export async function fetchCurrentUser(): Promise<UserAccount | null> {
  const response = await fetch('/api/auth/me');

  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(FALLBACK_ERROR);
  }

  return (await response.json()) as UserAccount;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}
