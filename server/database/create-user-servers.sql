INSERT INTO members (user_id, server_id)
SELECT u.id, s.id
FROM users u
CROSS JOIN servers s
WHERE lower(u.email) = lower('ton-email@example.com')
  AND s.id IN (
    '22222222-0000-0000-0000-000000000001',
    '22222222-0000-0000-0000-000000000003'
  )
ON CONFLICT (user_id, server_id) DO NOTHING;
