# Leadflow — Client Lead Management System (Mini CRM)

**Project 2 / FUTURE_FS_02**

A full-stack CRM for turning website enquiries into tracked client relationships.

## Technologies

- **Frontend:** React, TypeScript, Vite, HTML and CSS
- **Backend:** Node.js and Express
- **Database:** MongoDB with Mongoose
- **Authentication:** Admin sign-in, bcrypt password hashing, MongoDB-backed sessions
- **Testing:** Node test runner, Supertest, mongodb-memory-server

This version matches the requested React + Node/Express + MongoDB stack. The earlier hosted demo uses a different backend; see the deployment note below.

## Features

- Add, list, edit and delete client leads
- Name, email, company, phone, source and pipeline status
- New → Contacted → Converted status workflow
- Dashboard counts and pipeline distribution
- Search and filters for status and source
- Notes and scheduled follow-ups for each lead
- Due/overdue indicators and a follow-up view
- CSV export of the filtered list, with spreadsheet formula escaping
- Public portfolio form connected to the CRM intake API
- Each enquiry becomes a new Website lead; its message becomes the first note
- Admin-only CRM APIs, sign-in and sign-out
- Server-side validation, CSRF protection, HttpOnly cookies, request-size limits, login/intake rate limits and a form honeypot
- Responsive light layout

## Interface

![Dashboard — hosted edition, same core UI](docs/dashboard.jpg)

The screenshot shows the earlier hosted dashboard. This Express edition adds an admin sign-in screen and the connected public portfolio.

## Run locally

Requirements: **Node.js 22.13+**, npm, and MongoDB running locally or a MongoDB Atlas development database.

### 1. Install

```sh
npm ci
```

### 2. Start MongoDB

If MongoDB is installed, start its local service. Alternatively, with Docker installed:

```sh
docker compose up -d
```

The Docker service is bound to localhost and persists data in a named volume. It is for local development, not a public production database.

### 3. Configure the admin account

```sh
npm run setup
```

Enter your admin email, a unique password (12–72 bytes) and a MongoDB URI. Setup creates a local `.env` with a bcrypt password hash and random session secret. There is no default admin password and no public registration.

The default local URI is:

```text
mongodb://127.0.0.1:27017/leadflow
```

Keep `.env` private. Only `.env.example` belongs in GitHub.

### 4. Build and start

```sh
npm run build
npm start
```

- **CRM:** http://localhost:3000/
- **Connected portfolio:** http://localhost:3000/portfolio/

Sign into the CRM using the account configured in step 3.

### 5. Verify the contact workflow

1. Open `/portfolio/` and submit the contact form.
2. Sign into the CRM in another tab.
3. Refresh the lead list if it was already open.
4. The enquiry appears with source **Website**, status **New**, and the message in its notes.
5. Change the status, schedule a follow-up, add a note, and reload to check persistence.

The bundled portfolio contains the supplied identity, LinkedIn and GitHub links and previous project descriptions. It is a copy served by this Express app; the previously hosted portfolio is not automatically changed.

## Connect a separately hosted portfolio

The included portfolio already submits to `/api/contact` on the same origin.

For a separate portfolio deployment:

1. Deploy this Express application with MongoDB configured.
2. Set `CONTACT_ALLOWED_ORIGINS` on the server to the portfolio's exact origin (for example `https://your-name.github.io`). Use comma-separated origins if needed.
3. Change `portfolio/config.js` to:

```js
window.LEADFLOW_CONTACT_ENDPOINT = 'https://YOUR-EXPRESS-HOST/api/contact';
```

4. Deploy the portfolio files including `index.html`, `config.js`, and `portfolio.js`.

Do not put a database URI, session secret, password or private token in frontend code. CORS origin matching is not proof of a visitor's identity; the public intake route is intentionally open to enquiries and is rate-limited. Admin data APIs never allow cross-origin access.

**No email notification service is configured.** The form creates CRM leads; it does not send email.

## API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Database connection health |
| POST | `/api/contact` | Public, rate-limited | Create Website enquiry and initial note |
| GET | `/api/auth/session` | Public | Session state and CSRF token |
| POST | `/api/auth/login` | CSRF-protected | Admin sign-in |
| POST | `/api/auth/logout` | CSRF-protected | Revoke session |
| GET | `/api/leads` | Admin | Read leads and notes |
| POST | `/api/leads` | Admin + CSRF | Create lead |
| PUT | `/api/leads` | Admin + CSRF | Update lead |
| DELETE | `/api/leads` | Admin + CSRF | Delete lead and its notes |
| POST | `/api/notes` | Admin + CSRF | Add lead note |

Authenticated mutations use an `X-CSRF-Token` header returned by the session/sign-in endpoints. The client manages this automatically.

## Tests and verification

```sh
npm test
npm run typecheck
npm run build
```

**Verified:** 25 API/validation test assertions pass using an explicitly isolated test repository and in-memory test session store. They cover anonymous access, cookies, CSRF, sign-in/out, contact intake, lead CRUD, notes, follow-ups, origin checks and invalid input. Production uses Mongoose and MongoDB-backed sessions; it does not use the test store.

### Real MongoDB integration suite

```sh
npm run test:integration
```

This suite starts a temporary MongoDB process. On restricted machines, you can instead set `TEST_MONGODB_URI` to a disposable database whose name ends in `_test`. The suite creates and deletes test leads; never point it to a production database.

**Verification limit:** the authoring environment blocked MongoDB startup with `Operation not permitted`. The real MongoDB suite is included but has not passed here. Run it on your computer or CI before final submission. See [TESTING.md](docs/TESTING.md) for manual desktop/mobile checks.

## Deploy the Express edition

Use a hosting service that supports a persistent Node.js web service and connect it to MongoDB (for example an Atlas database). Configure:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Production environment variables from `.env.example`
- `NODE_ENV=production`
- `APP_ORIGIN` set to the exact HTTPS application origin
- A long random `SESSION_SECRET` and your admin bcrypt hash
- `TRUST_PROXY_HOPS` set to the actual number of trusted reverse proxies (often `1` on a single-proxy managed host; verify with your host)

If your host supplies environment variables without an `.env` file, use `node server/index.mjs` as the start command instead.

Use HTTPS in production. This starter uses per-process rate limit counters, suitable for a single service instance. Configure a shared rate-limit store before scaling to multiple instances.

**GitHub Pages cannot run this server or MongoDB.** GitHub stores your source; Node hosting runs your CRM.

### Earlier live demo

https://akhila-leadflow-crm.idealtulip34.chatgpt.site

That private demo remains on React/Vinext/Cloudflare D1. **It is not this Express/MongoDB deployment** and it is not connected to the bundled portfolio's intake endpoint.

## Project structure

```text
client/           React CRM and sign-in UI
server/           Express API, validation and MongoDB models
portfolio/        Public portfolio connected to /api/contact
scripts/          Local admin setup
tests/           API, validation and MongoDB integration tests
docs/             Screenshot and verification checklist
.env.example      Variable names only; no credentials
package.json      Build, run and test commands
package-lock.json Reproducible dependency versions
docker-compose.yml Local MongoDB service
```

## Upload to GitHub

Create a repository named **FUTURE_FS_02** and upload the extracted contents of this package. `package.json`, `README.md`, `client`, `server`, and `portfolio` should be at the repository root.

Do not upload `.env`, `node_modules`, `dist` or MongoDB data. A `.gitignore` is included.

After uploading, add your actual repository URL and a verified Express deployment URL to this README.

## Author

Akhila

- LinkedIn: https://www.linkedin.com/in/akhilas09
- GitHub: https://github.com/akhilas094
