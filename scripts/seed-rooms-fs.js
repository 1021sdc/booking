/* eslint-disable no-console */
const fs = require('fs');
const faker = require('faker');

const roomNameAppendix = ['\'s Apartment', '\'s House', '\'s Loft', '\'s Condo'];

// roomname:
// price : 50 ~ 200
// cleaning fee: 5
// service fee: 5
// tax: 10
// max_guest: {adults: 5, children: 3, infants: 2}
//     random between 1-6 for adult, random between 0-4 kids
// min_night: 1
// max_night: random between 2-6
// ratings: random 0.0-5.0
// num_reviews: random 0-100

// min and max included
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Random Rooms
function generateRandomRooms(num) {
  const rooms = [];

  for (let i = 0; i < num; i += 1) {
    const room = {
      roomname: faker.name.findName()
        + roomNameAppendix[randomIntFromInterval(0, roomNameAppendix.length - 1)],
      price: randomIntFromInterval(50, 200),
      cleaning_fee: 5,
      service_fee: 5,
      tax: 10,
      max_guest: {
        adults: randomIntFromInterval(1, 6),
        children: randomIntFromInterval(0, 4),
        infants: randomIntFromInterval(0, 2),
      },
      min_night: randomIntFromInterval(1, 2),
      max_night: randomIntFromInterval(3, 6),
      ratings: (Math.random() * (5.0 - 1.0) + 1.0).toFixed(1),
      num_reviews: randomIntFromInterval(0, 100),
    };
    rooms.push(room);
  }

  return rooms;
}

for (let j = 0; j < 500; j += 1) {
  const result = JSON.stringify(generateRandomRooms(20000));

  fs.writeFileSync(`../data/rooms${j}.json`, result);
}
