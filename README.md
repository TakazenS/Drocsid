<div align="center">

# Drocsid

**An educational chat application, built with React and TypeScript.**

[![React](https://shieldcn.dev/badge/React-19-blue.svg?logo=react&variant=secondary)](https://react.dev)
[![TypeScript](https://shieldcn.dev/badge/TypeScript-6%2B-blue.svg?logo=typescript&variant=secondary)](https://www.typescriptlang.org)
[![Vite](https://shieldcn.dev/badge/Vite-8-purple.svg?logo=vite&variant=secondary)](https://vite.dev)
[![Node.js](https://shieldcn.dev/badge/Node.js-22%2B-green.svg?logo=nodedotjs&variant=secondary)](https://nodejs.org)
[![Express](https://shieldcn.dev/badge/Express-5-zinc.svg?logo=express&variant=secondary)](https://expressjs.com)
[![PostgreSQL](https://shieldcn.dev/badge/PostgreSQL-database-blue.svg?logo=postgresql&variant=secondary)](https://www.postgresql.org)
[![ESLint](https://shieldcn.dev/badge/ESLint-10-violet.svg?logo=eslint&variant=secondary)](https://eslint.org)
[![License: MIT](https://shieldcn.dev/badge/License-MIT-green.svg?variant=secondary)](./LICENSE)

</div>

> Badges from [shieldcn](https://github.com/jal-co/shieldcn).

---

## Table of contents

- [Drocsid](#drocsid)
  - [Table of contents](#table-of-contents)
  - [About](#about)
  - [Tech stack](#tech-stack)
  - [Project structure](#project-structure)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
  - [Environment variables](#environment-variables)
    - [Front end (`.env`)](#front-end-env)
    - [Server (`server/.env`)](#server-serverenv)
  - [Database](#database)
    - [Tables](#tables)
    - [Seed data](#seed-data)
  - [Running the app](#running-the-app)
    - [Scripts](#scripts)
  - [API reference](#api-reference)
  - [Authentication and security](#authentication-and-security)
  - [Code style](#code-style)
  - [Sharing a demo](#sharing-a-demo)
  - [Roadmap](#roadmap)
  - [License](#license)

## About

Drocsid is an educational project: a chat application that explores the kind of features found in team messaging apps. It has user accounts, servers, channels and messages, with real-time chat and an Electron desktop wrapper planned.

Current features:

- Registration, login and logout with persistent sessions
- Route guards (guests and signed-in users see different pages)
- Light and dark themes, with a System / Light / Dark switcher
- PostgreSQL schema for users, servers, members, channels and messages

## Tech stack

| Layer     | Technology                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Front end | React 19, React Router 8, Vite 8, React Compiler, CSS Modules              |
| UI        | [Plus Jakarta Sans](https://fontsource.org/fonts/plus-jakarta-sans), [react-icons](https://react-icons.github.io/react-icons/) (Lu set) |
| Back end  | Node.js, Express 5, `express-session`, `connect-pg-simple`                 |
| Database  | PostgreSQL, accessed with `pg`                                             |
| Security  | argon2id password hashing (`argon2`)                                       |
| Tooling   | TypeScript, ESLint (with `perfectionist` and `@stylistic`), `tsx`          |
| Planned   | WebSocket (real time), Electron (desktop app)                              |

Architecture:

```text
React 19 + Vite (:5173)  →  /api proxy  →  Express 5 (:3001)  →  pg  →  PostgreSQL
```

## Project structure

```text
Drocsid/
├── src/                    # Front end (React)
│   ├── api/                # Fetch helpers for the API
│   ├── auth/               # Auth context, provider, route guards
│   ├── components/         # Reusable components (e.g. ThemeToggle)
│   ├── layout/             # Main view and server list
│   ├── pages/auth/         # Login and register pages
│   └── theme/              # Theme context, provider and hook
├── server/                 # Back end (Express)
│   ├── .env.example        # Back-end environment template
│   ├── database/           # init-db.sql (schema) and init-data.sql (seed)
│   └── src/
│       ├── routes/         # API routes (authRoutes.ts, ...)
│       ├── types/          # Type augmentations (express-session)
│       ├── db.ts           # PostgreSQL pool and query helpers
│       └── index.ts        # Server entry point
├── shared/                 # Code shared by the front end and the server
│   ├── types/              # Shared TypeScript types and interfaces
│   └── validation/         # Shared validation (password rules)
├── public/                 # Static assets
├── .env.example            # Front-end environment template
├── vite.config.ts          # Vite config (React Compiler, /api proxy)
└── LICENSE
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 22 or newer (the server uses `process.loadEnvFile()`, and Vite 8 needs a recent Node)
- [PostgreSQL](https://www.postgresql.org/download/) with the `psql` command available in your terminal
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TakazenS/Drocsid.git
cd Drocsid

# 2. Install the front-end dependencies
npm install

# 3. Install the server dependencies
cd server
npm install
cd ..
```

### Configuration

Copy both templates and fill them in (see [Environment variables](#environment-variables)):

```bash
cp .env.example .env
cp server/.env.example server/.env
```

On Windows PowerShell, use `Copy-Item` instead of `cp`.

## Environment variables

The `.env` files are ignored by Git. Only the `.env.example` templates are committed.

### Front end (`.env`)

```dotenv
VITE_APP_TITLE="APP_NAME"
VITE_APP_DESCRIPTION="APP_DESCRIPTION"
VITE_APP_IMAGE="APP_IMAGE"
VITE_APP_URL="APP_URL"
VITE_APP_TYPE="APP_TYPE"
```

| Variable               | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `VITE_APP_TITLE`       | Application name, used as the page title and the `og:title` tag          |
| `VITE_APP_DESCRIPTION` | Short description, used for the meta description and `og:description`    |
| `VITE_APP_IMAGE`       | Preview image for link sharing (`og:image`), as an absolute URL          |
| `VITE_APP_URL`         | Public address of the app (`og:url`), as an absolute URL                 |
| `VITE_APP_TYPE`        | Open Graph type (`og:type`), for example `website`                       |

These values are injected into `index.html` at build time. They control how a link to Drocsid looks when it is shared in a chat or on social media ([Open Graph protocol](https://ogp.me/)). The `og:image` and `og:url` tags are currently commented out in `index.html`.

### Server (`server/.env`)

```dotenv
PORT="SERVER_PORT"

PGHOST="DB_HOST"
PGPORT="DB_PORT"
PGUSER="DB_USER"
PGPASSWORD="YOUR_PASSWORD"
PGDATABASE="DB_NAME"

# Generate one with this command:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET="SESSION_SECRET"
```

| Variable        | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `PORT`          | Port of the API (defaults to `3001`, which is also the port the Vite proxy targets) |
| `PGHOST`        | PostgreSQL host (for example `localhost`)                                   |
| `PGPORT`        | PostgreSQL port (default `5432`)                                            |
| `PGUSER`        | PostgreSQL user                                                             |
| `PGPASSWORD`    | PostgreSQL password                                                         |
| `PGDATABASE`    | Name of the database                                                        |
| `SESSION_SECRET`| Secret used to sign the session cookie. The server refuses to start without it |

The `pg` library reads the `PG*` variables by itself, so there is no connection string to build.

## Database

The schema lives in [`server/database/init-db.sql`](./server/database/init-db.sql). It does not create the database itself, so create it first.

```bash
# 1. Create the database (use the same name as PGDATABASE)
createdb -U <user> <database_name>

# 2. Create the tables
psql -U <user> -d <database_name> -f server/database/init-db.sql

# 3. (Optional) Load demo data
psql -U <user> -d <database_name> -f server/database/init-data.sql
```

### Tables

| Table      | Purpose                                                        |
| ---------- | -------------------------------------------------------------- |
| `users`    | Accounts (username, email, argon2id hash, status, profile)     |
| `servers`  | Servers, each with an owner                                    |
| `members`  | Link between users and servers (with an optional nickname)     |
| `channels` | Text and voice channels of a server, ordered by `position`     |
| `messages` | Messages posted in a channel                                   |
| `session`  | Login sessions, managed by `connect-pg-simple`                 |

Types: `user_status` (`online`, `idle`, `dnd`, `offline`) and `channel_type` (`text`, `voice`).

### Seed data

`init-data.sql` adds 4 users (alice, bob, charlie, diane), 4 servers, memberships, channels and a few messages.

> ⚠️ The seed **empties** `messages`, `channels`, `members`, `servers` and `users` before inserting. Never run it on a database that holds data you want to keep.
>
> The seed accounts use a placeholder hash (`fake-hash`), so they **cannot log in**. Create a real account from the register page.

## Running the app

Run the front end and the server in two separate terminals.

```bash
# Terminal 1: front end, on http://localhost:5173
npm run dev

# Terminal 2: API, on http://localhost:3001
cd server
npm run dev
```

Run the server from the `server/` folder, because it loads `server/.env` from the current directory.

Check that the API and the database are connected: <http://localhost:3001/api/health> should return `{"status":"connected", ...}`. If the database cannot be reached, the status is `unreachable`.

### Scripts

| Location  | Command             | Description                                  |
| --------- | ------------------- | -------------------------------------------- |
| root      | `npm run dev`       | Start the Vite dev server                    |
| root      | `npm run build`     | Type-check, then build for production        |
| root      | `npm run preview`   | Preview the production build                 |
| root      | `npm run lint`      | Run ESLint                                   |
| root      | `npm run lint:fix`  | Run ESLint and fix what can be fixed         |
| `server/` | `npm run dev`       | Start the API with auto-reload (`tsx watch`) |
| `server/` | `npm run typecheck` | Type-check the server                        |

## API reference

All routes are prefixed with `/api`. In development, Vite proxies `/api` to the server.

| Method | Route                | Auth | Description                                    |
| ------ | -------------------- | ---- | ---------------------------------------------- |
| GET    | `/api/health`        | No   | Server and database check                      |
| POST   | `/api/auth/register` | No   | Create an account and start a session (`201`)  |
| POST   | `/api/auth/login`    | No   | Log in with email and password                 |
| POST   | `/api/auth/logout`   | Yes  | Destroy the session (`204`)                    |
| GET    | `/api/auth/me`       | Yes  | Return the signed-in user (`401` otherwise)    |

Registration rules:

- **Username**: 3 to 32 characters among letters, numbers, dots and underscores
- **Email**: must look like a valid address
- **Password**: see [below](#authentication-and-security)

## Authentication and security

- **Sessions**: `connect.sid` cookie, `httpOnly`, `sameSite: lax`, `secure` in production. It lasts 90 days and is renewed on every visit (`rolling`). Sessions are stored in the `session` table.
- **Session fixation**: the session ID is regenerated on login and registration.
- **Passwords**: hashed with argon2id. They must have 12 to 128 characters, with at least one lowercase letter, one uppercase letter and one special character. The same rule is shared by the front end and the server through [`shared/validation/password.ts`](./shared/validation/password.ts).
- **Login errors** are deliberately generic ("Incorrect email or password.") so that they do not reveal which emails exist.

## Code style

- 2-space indentation, semicolons, sorted imports (enforced by ESLint and `eslint-plugin-perfectionist`)
- UI text, code and code comments are written in English
- Colors are used by role (`--surface-*`, `--text-*`, `--action-*`) and never as raw palette colors in components
- Icons come from [`react-icons`](https://react-icons.github.io/react-icons/), Lu collection first

## Sharing a demo

To show the app to someone outside your network, use a [Cloudflare Quick Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/):

```bash
cloudflared tunnel --url http://localhost:5173
```

The address changes on every launch. `vite.config.ts` already allows `*.trycloudflare.com` through `server.allowedHosts`. WebSocket support through Quick Tunnels has not been verified yet.

## Roadmap

- [x] Front end set up (Vite, React, routing)
- [x] Authentication API (register, login, logout, session)
- [x] Login and register pages, auth provider and route guards
- [x] Logout button
- [x] Light and dark themes with a switcher
- [x] README and MIT license
- [x] Open Graph metadata for link previews
- [ ] `GET /api/me/servers` and server list in the sidebar
- [ ] Channels and messages
- [ ] Real time with WebSocket
- [ ] Polish: `null` vs optional fields in shared types, login rate limiting
- [ ] Electron desktop app

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.
