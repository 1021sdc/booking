const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'ec2-34-210-244-211.us-west-2.compute.amazonaws.com',
  password: 'newpassword',
  database: 'booking',
  port: 5432,
});

module.exports = {
  pool,
};
