const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on("connect", async (client) => {
  const schema = process.env.DB_SCHEMA || "public";
  const safeSchema = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema) ? schema : "public";
  await client.query(`SET search_path TO ${safeSchema}, public`);
});

module.exports = pool;