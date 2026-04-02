const pool = require("../db/pool");

async function healthCheck(req, res, next) {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      ok: true,
      message: "Server & DB connected",
      time: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { healthCheck };
