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

> **Free users discover destinations. Explorer Members discover *the* destination.**

---

## Features

### Core Discovery

- **Single destination reveal** — one matched destination per request, never a list to browse
- **Budget-based matching** — per-person budget is matched against static flight + hotel cost estimates in the database
- **Season selection** — spring, summer, autumn, or winter; the backend chooses travel dates automatically
- **Trip mood matching** — beach, city break, adventure, cultural, relaxation, nature, foodie, and more
- **Traveller count** — accommodates solo travellers through to groups; hotel room logic adjusts automatically
- **Cinematic result page** — full-screen hero with a Pexels destination photo, cost breakdown, affiliate CTA links, and destination story

### Destination Guide

- **Destination story** — evocative atmosphere description and travel style tags
- **Fun fact** — a curated "Did You Know?" for the destination
- **Recommended places** — a curated list of points of interest
- **What to Expect** — weather vibe, best season, and temperature range
- **Explorer Membership gating** — fun fact, places, and weather are locked for guests and free users; a teaser of each section is shown with a gradient-fade reveal before the upgrade prompt (see [Membership Model](#membership-model))
- **Affiliate CTAs** — Skyscanner (flights) and Booking.com (accommodation); hotel CTA unlocks only after the flight CTA is used

### Account & Dashboard

- **Google OAuth authentication** — sign in with Google via Passport.js; no password flow
- **Account Center (Dashboard)** — membership status, click usage overview, recent discoveries, and account actions
- **Profile page** — view and edit display name, plan badge, member since date, and monthly usage
- **Discovery history** — every destination generated while signed in is saved and viewable in Discoveries
- **Protected routes** — Dashboard, Profile, and Discoveries require authentication; the generator stays open to guests

### Usage & Limits (enforced server-side)

- **Monthly destination generation limit** — 5 per month for free users and guests; unlimited for Explorer Members
- **Monthly affiliate CTA click limit** — 5 per month for free users and guests; unlimited for Explorer Members
- **Anonymous quota tracking** — guests are tracked by anonymous ID and share the same 5-click limit

### Statistics & Mapping *(illustrative data — see [Roadmap](#roadmap))*

- **Statistics page** — discovery trend charts, mood breakdowns, and a trending destinations feed; currently renders sample data, not live user aggregations
- **World Map** — geographic view of generated destinations with mood-coded markers; currently renders a sample dataset

### Visual & UX

- **Seasonal atmosphere** — the entire UI shifts colour and visual tone based on the current season
- **Scroll-reveal animations** — `.reveal` elements animate in as they enter the viewport
- **Responsive layout** — audited from 320 px to 1440 px+ with WCAG-compliant touch targets

---

## Membership Model

LITL has three user states. There are no intermediate "Pro" or "Adventurer" tiers — those are legacy DB values that map to Explorer Membership in all UI logic.

| State | How to get it | What they see |
|---|---|---|
| **Guest** | No account | Generator, basic result card, affiliate links (quota-limited). Premium guide sections show teasers only. Ads placeholder enabled. |
| **Free Account** | Sign in with Google | Everything a guest sees, plus: saved discoveries, dashboard, history, stats. Destination generation quota enforced. Premium guide teasers remain. |
| **Explorer Member** | Paid subscription *(not yet live — see below)* | Full destination guide: fun facts, places to explore, weather insights, local recommendations, packing tips. Ad-free experience. Unlimited generations and clicks. |

### Premium Guide Gating

Guests and free users see a **teaser** of each locked section — the first lines of the fun fact fading out, the first place card with a lock indicator, the weather intro clipped — followed by a single **"Continue Exploring"** upgrade card. The goal is curiosity, not a hard paywall.

> **Important — payments are not implemented.** Explorer Membership is a fully built UI/UX model. Plan gating is enforced client-side, with server-side middleware ready (`requirePlan('explorer')`). No real subscription activation or Stripe integration exists yet. Setting a user's `plan` column to `'explorer'` in the database enables the full guide manually until payments are wired up.

Plan checks across the client use `client/src/utils/planUtils.js`:
```js
// Returns true for 'explorer', 'pro', and 'adventurer' (legacy DB values)
isExplorer(user?.plan)
```

---

## Tech Stack

### Frontend
| | |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Recharts v3** | Statistics charts |
| **React Simple Maps v1** | World map visualisation |

### Backend
| | |
|---|---|
| **Node.js** | Runtime |
| **Express 5** | HTTP framework (CommonJS modules) |
| **Passport.js 0.7** | Authentication middleware |
| **passport-google-oauth20** | Google OAuth 2.0 strategy |
| **pg 8** | PostgreSQL client |
| **express-session + connect-pg-simple** | Server-side sessions stored in PostgreSQL |
| **Zod** | Request validation |

### Database
- **PostgreSQL** — dedicated `flight` schema; versioned migrations in `server/migrations/`

### Deployment
- **Vercel** — frontend hosting with `/api/*` proxy rewrite to Render
- **Render** — backend API hosting
- **Managed PostgreSQL** — separate from local development

### Networking
- **Native Fetch API only** — no Axios anywhere in the codebase

---

## Project Structure

```
flight/
├── client/                       React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── auth/             ProtectedRoute, RequireRole, RequirePlan
│       │   ├── destinations/     DestinationCard, ExplorerGate, vibes, weather, seasonal accents
│       │   ├── form/             Generator inputs (budget, mood, season, travellers)
│       │   ├── layout/           Navbar, Layout, SeasonalPageAtmosphere
│       │   ├── stats/            Charts, world map, filter bar, activity feed
│       │   └── ui/               Shared buttons, headings, status messages
│       ├── context/              AuthContext (user + plan), SeasonContext
│       ├── data/                 Static lookup data (vibes, weather enrichment, season themes, sample stats)
│       ├── hooks/                useReveal (intersection observer), useSeasonTheme
│       ├── pages/                Route-level pages (see table below)
│       ├── services/             fetch-based API clients (one file per API domain)
│       └── utils/                normalizeDestination, buildProviderUrls, planUtils, generationUsage, resolvePageSeason
│
├── server/                       Express API (CommonJS)
│   ├── migrations/               Versioned SQL schema migrations
│   └── src/
│       ├── config/               Passport / Google OAuth strategy
│       ├── constants/            ROLES, PLANS, PLAN_ORDER, PLAN_LIMITS, GENERATION_LIMITS
│       ├── controllers/          Request handlers
│       ├── db/                   PostgreSQL connection pool
│       ├── middleware/           requireAuth, requirePlan, error handling
│       ├── repositories/         SQL queries (one file per entity)
│       ├── routes/               auth, clicks, destinations, discoveries, health, images, profile, usage
│       ├── services/             Business logic (matching, quotas, Pexels images)
│       └── validators/           Zod request schemas
│
└── changelogs/                   Dated change logs from past development phases
```

### Pages

| Route | Page | Auth required |
|---|---|---|
| `/` | `HomePage` — landing page with pricing and feature overview | No |
| `/travel` | `GeneratorPage` — destination generator form | No |
| `/travel/result` | `DestinationResultPage` — full destination reveal | No |
| `/dashboard` | `DashboardPage` — account overview, membership, usage | Yes |
| `/profile` | `ProfilePage` — account details, edit display name | Yes |
| `/discoveries` | `DiscoveriesPage` — saved discovery history | Yes |
| `/stats` | `StatsPage` — charts and trends *(sample data)* | No |
| `/stats/world-map` | `WorldMapPage` — geographic discovery map *(sample data)* | No |
| `/login` | `LoginPage` — Google OAuth entry point | No |
| `/register` | `RegisterPage` — redirects to OAuth flow | No |

---

## Environment Variables

### `server/.env`

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `DATABASE_URL` | PostgreSQL connection string |
| `DB_SCHEMA` | Postgres schema name (`flight`) |
| `NODE_ENV` | `development` or `production` |
| `PEXELS_API_KEY` | API key for destination hero images |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL registered in Google Cloud Console |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `CLIENT_ORIGIN` | Frontend origin, used for CORS and post-login redirects |

### `client/.env`

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL — leave empty for local dev (Vite proxy handles it) |

> No secrets are committed to this repository. Only `.env.example` placeholder files are tracked.

---

## Local Development

### 1. Clone the repository
```bash
git clone https://github.com/Leaveittoluck/flight.git
cd flight
```

### 2. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
Fill in your PostgreSQL connection string, Google OAuth credentials, session secret, and Pexels API key.

### 4. Run database migrations
Connect to your PostgreSQL database and run the files in `server/migrations/` in order (starting from `000_consolidated_schema.sql`).

### 5. Start the backend
```bash
cd server && npm run dev
```

### 6. Start the frontend
```bash
cd client && npm run dev
```

The Vite dev server proxies `/api/*` to `localhost:<PORT>`, so no CORS configuration is needed for local development.

---

## Authentication Notes

- Authentication is **Google OAuth 2.0 only** — there is no username/password flow and no plans to add one.
- Sessions are stored server-side in PostgreSQL via `connect-pg-simple`. The session table is created automatically on first run.
- After OAuth, the user is redirected back to the frontend. The frontend fetches `/api/auth/me` on load to rehydrate the `AuthContext`.
- `ProtectedRoute` wraps all auth-required pages. Unauthenticated users are redirected to `/login`.
- `RequirePlan` gates routes by plan level using the `PLAN_ORDER` hierarchy (`free < explorer < pro < adventurer`).
- On mobile, the OAuth popup flow is replaced with a full redirect flow to avoid third-party cookie issues.

---

## Application Flow

```
Landing Page  (/}
     ↓
Generator  (/travel)
     ↓
Enter: budget per person · travellers · trip mood · season
     ↓
Backend matches one destination
     ↓
Destination reveal  (/travel/result)
  ├─ Guest / Free user: sees destination card, costs, CTAs
  │                     sees teaser of premium sections + Explorer upgrade card
  └─ Explorer Member:   sees full guide — fun fact, places, weather, all sections
     ↓
Discovery auto-saved if signed in
     ↓
Dashboard / Discoveries / Stats
```

---

## Deployment

### Frontend — Vercel
- The `client/` directory is deployed to Vercel.
- `client/vercel.json` rewrites `/api/*` to the Render backend URL.
- All other routes fall back to `index.html` for client-side routing.

### Backend — Render
- The `server/` directory is deployed as a standalone Express service on Render.
- `NODE_ENV=production` disables the Vite proxy and enables production CORS.
- `CLIENT_ORIGIN` must be set to the Vercel frontend URL so the backend allows cross-origin requests and redirects OAuth callbacks correctly.

### Database
- A managed PostgreSQL instance is provisioned separately (Render Postgres or equivalent).
- `DATABASE_URL` points to the production database; `DB_SCHEMA=flight` namespaces all tables.

---

## Roadmap

The following are **planned but not yet implemented**:

### Payments & Subscriptions
- [ ] Stripe subscription creation and checkout flow
- [ ] Stripe webhook handler to keep `users.plan` in sync with subscription status
- [ ] `PATCH /api/user/plan` endpoint for plan changes after payment confirmation
- [ ] Database migration: add `'explorer'` to any CHECK constraints on `users.plan`

### Premium Content
- [ ] Server-side stripping of premium destination fields (`fun_fact`, `recommended_places`, weather) for non-Explorer users — currently these are sent in the API response for all users and gated client-side only
- [ ] Ad placeholder rendering for guests and free users (Explorer Membership removes ads)

### Statistics & Map
- [ ] Live usage aggregation for the Stats page (currently renders sample data)
- [ ] Live user discovery data for the World Map (currently renders a sample dataset)

### User Features
- [ ] Saved / bookmarked destinations
- [ ] Travel personality system and personalised recommendations
- [ ] Discovery milestones and badges
- [ ] Referral system
- [ ] Booking verification

### Platform
- [ ] Admin dashboard for destination and user management
- [ ] Live flight and hotel pricing via real APIs (current costs are static estimates)

---

## Contributing

This is currently a solo portfolio project, but contributions are welcome:

1. Fork the repository and create a feature branch
2. Keep changes scoped — avoid mixing unrelated fixes in one PR
3. Run `npm run lint` in `client/` before opening a PR
4. Open a pull request describing what changed and why

---

## License

This repository does not currently include an open-source license. All rights are reserved by the project author unless a license is added in the future.
