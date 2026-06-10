const pool = require('../db/pool');

async function saveDiscovery({
  user_id,
  destination_id,
  budget_per_person,
  travellers,
  trip_type,
  season,
  estimated_cost_per_person,
  estimated_total_cost,
}) {
  await pool.query(
    `INSERT INTO flight.user_discoveries
       (user_id, destination_id, budget_per_person, travellers, trip_type, season,
        estimated_cost_per_person, estimated_total_cost)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      user_id,
      destination_id,
      budget_per_person         ?? null,
      travellers,
      trip_type,
      season,
      estimated_cost_per_person ?? null,
      estimated_total_cost      ?? null,
    ]
  );
}

async function getUserDiscoveries(user_id) {
  const { rows } = await pool.query(
    `SELECT
       ud.id,
       ud.destination_id,
       d.city,
       d.country,
       d.iata_code,
       ud.generated_at,
       ud.budget_per_person,
       ud.travellers,
       ud.trip_type,
       ud.season,
       ud.estimated_cost_per_person,
       ud.estimated_total_cost
     FROM flight.user_discoveries ud
     JOIN flight.destinations d ON d.id = ud.destination_id
     WHERE ud.user_id = $1
     ORDER BY ud.generated_at DESC`,
    [user_id]
  );
  return rows;
}

module.exports = { saveDiscovery, getUserDiscoveries };
