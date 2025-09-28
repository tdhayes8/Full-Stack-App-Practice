const { Pool } = require('pg');

const pool = new Pool({
  user: 'thomashayes',      // your Postgres user
  host: 'localhost',
  database: 'happy_tracker',
  port: 5432,
});

pool.connect()
  .then(client => {
    console.log('✅ Connected to Postgres');
    client.release();
  })
  .catch(err => {
    console.error('❌ Failed to connect to Postgres:', err);
    process.exit(1);
  });

module.exports = pool;