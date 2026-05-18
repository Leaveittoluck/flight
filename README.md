# Leave It To Luck

A travel destination discovery app. Enter your budget, group size, and trip mood — the app picks destinations that fit.

Built as a travel affiliate platform: destination cards link to Skyscanner and Booking.com. Affiliate link clicks are tracked through the backend before redirecting users.

---

## Current MVP scope

- Generator form: budget, travellers, mood, season, departure date, optional return date
- Destination engine: selects up to 3 matching destinations using flight-first budget logic — a destination is eligible when its flight cost fits the budget; hotel affordability is shown separately
- Destination cards: city, cost breakdown (flights + hotel), trip tags, fun fact, recommended places, CTA links
- CTA flow: flight button always active; hotel button unlocks after the flight link is opened; remaining budget shown after flight click
- CTA click tracking: every flight/hotel button click is recorded via backend before redirect; analytics failure never blocks the redirect
- Routing: Home, Dashboard (placeholder), Stats (placeholder)

Third-party travel API integrations (live flight prices, hotel availability) are planned for a later phase. All provider calls will route through this backend — never directly from the frontend. Identical provider requests within a short window will be cached to protect rate-limited API quotas.

---

## Tech stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Vite + React 19 + Tailwind CSS v4   |
| Backend  | Node.js + Express                   |
| Database | PostgreSQL (schema: `flight`)       |
| Routing  | react-router-dom v7                 |
| HTTP     | axios                               |
| Validation | zod                               |

---

## Repo structure

```
flight/
  client/          Vite + React frontend
    src/
      pages/           GeneratorPage, DashboardPage, StatsPage
      components/
        form/          BudgetInput, TravellersSelect, MoodSelect, SeasonSelect, GeneratorForm
        destinations/  DestinationCard, DestinationResults
        layout/        Navbar, Layout
        ui/            Button, SectionHeading, StatusMessage
      services/        destinationsApi.js, clicksApi.js
      constants/       moodOptions.js, seasonOptions.js
      utils/           normalizeDestination.js

  server/          Express API
    src/
      routes/          index.js, destinations.routes.js, clicks.routes.js, health.routes.js
      controllers/     destinations.controller.js, clicks.controller.js, health.controller.js
      services/        destinations.service.js, clicks.service.js
      validators/      destinations.validator.js, clicks.validator.js
      repositories/    destinations.repository.js
      middleware/      errorHandler.js, notFound.js
      db/              pool.js
```

---

## Running locally

### Prerequisites
- Node.js 18+
- PostgreSQL running locally with the `flight` schema created

### Backend

```bash
cd server
cp .env.example .env        # fill in DATABASE_URL and set DB_SCHEMA=flight
npm install
npm run dev                 # or: node src/server.js
```

Server starts on `http://localhost:5000` (or the PORT in your .env).

### Frontend

```bash
cd client
cp .env.example .env        # VITE_API_BASE_URL can stay empty for local dev
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`.  
The Vite dev server proxies all `/api/*` requests to `http://localhost:5000` — no CORS config needed locally.

### Database setup

Run these once against your PostgreSQL database (requires the `flight` schema to exist):

```bash
# 1. Create the clicks table
psql $DATABASE_URL -f server/migrations/000_consolidated_schema.sql

# 2. Add iata_code column to destinations
psql $DATABASE_URL -f server/migrations/003_add_iata_code_to_destinations.sql

# 3. Make provider URL columns nullable (URLs are now built dynamically)
psql $DATABASE_URL -f server/migrations/004_nullable_provider_urls.sql

# 4. Seed all London Stansted destinations (idempotent — safe to re-run)
cd server && npm run db:seed:stansted
```

The seed script inserts 48 direct-flight destinations from STN with trip types,
recommended places, and pricing data. It is fully idempotent: re-running it
updates existing rows rather than creating duplicates.

---

## Environment variables

### server/.env

| Variable       | Description                                              |
|----------------|----------------------------------------------------------|
| `PORT`         | Port the Express server listens on (default: 5000)      |
| `DATABASE_URL` | PostgreSQL connection string                             |
| `DB_SCHEMA`    | Postgres schema name (default: `public`, set to `flight`)|
| `NODE_ENV`     | `development` or `production`                           |

### client/.env

| Variable             | Description                                                    |
|----------------------|----------------------------------------------------------------|
| `VITE_API_BASE_URL`  | API base URL for production. Leave empty for local dev proxy.  |

---

## API routes

### `GET /api/health`
Health check. Returns `{ ok: true }`.

### `POST /api/destinations/generate`
Generate up to 3 destination suggestions.

**Request body:**
```json
{
  "departure_airport_id": 1,
  "budget": 2000,
  "travellers": 2,
  "trip_type_slug": "beach",
  "season": "summer"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Destinations found",
  "data": {
    "destinations": [...],
    "meta": { "results_count": 3, "fallback_used": false, "tiers_hit": ["tier1_exact"] },
    "request": { ... }
  }
}
```

### `POST /api/click`
Track a CTA button click before affiliate redirect.

**Request body:**
```json
{
  "destination_id": 12,
  "click_type": "flight"
}
```

`click_type` must be `"flight"` or `"hotel"`.

**Response:**
```json
{
  "ok": true,
  "message": "Click tracked",
  "data": { "destination_id": 12, "click_type": "flight" }
}
```

---

## Frontend pages

| Route        | Status      | Notes                        |
|--------------|-------------|------------------------------|
| `/`          | Working     | Generator form + results     |
| `/dashboard` | Placeholder | Trip history — not built yet |
| `/stats`     | Placeholder | Analytics — not built yet    |

---

## Known TODOs

- [ ] Replace departure airport hardcode (`DEPARTURE_AIRPORT_ID = 1`) with a selector
- [ ] Build Dashboard and Stats pages
- [ ] Add auth before any per-user features
- [ ] Integrate live flight/hotel provider APIs (via backend only, with caching)
