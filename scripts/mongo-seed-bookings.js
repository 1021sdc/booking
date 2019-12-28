// DON'T NEED TO USE THIS ANYMORE IF MONGO-SEED-ROOMS.JS IS WORKING PROPERLY

/* eslint-disable no-console */
const fs = require('fs');
const { Room } = require('./mongo-connection.js');

// read directory
// read bookings file
// find room by id
// add bookings to the document
// update document
// continue iterate

let count = 0;

fs.readdir('../dataTwo', (err, items) => {

  async function storeBookings() {
    for (let i = 0; i < items.length; i += 1) {
      const result = fs.readFileSync(`../dataTwo/${items[i]}`, 'utf-8');
      const parsedData = JSON.parse(result);

      for (let j = 0; j < parsedData.length; j+= 1) {
        parsedData[j].id = count;

        const findRoom = await Room.find({ id: parsedData[j].roomId });
        if (findRoom && findRoom.length > 0) {
          findRoom[0].bookings.push(parsedData[j]);
          const updatedRoom = await findRoom[0].save();
        }
      }

      console.log('Saving file  - ', items[i] );
    }

    console.log('Saving bookings complete...!!!!');
  }

  storeBookings();

});

// ---------------------------------------

// const stream = fs.createReadStream('../dataTwo/bookings0.json', { flags: 'r', encoding: 'utf-8' });
// let buf = '';

// stream.on('data', (d) => {
//   buf += d.toString();
// });

// stream.on('end', () => {
//   const parsedData = JSON.parse(buf);
//   console.log('my length is ', parsedData.length)
//   for (let i = 0; i < parsedData.length; i += 1) {
//     parsedData[i].id = i;
//   }

//   // console.log(parsedData);
//   for (let j = 0; j < parsedData.length; j += 1) {
//     // console.log(parsedData[j].roomId);
//     Room.find({ id: parsedData[j].roomId })
//       .then((rm) => {
//         // console.log(rm[0].bookings);

//         rm[0].bookings.push(parsedData[j]);

//         rm[0].save((err) => {
//           if (err) {
//             console.log(err);
//           }

//           console.log('booking is updated');
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   // process.exit();
// });
