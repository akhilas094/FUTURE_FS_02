# Leadflow — Client Lead Management System

A full-stack Mini CRM built to manage client leads, track conversations, and organize follow-ups.

## Technologies Used

- **Frontend:** React, TypeScript, Vite, HTML, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** bcrypt password hashing and MongoDB-backed sessions
- **Testing:** Node.js Test Runner and Supertest

## Features

- Add, view, edit, and delete leads
- Track lead statuses: New, Contacted, and Converted
- Store contact details and lead sources
- Add notes to individual leads
- Schedule and track follow-ups
- Search and filter leads
- View dashboard statistics
- Export filtered leads as CSV
- Capture enquiries through a connected portfolio form
- Protect CRM access with admin authentication
- Validate input on the server

## Project Structure

| Folder | Purpose |
|---|---|
| `client` | React dashboard and sign-in interface |
| `server` | Express APIs and MongoDB models |
| `portfolio` | Public portfolio with a connected contact form |
| `scripts` | Admin account setup |
| `tests` | API, validation, and database integration tests |
| `docs` | Screenshot and testing checklist |

## Dashboard

![Leadflow dashboard](docs/dashboard.jpg)

The screenshot shows the earlier hosted edition, which shares the core dashboard interface.

## Installation

### Requirements

- Node.js 22.13 or later
- npm
- MongoDB running locally or a MongoDB Atlas database

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/akhilas094/FUTURE_FS_02.git
   cd FUTURE_FS_02
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Start MongoDB locally. If using the included Docker configuration:

   ```bash
   docker compose up -d
   ```

4. Configure your admin account and database connection:

   ```bash
   npm run setup
   ```

5. Build and start the application:

   ```bash
   npm run build
   npm start
   ```

6. Open:

   - **CRM:** http://localhost:3000/
   - **Portfolio:** http://localhost:3000/portfolio/

Sign in using the admin account created during setup.

## Contact Form Workflow

1. A visitor submits the bundled portfolio contact form.
2. Express validates the submission.
3. MongoDB stores it as a new lead with the source **Website**.
4. The visitor’s message becomes the lead’s first note.
5. The admin can update its status and schedule follow-ups.

The separately hosted Project 1 portfolio requires endpoint configuration before it can submit to this CRM.

**Email notifications are not configured.**

## Security

- Admin-only access to CRM data
- Hashed admin password
- HttpOnly session cookies
- CSRF protection
- Login and enquiry rate limiting
- Server-side input validation
- Contact-form honeypot

Never upload your actual `.env` file, database credentials, or session secret to GitHub. Use `.env.example` as the configuration reference.

## Testing

Run API and validation checks:

```bash
npm test
```

Check TypeScript and build the frontend:

```bash
npm run typecheck
npm run build
```

Run the real MongoDB integration suite:

```bash
npm run test:integration
```

**Verification status:** 25 API and validation checks passed using an isolated test repository. The frontend build and TypeScript checks also passed. Real MongoDB integration remains to be verified because database startup was blocked in the authoring environment.

## Deployment

This application requires Node.js hosting and a MongoDB database. GitHub Pages alone cannot run the backend.

For production:

- Configure the environment variables from `.env.example`
- Set `NODE_ENV=production`
- Set `APP_ORIGIN` to your HTTPS application URL
- Configure the database connection and admin credentials
- Build with `npm ci && npm run build`
- Start with `node server/index.mjs` when the host supplies environment variables

## GitHub Repository

https://github.com/akhilas094/FUTURE_FS_02

## Author

**Akhila**

- GitHub: https://github.com/akhilas094
- LinkedIn: https://www.linkedin.com/in/akhilas09
