// DON'T NEED TO USE THIS ANYMORE IF MONGO-SEED-ROOMS.JS IS WORKING PROPERLY

/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const fs = require('fs');
const { Room } = require('./mongo-connection.js');

const count = 0;

fs.readdir('../dataTwo', (err, items) => {

  async function storeBookings() {
    for (let i = 0; i < items.length; i += 1) {
      const result = fs.readFileSync(`../dataTwo/${items[i]}`, 'utf-8');
      const parsedData = JSON.parse(result);

      for (let j = 0; j < parsedData.length; j += 1) {
        parsedData[j].id = count;

        const findRoom = await Room.find({ id: parsedData[j].roomId });

        if (findRoom && findRoom.length > 0) {
          findRoom[0].bookings.push(parsedData[j]);
          // eslint-disable-next-line no-unused-vars
          const updatedRoom = await findRoom[0].save();
        }
      }

      console.log('Saving file - ', items[i]);
    }

    console.log('Saving bookings complete...!!!!');
  }

  storeBookings();
});
