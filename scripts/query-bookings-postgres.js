/* eslint-disable max-len */
/* eslint-disable no-console */
const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  user: 'inna',
  host: 'localhost',
  password: 'password',
  database: 'booking',
  port: 5432,
});

client.connect(() => {
  console.log('hi I connected');

  function saveToDb(booking) {
    return new Promise((resolve, reject) => {
      console.log('saving...');

      const text = 'INSERT INTO bookings (email, guests, check_in, check_out, createdAt, roomId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const values = [booking.email, booking.guests, booking.check_in, booking.check_out, booking.createdAt, booking.roomId];
      client.query(text, values).then(() => {
        resolve();
      }).catch((err) => {
        console.log('err is ', err);
        reject();
      });
    });
  }

  fs.readdir('../dataTwo', (err, items) => {
    setInterval(() => {
      const promises = [];
      const rawData = fs.readFileSync(`../dataTwo/${items[0]}`);
      const data = JSON.parse(rawData);
      for (let j = 0; j < data.length; j += 1) {
        promises.push(saveToDb(data[j]));
      }

      Promise.all(promises)
        .then(() => {
          console.log('saved');
        }).catch(() => {
          console.log('something went wrong');
          process.exit();
        });
    }, 30000);
  });
});
