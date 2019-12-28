/* eslint-disable no-console */
const fs = require('fs');
const faker = require('faker');
const moment = require('moment');
// const { Room } = require('./mongo-connection.js');

// call the function what will return array (array can be empty or up to 5 items of bookings)

// let bookings = [];
let bookingsByRoom = {};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function isNotOverlapWithOtherBookingDates(roomId, startDate, endDate) {
  const bookingsOnRoom = bookingsByRoom[`${roomId}`];
  if (bookingsOnRoom === undefined) {
    return true;
  }

  // Iterate all current bookings on room and then check new start and end date overlapping or not
  for (let i = 0; i < bookingsOnRoom.length; i += 1) {
    const booking = bookingsOnRoom[i];

    // Not overlapping condition
    // newCheckIn -- newCheckout  << booking.checkIn
    // (new checkin and checkout time both should be earlier than current booking's checkin)
    // booking.checkOut << newCheckIn -- newCheckOut
    // (new checkin and checkout time both should be later than current booking's checkout)

    // Below condition is checking it is overlapped -> then return false
    if (!((moment(startDate) < moment(booking.check_in)
      && moment(endDate) <= moment(booking.check_in))
      || (moment(startDate) >= moment(booking.check_out)
        && moment(endDate) > moment(booking.check_out)))) {
      return false;
    }
  }
  return true;
}

function randomCheckInOutOnRoom(room, roomId) {
  // const room = roomList[`${roomId}`]; // get room from database
  let startDate = moment(randomDate(moment().toDate(), moment().add(2, 'months').toDate())).startOf('day').toDate();
  let endDate = moment(startDate).add(randomIntFromInterval(room.min_night, room.max_night), 'days').startOf('day').toDate();
  let trial = 0;

  while (!isNotOverlapWithOtherBookingDates(roomId, startDate, endDate)) {
    trial += 1;
    if (trial > 1) {
      return null;
    }
    startDate = moment(randomDate(moment().toDate(), moment().add(2, 'months').toDate())).startOf('day').toDate();
    endDate = moment(startDate).add(randomIntFromInterval(room.min_night, room.max_night), 'days').startOf('day').toDate();
  }

  return {
    check_in: startDate,
    check_out: endDate,
  };
}

function generateRandomBooking(room) {
  // const roomId = randomIntFromInterval(0, roomList.length - 1);
  // const room = roomList[roomId];
  const roomId = room.id;

  const randomCheckInOutDates = randomCheckInOutOnRoom(room, roomId);

  if (randomCheckInOutDates === null) {
    return null;
  }

  const booking = {
    roomId,
    email: faker.internet.email(),
    guests: {
      adults: randomIntFromInterval(1, room.max_guest.adults),
      children: randomIntFromInterval(0, room.max_guest.children),
      infants: randomIntFromInterval(0, room.max_guest.infants),
    },
    check_in: randomCheckInOutDates.check_in,
    check_out: randomCheckInOutDates.check_out,
    createdAt: moment(randomCheckInOutDates.check_in).subtract(randomIntFromInterval(0, 30), 'days').toDate(),
  };
  return booking;
}

function generateRandomBookings(num, room) {
  const bookings = [];

  let book;
  for (let i = 0; i < num; i += 1) {
    book = generateRandomBooking(room);
    // console.log(book);
    if (book !== null) {
      bookings.push(book);
      if (bookingsByRoom[`${book.roomId}`] === undefined) {
        bookingsByRoom[`${book.roomId}`] = [];
      }
      bookingsByRoom[`${book.roomId}`].push(book);
    }
  }

  return bookings;
}

let count = 0;

fs.readdir('../data', (err, items) => {

  async function store() {
    for (let i = 0; i < items.length; i += 1) {
      const result = fs.readFileSync(`../data/${items[i]}`, 'utf-8');
      console.log('items is ', items[i]);

      const parsedResult = JSON.parse(result); // [{}, {}, {}, {} ....] i = 0

      for (let j = 0; j < parsedResult.length; j+= 1) {
        parsedResult[j].id = count;
        // parsedResult[j].bookings = []; // [{id: 0}, {}, {}, {}, {}]
        const randomNum = randomIntFromInterval(0, 5);
        parsedResult[j].bookings = generateRandomBookings(randomNum, parsedResult[j]);
        count += 1;

        // here maybe i need to set to empty bookingsByRoom {}
        bookingsByRoom = {};

        console.log('my room ', parsedResult[j]);
      }

      // const saveToDb = await Room.create(parsedResult)
      // console.log('save to db ', saveToDb);

      // Room.create(parsedResult)
      //   .then((data) => {
      //     console.log('saved');

      //     // process.exit();
      //   })
      //   .catch(error => console.log(error));
    }
    console.log('i am done!');
  }
  store();
});

// fs.readdir('../data', (err, items) => {
//   for (let i = 0; i < items.length; i += 1) {
//     const stream = fs.createReadStream(`../data/${items[i]}`, { flags: 'r', encoding: 'utf-8' });
//     let buf = '';

//     stream.on('data', (d) => {
//       // console.log('boom ', d);
//       buf += d.toString(); // when data is read, stash it in a string buffer
//     });

//     stream.on('end', () => {
//       const parsedData = JSON.parse(buf);
//       // console.log(parsedData);
//       // const mappedArr = parsedData.map((el, idx) => {

//       //   return Object.assign(el, {
//       //     id: idx,
//       //     bookings: [],
//       //   });
//       // })
//       for (let j = 0; j < parsedData.length; j += 1) {
//         parsedData[j].id = j;
//         parsedData[j].bookings = [];
//       }
//       // console.log(parsedData);

//       // Room.create(parsedData).then(() => console.log('saved')).catch(error => console.log(error));
//       Room.create(parsedData)
//         .then(() => {
//           console.log('saved');

//           process.exit();
//         })
//         .catch(error => console.log(error));
//     });
//   }
// });
