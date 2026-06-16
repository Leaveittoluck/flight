require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
// __dirname = server/src  →  ../.env = server/.env

const REQUIRED_ENV = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'CLIENT_ORIGIN',
];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[LITL] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = require("./app");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`[LITL] PEXELS_API_KEY: ${process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.slice(0, 8) + '…  ✓ loaded' : '❌ NOT SET'}`);
});
