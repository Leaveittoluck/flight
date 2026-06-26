# Leave It To Luck (LITL) ✦

**An emotional travel discovery platform — tell it your budget, mood, and season, and it reveals exactly one destination. No browsing, no endless scrolling. Just one.**

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express_5-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend_Deploy-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend_Deploy-Render-46E3B7?style=flat&logo=render&logoColor=white)

Most travel apps ask you to search, filter, and compare. LITL does the opposite: you describe what you want the trip to *feel* like, and the app commits to a single answer — flight cost, hotel estimate, recommended places, and all — the way a good friend would if you handed them the decision.

---

## Features

- **Single destination discovery** — one matched destination is revealed per request, not a list to browse
- **Budget-based destination matching** — per-person budget is matched against real flight + hotel cost data
- **Season selection** — spring, summer, autumn/fall, or winter, with the backend choosing the actual travel dates
- **Trip mood matching** — beach, city break, adventure, culture, and more, used to filter eligible destinations
- **Google OAuth authentication** — sign in with Google via Passport.js; no password flow to manage
- **User dashboard & profile management** — view your plan, edit your display name, and track monthly usage
- **Discovery history** — every destination generated while signed in is saved and viewable later
- **Interactive statistics page** — discovery trends, mood breakdowns, and trending destinations, with week/month/all-time filtering *(currently illustrative sample data, ahead of live usage aggregation — see [Roadmap](#roadmap-planned-features))*
- **World map visualization** — geographic view of generated destinations with mood-coded markers *(sample dataset, same note as above)*
- **Recommended places** — curated points of interest shown alongside each revealed destination
- **Responsive design** — audited and fixed for 320px–1440px+ viewports, with WCAG-compliant touch targets
- **Protected routes** — Dashboard, Profile, and Discoveries require authentication; the generator itself stays open to guests
- **Destination generation limits** — free tier is capped at 5 reveals per month, enforced server-side
- **Production deployment** — live on Vercel (frontend) + Render (backend) with a production PostgreSQL database

---

## Tech Stack

### Frontend
- **React 19**
- **Vite**
- **TailwindCSS v4**
- React Router v7 (routing), Recharts (statistics charts), React Simple Maps (world map)

### Backend
- **Node.js**
- **Express 5**

### Database
- **PostgreSQL** (dedicated `flight` schema)

### Authentication
- **Google OAuth 2.0** via Passport.js, with server-side sessions (`express-session` + `connect-pg-simple`)

### Deployment
- **Vercel** — frontend hosting
- **Render** — backend API hosting

### Networking
- **Native Fetch API** — no Axios anywhere in the codebase

---

## Project Structure

```
flight/
├── client/                   React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── auth/         Route guards (ProtectedRoute, RequireRole, RequirePlan)
│       │   ├── destinations/ Destination card, vibes, weather, seasonal accents
│       │   ├── form/         Generator form fields (budget, mood, season, travellers)
│       │   ├── layout/       Navbar, page layout, seasonal atmosphere
│       │   ├── stats/        Charts, world map, filter bar, activity feed
│       │   └── ui/           Shared buttons, headings, status messages
│       ├── context/          Auth and season React context providers
│       ├── data/             Static lookup data (themes, vibes, sample stats)
│       ├── hooks/             useReveal, useSeasonTheme
│       ├── pages/              Route-level pages (Home, Generator, Result, Dashboard, Profile, Discoveries, Stats, World Map, Login)
│       ├── services/           fetch-based API clients
│       └── utils/               Normalisers, formatters, generation-usage helpers
│
├── server/                   Express API (CommonJS)
│   ├── migrations/             Versioned SQL schema migrations
│   └── src/
│       ├── config/              Passport / Google OAuth strategy
│       ├── constants/           Roles, plans, generation limits
│       ├── controllers/         Request handlers
│       ├── db/                  PostgreSQL connection pool
│       ├── middleware/          Auth guards, error handling
│       ├── repositories/        SQL queries
│       ├── routes/              Route definitions
│       ├── services/            Business logic (matching, quotas, images)
│       └── validators/          Zod request schemas
│
└── changelogs/               Dated change logs from past development phases
```

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Leaveittoluck/flight.git
cd flight
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
```

### 4. Configure environment variables
Copy the example files and fill in your own values (see [Environment Variables](#environment-variables) below):
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 5. Run the backend
```bash
cd server
npm run dev
```

### 6. Run the frontend
```bash
cd client
npm run dev
```

The Vite dev server proxies `/api/*` requests to the local backend, so no CORS configuration is needed for local development.

---

## Environment Variables

### `server/.env`

| Variable              | Description                                              |
|-----------------------|-----------------------------------------------------------|
| `PORT`                | Port the Express server listens on                        |
| `DATABASE_URL`        | PostgreSQL connection string                               |
| `DB_SCHEMA`           | Postgres schema name (`flight`)                            |
| `NODE_ENV`            | `development` or `production`                              |
| `PEXELS_API_KEY`      | API key for destination hero images                        |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID                                     |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret                                  |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL registered with Google                  |
| `SESSION_SECRET`      | Secret used to sign session cookies                         |
| `CLIENT_ORIGIN`       | Frontend origin, used for CORS and post-login redirects     |

### `client/.env`

| Variable              | Description                                                       |
|-----------------------|---------------------------------------------------------------------|
| `VITE_API_BASE_URL`   | Backend API base URL (leave empty for local dev — proxy handles it) |

> No real secrets are committed to this repository — only `.env.example` placeholder files.

---

## Application Flow

```
Landing Page
     ↓
Generator
     ↓
Enter: budget per person · travellers · trip mood · season
     ↓
LITL selects one destination
     ↓
Destination reveal
     ↓
Discovery saved to user history (if signed in)
     ↓
Dashboard and Statistics
```

---

## Screenshots

### Landing Page
*Screenshot coming soon.*

### Generator
*Screenshot coming soon.*

### Destination Reveal
*Screenshot coming soon.*

### Dashboard
*Screenshot coming soon.*

### Discovery History
*Screenshot coming soon.*

### Statistics
*Screenshot coming soon.*

---

## Deployment

- **Frontend** is deployed on **Vercel**, which rewrites `/api/*` requests to the production backend.
- **Backend** is deployed on **Render** as a standalone Express service.
- **Production** runs on a managed **PostgreSQL** database, provisioned separately from local development.

---

## Roadmap (Planned Features)

The following are **planned, not yet implemented**:

- 🔖 Saved destinations
- 🧭 Travel personality system
- 🎯 Personalized recommendations
- 🏆 Discovery milestones
- ✨ Improved personalization
- 💳 Subscription tiers

---

## Contributing

This is currently a solo portfolio project, but contributions are welcome:

1. Fork the repository and create a feature branch
2. Keep changes scoped — avoid mixing unrelated fixes in one PR
3. Run `npm run lint` (client) and the relevant test suite (`npm test` in `client/` or `server/`) before opening a PR
4. Open a pull request describing what changed and why

---

## License

This repository does not currently include an open-source license. All rights are reserved by the project author unless a license is added in the future.
