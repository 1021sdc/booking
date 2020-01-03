/* eslint-disable max-len */
/* eslint-disable no-console */
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  user: 'inna',
  host: 'localhost',
  password: 'password',
  database: 'booking',
  port: 5432,
});

client.connect(() => {
  console.log('hi I connected');

  function saveToDb(room) {
    return new Promise((resolve, reject) => {
      console.log('saving...');
      const text = 'INSERT INTO rooms (roomname, price, cleaning_fee, service_fee, tax, max_guest, min_night, max_night, ratings, num_reviews) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
      const values = [room.roomname, room.price, room.cleaning_fee, room.service_fee, room.tax, room.max_guest, room.min_night, room.max_night, room.ratings, room.num_reviews];
      client.query(text, values).then(() => {
        resolve();
      }).catch((err) => {
        console.log('err is ', err);
        reject();
      });
    });
  }

  fs.readdir('../data', (err, items) => {
    let count = 0;

    setInterval(() => {
      console.log(items[count]);
      const promises = [];
      const rawData = fs.readFileSync(`../data/${items[count]}`);
      const data = JSON.parse(rawData);
      for (let j = 0; j < data.length; j += 1) {
        promises.push(saveToDb(data[j]));
      }

      Promise.all(promises)
        .then(() => {
          console.log('saved');
          count += 1;
        }).catch(() => {
          console.log('something went wrong');
          process.exit();
        });
    }, 30000);
  });
});
