const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'happy_tracker',
    password: 'temp_pass',
    port: 5432,
})
module.exports = pool;