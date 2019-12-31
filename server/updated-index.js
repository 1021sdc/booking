/* eslint-disable max-len */
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { pool } = require('../db/postgres-connection.js');

const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, '../public/dist')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/room', (req, res) => {
  // console.log('room', req.query.id);

  const roomQuery = `SELECT * FROM rooms WHERE id=${req.query.id}`;
  pool.query(roomQuery, (error, response) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    }

    // console.log('room: ', response.rows[0]);
    res.send(response.rows[0]);
  });
});

app.get('/booking', (req, res) => {
  // console.log('booking', req.query.id);

  const bookingQuery = `SELECT * FROM bookings WHERE id=${req.query.id}`;
  pool.query(bookingQuery, (error, response) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    }

    // console.log('booking: ', response.rows[0]);
    res.send(response.rows);
  });
});

app.post('/booking', (req, res) => {
  console.log('Post booking: ', req.body);

  const data = {
    roomId: req.body.roomId,
    email: req.body.email,
    guests: req.body.guests,
    check_in: new Date(req.body.check_in),
    check_out: new Date(req.body.check_out),
    createdAt: new Date(req.body.createdAt),
  };

  const text = 'INSERT INTO bookings (email, guests, check_in, check_out, createdAt, roomId, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const values = [data.email, data.guests, new Date(data.check_in), new Date(data.check_out), new Date(data.createdAt), data.roomId, new Date()];
  pool.query(text, values, (error, response) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    }

    console.log('Saved booking to db.', response);
    res.send();
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
