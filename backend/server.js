require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const pool = require("./config/db");
const predictionRoutes = require('./routes/predictionRoutes');
// ✅ Is line ko check karo
const nutritionRoutes = require('./routes/nutritionRoutes');

const app = express(); // ✅ Pehle app define karo

/* ==========================================
      🔥 MIDDLEWARE (Sahi Order Mein)
============================================= */
// ✅ server.js mein ise replace karo
// server.js mein purana CORS hatao aur ye dalo
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
})); // ✅ Simple cors for deployment
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debugging
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

/* ==========================================
      🚀 DATABASE CONNECTION
============================================= */
// pool.connect() ki jagah seedha query chala kar check karo
pool.query('SELECT NOW()')
  .then(() => console.log("✅ Database Connected & Ready"))
  .catch(err => {
    console.error("❌ DB Connection Warning:", err.message);
    // Server crash nahi karenge, bas warn karenge
  });
/* ==========================================
      ✅ ROUTES REGISTRATION
============================================= */

app.use('/api', predictionRoutes);
app.use('/api', nutritionRoutes);
app.use("/api/coach", require("./routes/coachRoutes"));

// --- LOGIN API ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DASHBOARD API ---
app.get('/api/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM athlete_metrics WHERE user_id = $1', [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROFILE UPDATE API ---
app.put('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { dob, gender, location, primarySport, specialization, proYears, height, weight } = req.body;
  try {
    const query = `
      INSERT INTO athlete_profiles 
      (user_id, dob, gender, location, primary_sport, specialization, pro_years, height, weight)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (user_id)
      DO UPDATE SET 
        dob = EXCLUDED.dob, gender = EXCLUDED.gender, location = EXCLUDED.location,
        primary_sport = EXCLUDED.primary_sport, specialization = EXCLUDED.specialization,
        pro_years = EXCLUDED.pro_years, height = EXCLUDED.height, weight = EXCLUDED.weight;
    `;
    await pool.query(query, [userId, dob, gender, location, primarySport, specialization, proYears, height, weight]);
    res.json({ success: true, message: "Profile saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Leaderboard & Events ---
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard ORDER BY rank_position ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register-event', async (req, res) => {
  const { userId, eventName } = req.body;
  try {
    await pool.query('INSERT INTO event_registrations (user_id, event_name) VALUES ($1, $2)', [userId, eventName]);
    res.json({ success: true, message: "Successfully registered!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/opportunities', async (req, res) => {
  const { category } = req.query;
  try {
    let query = 'SELECT * FROM opportunities_events';
    let params = [];
    if (category && category !== 'All Events') {
      query += ' WHERE category = $1';
      params.push(category);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("Athlete OS Backend Live"));

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});