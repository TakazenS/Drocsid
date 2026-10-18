BEGIN;

TRUNCATE messages, channels, members, servers, users CASCADE;

INSERT INTO users (id, username, email, password_hash, bio, status) VALUES
  ('11111111-0000-0000-0000-000000000001', 'alice',   'alice@drocsid.dev',   'fake-hash', 'Créatrice de deux serveurs', 'online'),
  ('11111111-0000-0000-0000-000000000002', 'bob',     'bob@drocsid.dev',     'fake-hash', 'Fan de jeux vidéo',          'idle'),
  ('11111111-0000-0000-0000-000000000003', 'charlie', 'charlie@drocsid.dev', 'fake-hash', NULL,                         'dnd'),
  ('11111111-0000-0000-0000-000000000004', 'diane',   'diane@drocsid.dev',   'fake-hash', 'Nouvelle ici',               'offline');

INSERT INTO servers (id, name, description, owner_id) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Dev React',     'Entraide React et TypeScript', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000002', 'Club Lecture',  'Un livre par mois',            '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000003', 'Gaming Night',  'Sessions du vendredi soir',    '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000004', 'Photographie',  NULL,                           '11111111-0000-0000-0000-000000000003');

INSERT INTO members (user_id, server_id, nickname, joined_at) VALUES
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', NULL,          now() - interval '30 days'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', NULL,          now() - interval '20 days'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003', 'Ali',         now() - interval '10 days'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', NULL,          now() - interval '25 days'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'Bobby',       now() - interval '5 days'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004', NULL,          now() - interval '15 days'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', NULL,          now() - interval '2 days'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002', NULL,          now() - interval '1 day');

INSERT INTO channels (id, server_id, name, type, position) VALUES
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'général',     'text',  0),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'aide',        'text',  1),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', 'Vocal',       'voice', 2),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002', 'général',     'text',  0),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003', 'général',     'text',  0),
  ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000003', 'Salon jeu',   'voice', 1),
  ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000004', 'galerie',     'text',  0);

INSERT INTO messages (channel_id, author_id, content, created_at) VALUES
  ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Bienvenue sur Dev React !',             now() - interval '3 hours'),
  ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Salut, merci pour l''invitation',       now() - interval '2 hours'),
  ('33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'Quelqu''un connaît le React Compiler ?', now() - interval '1 hour'),
  ('33333333-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003', 'On lance une partie vendredi ?',        now() - interval '30 minutes'),
  ('33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', 'Je commence le livre ce soir',          now() - interval '10 minutes');

COMMIT;
