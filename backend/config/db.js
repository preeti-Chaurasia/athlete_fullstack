const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
  
  max: 20,              
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, 
});


pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle database client:', err.message);
  
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log("✅ Neon PostgreSQL Connected & Ready"))
  .catch(err => console.error("❌ DB Connection Error:", err.message));

module.exports = pool;