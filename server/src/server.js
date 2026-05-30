require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
// __dirname = server/src  →  ../.env = server/.env
const app = require("./app");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`[LITL] PEXELS_API_KEY: ${process.env.PEXELS_API_KEY ? process.env.PEXELS_API_KEY.slice(0, 8) + '…  ✓ loaded' : '❌ NOT SET'}`);
});
