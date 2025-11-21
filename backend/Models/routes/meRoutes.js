const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../User");
const router = express.Router();
const NodeCache = require("node-cache");

router.get("/emaildata", async (req, res) => {
  try {
    // ✅ Token cookie se lo (na ke headers se)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ User find karo (password exclude karke)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Send user data
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});






// ya coin kay lia api 
let cache = {};
let lastFetchTime = {};
const CACHE_TTL = 60000; // 1 minute
const API_COOLDOWN = 8000; // 8 seconds

router.get("/coins", async (req, res) => {
  const { page = 1, per_page = 10 } = req.query;
  const now = Date.now();

  // ✅ Serve cached data if within TTL
  if (cache[page] && now - lastFetchTime[page] < CACHE_TTL) {
    console.log(`✅ Using cache for page ${page}`);
    return res.json(cache[page]);
  }

  // Prevent API spam
  if (now - (lastFetchTime[page] || 0) < API_COOLDOWN) {
    console.log("🕒 API cooldown active");
    if (cache[page]) return res.json(cache[page]);
    return res.status(429).json({ error: "Please wait before retrying" });
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=24h`
    );

    if (!response.ok) {
      console.warn(`⚠️ API limit (${response.status}), using cache`);
      if (cache[page]) return res.json(cache[page]);
      return res.status(response.status).json({ error: "Failed to fetch data" });
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("⚠️ Empty data, using cache...");
      if (cache[page]) return res.json(cache[page]);
      return res.status(500).json({ error: "No data available" });
    }

    cache[page] = data;
    lastFetchTime[page] = now;
    console.log(`🟢 New data fetched for page ${page}`);

    res.json(data);
  } catch (error) {
    console.error("❌ Fetch error:", error.message);
    if (cache[page]) return res.json(cache[page]);
    res.status(500).json({ error: "Server error" });
  }
});





// server.js
const globalCache = new NodeCache({ stdTTL: 180 });
// coingeki ki api ha global data k liye
router.get("/global", async (req, res) => {
  const cached = globalCache.get("global");
   if (cached) return res.json(cached)
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/global");
    const data = await response.json();
     globalCache.set("global", data);
     
    res.json(data);
  } catch (error) {
    console.error("Error fetching global data:", error);
    res.status(500).json({ error: "Failed to fetch global data" });
  }
});

















// / ✅ Route for coin prices
const cachedd = new NodeCache({ stdTTL: 300 }); // ✅ 5 min cache

router.get("/prices", async (req, res) => {
  try {
    // ✅ Check cache first
    const cached = cachedd.get("prices");
    if (cached) {
      // console.log("📦 Serving from cache");
      return res.json(cached);
    }

    // 🌍 Fetch from CoinGecko
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );

    // ⚠️ Handle CoinGecko rate limit or failure
    if (!response.ok) {
      const oldCache = cachedd.get("prices");
      if (oldCache) {
        console.warn("⚠️ Using old cached data due to API rate limit");
        return res.json(oldCache);
      }
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from CoinGecko" });
    }

    // ✅ Parse and validate
    const data = await response.json();
    if (!Array.isArray(data)) {
      return res.status(500).json({ error: "Invalid data format from API" });
    }

    // 💾 Cache and return
    cachedd.set("prices", data);
    // console.log("💾 Data cached successfully");
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching prices:", error);
    const oldCache = cachedd.get("prices");
    if (oldCache) {
      console.warn("⚠️ Using old cached data due to error");
      return res.json(oldCache);
    }
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
