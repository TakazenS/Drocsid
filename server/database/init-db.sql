BEGIN;

CREATE TYPE user_status AS ENUM ('online', 'idle', 'dnd', 'offline');
CREATE TYPE channel_type AS ENUM ('text', 'voice');

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username      varchar(32)  NOT NULL UNIQUE,
  display_name  varchar(32)  NOT NULL,
  email         varchar(254) NOT NULL,
  password_hash text         NOT NULL,
  bio           varchar(190),
  avatar_url    text,
  banner_url    text,
  status        user_status  NOT NULL DEFAULT 'offline',
  first_name    varchar(100),
  last_name     varchar(100),
  date_of_birth date,
  city          varchar(100),
  created_at    timestamptz  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_unique ON users (lower(email));

CREATE TABLE servers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar(100) NOT NULL,
  description varchar(500),
  icon_url    text,
  banner_url  text,
  owner_id    uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL REFERENCES users (id)   ON DELETE CASCADE,
  server_id uuid NOT NULL REFERENCES servers (id) ON DELETE CASCADE,
  nickname  varchar(32),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, server_id)
);

CREATE TABLE channels (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id  uuid NOT NULL REFERENCES servers (id) ON DELETE CASCADE,
  name       varchar(100) NOT NULL,
  type       channel_type NOT NULL DEFAULT 'text',
  position   integer      NOT NULL DEFAULT 0,
  created_at timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
  author_id  uuid REFERENCES users (id) ON DELETE SET NULL,
  content    varchar(2000) NOT NULL CHECK (length(trim(content)) > 0),
  created_at timestamptz   NOT NULL DEFAULT now(),
  edited_at  timestamptz
);

CREATE INDEX members_server_idx    ON members (server_id);
CREATE INDEX channels_server_idx   ON channels (server_id, position);
CREATE INDEX messages_channel_idx  ON messages (channel_id, created_at DESC);
CREATE INDEX messages_author_idx   ON messages (author_id);

CREATE TABLE session (
  sid    varchar      PRIMARY KEY,
  sess   json         NOT NULL,
  expire timestamp(6) NOT NULL
);

CREATE INDEX session_expire_idx ON session (expire);

COMMIT;
