const { Pool } = require('pg');
const pwd = require('./postgres-config');

const pool = new Pool({
  user: 'postgres',
  host: 'ec2-54-214-139-167.us-west-2.compute.amazonaws.com',
  password: pwd.p,
  database: 'booking',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  pool,
};
