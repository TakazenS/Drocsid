export const USER_ACCOUNT_COLUMNS = `
  id,
  username,
  display_name AS "displayName",
  email,
  bio,
  avatar_url AS "avatarUrl",
  banner_url AS "bannerUrl",
  status,
  created_at AS "createdAt"
`;

export function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error != null && 'code' in error && error.code === '23505';
}
