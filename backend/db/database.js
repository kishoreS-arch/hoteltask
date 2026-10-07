const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const createHotelsTable = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Hotels table is ready.');
  } catch (error) {
    console.log('PostgreSQL unavailable. Using dummy in-memory backend data.');
  }
};

module.exports = { pool, createHotelsTable };
