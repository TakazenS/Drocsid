export const FALLBACK_ERROR = 'The server did not respond. Check your connection and try again.';

export async function postJson<T>(url: string, body?: unknown): Promise<T> {
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

export async function getJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch (url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json '},
    body: JSON.stringify(body)
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as { error?: string; } | null)?.error ?? FALLBACK_ERROR;
    throw new Error(message);
  }

  return data as T;
}
