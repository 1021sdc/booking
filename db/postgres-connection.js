const { Pool } = require('pg');

const pool = new Pool({
  user: 'inna',
  host: 'localhost',
  password: 'password',
  database: 'booking',
  port: 5432,
});

module.exports = {
  pool,
};
