// const pool = require("../db/pool"); // Uncomment when DB persistence is added

async function trackClick({ destination_id, click_type }) {
  // ─────────────────────────────────────────────────────────────────────────
  // TODO (subscription/limits): Check user's monthly click quota here before
  // recording. When ready, query the user's plan and click count, then throw:
  //
  //   const err = new Error("Monthly click limit reached. Upgrade to continue.");
  //   err.status = 429;
  //   err.code = "LIMIT_REACHED";
  //   throw err;
  //
  // The controller passes this straight to next(error), and the global error
  // handler already reads err.status and err.message — so HTTP 429 + the
  // LIMIT_REACHED code will reach the frontend automatically.
  // ─────────────────────────────────────────────────────────────────────────

  // TODO (persistence): Insert click event into DB here. Example:
  //
  //   await pool.query(
  //     `INSERT INTO flight.clicks (destination_id, click_type, clicked_at)
  //      VALUES ($1, $2, NOW())`,
  //     [destination_id, click_type]
  //   );
  //
  // Consider recording user_id / session_id once auth is in place.
  // ─────────────────────────────────────────────────────────────────────────

  // NOTE (provider caching): When live flight/hotel provider APIs are added,
  // identical requests (same destination + click_type within a short window)
  // should be served from cache to protect rate-limited API quotas. Add that
  // caching layer here in the service, not in the controller or route.
  // ─────────────────────────────────────────────────────────────────────────

  return { destination_id, click_type };
}

module.exports = { trackClick };
