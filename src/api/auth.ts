import type { LoginPayload, RegisterPayload, UserAccount } from '../../shared/types/interfaces.ts';

import { postJson, getJson } from '../helpers.ts';


export function login(payload: LoginPayload): Promise<UserAccount> {
  return postJson<UserAccount>('/api/auth/login', payload);
}

export function register(payload: RegisterPayload): Promise<UserAccount> {
  return postJson<UserAccount>('/api/auth/register', payload);
}

export async function logout(): Promise<void> {
  await postJson('/api/auth/logout');
}

export async function fetchCurrentUser(): Promise<UserAccount | null> {
  return getJson('/api/me/whois');
}

