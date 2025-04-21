const { Reservation, Menu } = require('../models');
const { ask } = require('./common');

async function manageFinance() {
    console.log('\n--- Manage Finance ---');
    console.log('1. Display the CA of the day');
    console.log('2. Back to main menu');
  
    const choice = await ask('Your choice: ');
  
    switch (choice) {
      case '1': {
        await displayCa();
        break;
      }
      case '2':
        return;
      default:
        console.log('❌ Invalid option.');
    }
  
    await manageFinance(); // Repeat submenu
}

async function displayCa() {
  console.log('\n💰 Display CA');

  let date;
  do {
    date = await ask('Enter date (YYYY-MM-DD): ');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.log('❌ Invalid date format.');
      date = null;
    }
  } while (!date);

  const reservations = await Reservation.findAll({
    where: { date },
    include: Menu
  });

  if (reservations.length === 0) {
    console.log(`⚠️ No reservations on ${date}`);
    return;
  }

  const total = reservations.reduce((sum, r) => {
    return sum + parseFloat(r.Menu?.price || 0);
  }, 0);

  console.log(`\n📅 Date: ${date}`);
  console.log(`📦 Reservations: ${reservations.length}`);
  console.log(`💰 Total CA: ${total.toFixed(0)} FCFA`);
}

module.exports = {
    manageFinance
};