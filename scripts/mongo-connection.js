/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/booking', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB..');
});

const maxGuestSchema = new mongoose.Schema({
  adults: Number,
  children: Number,
  infants: Number,
});

const roomsSchema = new mongoose.Schema({
  id: { type: Number },
  roomname: String,
  price: Number,
  cleaning_fee: Number,
  service_fee: Number,
  tax: Number,
  max_guest: maxGuestSchema,
  min_night: Number,
  max_night: Number,
  rating: String,
  num_reviews: Number,
  createdAt: Date,
  updatedAt: Date,
  bookings: Array,
});

exports.Room = mongoose.model('Room', roomsSchema);
