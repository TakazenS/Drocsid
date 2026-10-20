<div align="center">

# Drocsid

**An educational chat application, built with React and TypeScript.**

[![React](https://shieldcn.dev/badge/React-19-blue.svg?logo=react&variant=secondary)](https://react.dev)
[![TypeScript](https://shieldcn.dev/badge/TypeScript-6%2B-blue.svg?logo=typescript&variant=secondary)](https://www.typescriptlang.org)
[![Vite](https://shieldcn.dev/badge/Vite-8-purple.svg?logo=vite&variant=secondary)](https://vite.dev)
[![Node.js](https://shieldcn.dev/badge/Node.js-22%2B-green.svg?logo=nodedotjs&variant=secondary)](https://nodejs.org)
[![Express](https://shieldcn.dev/badge/Express-5-zinc.svg?logo=express&variant=secondary)](https://expressjs.com)
[![PostgreSQL](https://shieldcn.dev/badge/PostgreSQL-13%2B-blue.svg?logo=postgresql&variant=secondary)](https://www.postgresql.org)
[![ESLint](https://shieldcn.dev/badge/ESLint-10-violet.svg?logo=eslint&variant=secondary)](https://eslint.org)
[![License: MIT](https://shieldcn.dev/badge/License-MIT-green.svg?variant=secondary)](./LICENSE)

</div>

> Badges from [shieldcn](https://github.com/jal-co/shieldcn).

---

## Table of contents

- [About](#about)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database setup](#database-setup)
  - [Running the app](#running-the-app)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Scripts](#scripts)
- [API reference](#api-reference)
- [Authentication and security](#authentication-and-security)
- [Code style](#code-style)
- [Roadmap](#roadmap)
- [License](#license)

## About

Drocsid is an educational project: a chat application that explores the kind of features found in team messaging apps. It has user accounts, servers, channels and messages, with real-time chat and an Electron desktop wrapper planned.

Current features:

- Registration, login and logout with persistent sessions
- Route guards (guests and signed-in users see different pages)
- Light and dark themes, with a System / Light / Dark switcher
- Open Graph metadata for link previews
- API route listing the servers of the signed-in user
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
├── .vscode/
│   └── settings.json                           # Shared editor settings (format on save, LF)
├── public/                                     # Static assets served as-is
│   ├── favicon.svg                             # Browser tab icon
│   └── icons.svg                               # SVG icons
├── server/                                     # Back end (Express API)
│   ├── database/
│   │   ├── dev/                                # Development-only SQL scripts, in order
│   │   │   ├── 1-init-data.sql                 # Demo data
│   │   │   └── 2-create-user-servers.sql       # Adds your account to demo servers
│   │   └── init-db.sql                         # Database schema (required, run first)
│   ├── src/
│   │   ├── middlewares/
│   │   │   └── requireAuth.ts                  # Rejects requests without a session (401)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts                   # /api/auth: register, login, logout
│   │   │   └── meRoutes.ts                     # /api/me: signed-in user and their servers
│   │   ├── types/
│   │   │   └── express-session.d.ts            # Adds userId to the session type
│   │   ├── db.ts                               # PostgreSQL pool and query helpers
│   │   ├── helpers.ts                          # Shared SQL columns and error helpers
│   │   └── index.ts                            # Entry point: sessions, routes, health check
│   ├── .env.example                            # Server environment template
│   ├── package.json                            # Server dependencies and scripts
│   └── tsconfig.json                           # Server TypeScript config
├── shared/                                     # Code shared by the front end and the server
│   ├── types/
│   │   ├── interfaces.ts                       # Data models and API payloads
│   │   └── types.ts                            # Base types (Id, UserStatus, ChannelType)
│   └── validations/
│       ├── password.ts                         # Password rules
│       └── user.ts                             # Username and email rules
├── src/                                        # Front end (React)
│   ├── api/
│   │   ├── auth.ts                             # Auth API calls
│   │   └── servers.ts                          # Server API calls
│   ├── auth/
│   │   ├── Auth.tsx                            # Route guard for signed-in users
│   │   ├── AuthContext.ts                      # Auth context and types
│   │   ├── AuthProvider.tsx                    # Auth state: current user, login, logout
│   │   ├── AuthScreens.module.css              # Loading screen styles
│   │   ├── Guest.tsx                           # Route guard for guests
│   │   └── useAuth.ts                          # Hook to read the auth context
│   ├── components/
│   │   ├── ThemeToggle.module.css
│   │   └── ThemeToggle.tsx                     # System / Light / Dark switcher
│   ├── layout/
│   │   ├── MainView.module.css
│   │   ├── MainView.tsx                        # Main content area
│   │   ├── ServerList.module.css
│   │   └── ServerList.tsx                      # Server sidebar and logout button
│   ├── pages/
│   │   └── auth/
│   │       ├── Auth.module.css                 # Shared styles for the auth pages
│   │       ├── AuthShowcase.tsx                # Decorative chat bubbles panel
│   │       ├── LoginPage.tsx                   # Sign-in page
│   │       └── RegisterPage.tsx                # Sign-up page
│   ├── theme/
│   │   ├── ThemeContext.ts                     # Theme context and types
│   │   ├── ThemeProvider.tsx                   # Applies and stores the theme
│   │   └── useTheme.ts                         # Hook to read the theme context
│   ├── App.module.css
│   ├── App.tsx                                 # Signed-in layout
│   ├── helpers.ts                              # Fetch helpers (getJson, postJson)
│   ├── index.css                               # Global styles and color tokens
│   └── index.tsx                               # Entry point: providers and routes
├── .env.example                                # Front-end environment template
├── .gitattributes                              # Line endings (LF)
├── .gitignore
├── eslint.config.js                            # ESLint rules
├── index.html                                  # HTML entry, meta and Open Graph tags
├── LICENSE
├── package.json                                # Front-end dependencies and scripts
├── README.md
├── tsconfig.app.json                           # TypeScript config for src/
├── tsconfig.json                               # TypeScript project references
├── tsconfig.node.json                          # TypeScript config for vite.config.ts
└── vite.config.ts                              # Vite config: React Compiler, /api proxy
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 22 or newer
- [PostgreSQL](https://www.postgresql.org/download/) 13 or newer
- Git
- Optional: [pgAdmin](https://www.pgadmin.org/download/), if you prefer a graphical tool to the `psql` terminal client (it comes with the PostgreSQL installer on Windows)

### Installation

You need **two terminals**: one for the front end, one for the back end. Each one keeps its own folder for the whole session.

**Terminal 1: front end** (repository root)

```bash
git clone https://github.com/TakazenS/Drocsid.git
cd Drocsid
npm install
```

**Terminal 2: back end** (`server/` folder)

```bash
cd Drocsid/server
npm install
```

### Configuration

From terminal 1, copy both environment templates, then fill them in (see [Environment variables](#environment-variables)):

```bash
cp .env.example .env
cp server/.env.example server/.env
```

### Database setup

The database must exist and contain the schema from [`server/database/init-db.sql`](./server/database/init-db.sql) before the server starts. This script is **required** and must run **first**. It creates the tables but not the database itself.

Two tools can do this. Both are clients that send the same SQL to the same PostgreSQL server, so the result is identical:

- **`psql`** runs in a terminal. One command creates the database and another runs a whole file, which makes it quick to repeat.
- **pgAdmin** is a graphical app. You create the database with the mouse, then open and run each file in its Query Tool.

#### Option A: `psql` (terminal)

Run these commands from terminal 1, at the repository root. Use the same user and database name as `PGUSER` and `PGDATABASE` in `server/.env`.

**Windows**

```bash
createdb -U <user> <database_name>
psql -U <user> -d <database_name> -f server/database/init-db.sql
```

> The Windows installer does not add PostgreSQL to the `PATH`. If `psql` is not found, add `C:\Program Files\PostgreSQL\<version>\bin` to your `PATH`, then reopen the terminal.

**Linux**

After installation, the only PostgreSQL role is usually `postgres`, reachable through `sudo`. Create your own role once, with a password, then connect through `localhost`:

```bash
sudo -u postgres createuser --createdb --pwprompt <user>
createdb -h localhost -U <user> <database_name>
psql -h localhost -U <user> -d <database_name> -f server/database/init-db.sql
```

**macOS (Homebrew)**

Homebrew creates a role named after your macOS user, without a password. Set `PGUSER` to that name in `server/.env`.

```bash
createdb <database_name>
psql -d <database_name> -f server/database/init-db.sql
```

#### Option B: pgAdmin (graphical)

1. Connect to your PostgreSQL server, right-click **Databases**, then **Create → Database…**. Use the same name as `PGDATABASE`.
2. Select the new database, then open **Tools → Query Tool**.
3. Open `server/database/init-db.sql` with the **Open File** button, then run it with **Execute** (`F5`).

#### Development data (optional)

[`server/database/dev/`](./server/database/dev/) holds the SQL scripts used during development, numbered in the order they were run. They are for development only. Run them the same way as `init-db.sql`, with `psql -f` or the Query Tool. See [Development scripts](#development-scripts) to know which ones a fresh database needs.

### Running the app

**Terminal 1: front end**, on <http://localhost:5173>

```bash
npm run dev
```

**Terminal 2: back end**, on <http://localhost:3001>

```bash
npm run dev
```

The server must run from `server/`, because it loads `server/.env` from the current folder.

To check that the API reaches the database, open <http://localhost:3001/api/health>. It returns `{"status":"connected", ...}`, or `{"status":"unreachable", ...}` with the HTTP status `503` when the database cannot be reached.

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

| Variable         | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `PORT`           | Port of the API. Defaults to `3001`, the port targeted by the Vite proxy. If you change it, update the proxy in `vite.config.ts` |
| `PGHOST`         | PostgreSQL host, for example `localhost`                                    |
| `PGPORT`         | PostgreSQL port, `5432` by default                                          |
| `PGUSER`         | PostgreSQL user                                                             |
| `PGPASSWORD`     | PostgreSQL password                                                         |
| `PGDATABASE`     | Name of the database                                                        |
| `SESSION_SECRET` | Secret used to sign the session cookie. The server refuses to start without it |

The `pg` library reads the `PG*` variables by itself, so there is no connection string to build.

## Database

### Tables

| Table      | Purpose                                                                  |
| ---------- | ------------------------------------------------------------------------ |
| `users`    | Accounts: username, display name, email, argon2id hash, status, profile  |
| `servers`  | Servers, each with an owner                                              |
| `members`  | Link between users and servers, with an optional nickname                |
| `channels` | Text and voice channels of a server, ordered by `position`               |
| `messages` | Messages posted in a channel                                             |
| `session`  | Login sessions, managed by `connect-pg-simple`                           |

Types: `user_status` (`online`, `idle`, `dnd`, `offline`) and `channel_type` (`text`, `voice`).

### Development scripts

The scripts in `server/database/dev/` are a log of the queries run during development, in order. They are for development only, never for a real database.

| Order | Script                           | What it does                                                          | On a fresh database |
| ----- | -------------------------------- | --------------------------------------------------------------------- | ------------------- |
| 1     | `1-init-data.sql`                | Adds 4 users, 4 servers, memberships, channels and a few messages     | Optional            |
| 2     | `2-create-user-servers.sql`      | Adds an account to the "Dev React" and "Gaming Night" demo servers    | Optional, after registering |

> ⚠️ `1-init-data.sql` **empties** `messages`, `channels`, `members`, `servers` and `users` before inserting, including your own account. Run it before you register, and never on a database that holds data you want to keep.
>
> The demo accounts use a placeholder hash (`fake-hash`), so they **cannot log in**. Create a real account from the register page.
>
> Before running `3-create-user-servers.sql`, replace the email address in it with the one of your account.

## Scripts

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

| Method | Route                | Auth | Description                                                   |
| ------ | -------------------- | ---- | ------------------------------------------------------------- |
| GET    | `/api/health`        | No   | Server and database check (`503` if the database is unreachable) |
| POST   | `/api/auth/register` | No   | Create an account and start a session (`201`)                 |
| POST   | `/api/auth/login`    | No   | Log in with email and password                                |
| POST   | `/api/auth/logout`   | No   | Destroy the current session, if any (`204`)                   |
| GET    | `/api/me/whois`      | Yes  | Return the signed-in user                                     |
| GET    | `/api/me/servers`    | Yes  | Return the servers of the signed-in user, oldest membership first |

Every `/api/me` route goes through the `requireAuth` middleware and returns `401` without a session. The user is always identified by the session, never by a value sent in the request.

Registration rules:

- **Username**: 3 to 32 characters among letters, numbers, dots and underscores. It is also used as the initial display name.
- **Email**: must look like a valid address
- **Password**: see [below](#authentication-and-security)

## Authentication and security

- **Sessions**: `connect.sid` cookie, `httpOnly`, `sameSite: lax`, `secure` in production. It lasts 90 days and is renewed on every visit (`rolling`). Sessions are stored in the `session` table.
- **Session fixation**: the session ID is regenerated on login and registration.
- **Passwords**: hashed with argon2id. They must have 12 to 128 characters, with at least one lowercase letter, one uppercase letter and one special character.
- **Shared rules**: the front end and the server validate with the same rules, from [`shared/validations/`](./shared/validations/).
- **Login errors** are deliberately generic ("Incorrect email or password.") so that they do not reveal which emails exist.

## Code style

- 2-space indentation, semicolons, sorted imports (enforced by ESLint and `eslint-plugin-perfectionist`)
- ESLint fixes run on save in VS Code (`.vscode/settings.json`)
- LF line endings everywhere, enforced by `.gitattributes`
- UI text, code and code comments are written in English
- Colors are used by role (`--surface-*`, `--text-*`, `--action-*`) and never as raw palette colors in components
- Icons come from [`react-icons`](https://react-icons.github.io/react-icons/), Lu collection first

## Roadmap

- [x] Front end set up (Vite, React, routing)
- [x] Authentication API (register, login, logout, session)
- [x] Login and register pages, auth provider and route guards
- [x] Logout button
- [x] Light and dark themes with a switcher
- [x] README and MIT license
- [x] Open Graph metadata for link previews
- [x] `GET /api/me/servers` route
- [ ] Server list in the sidebar
- [ ] Channels and messages
- [ ] Real time with WebSocket
- [ ] Polish: `null` vs optional fields in shared types, login rate limiting
- [ ] Electron desktop app

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.
