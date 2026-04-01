const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    
    res.status(200).json({
      ok: true,
      message: "Server & DB connected",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

module.exports = app;