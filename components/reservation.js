// Add function to manage reservations
const { Reservation, Customer, Table, Menu } = require('../models');
const { ask, daysOfWeek } = require('./common');

async function manageReservations() {
    console.log('\n--- Manage Reservations ---');
    console.log('1. Create a Reservation');
    console.log('2. List Reservations');
    console.log('3. Detail of a reservation');
    console.log('4. Update a reservation');
    console.log('5. Delete a reservation');
    console.log('6. Back to main menu');
  
    const choice = await ask('Your choice: ');
  
    switch (choice) {
        case '1': {
            await createReservation();
            break;
        }
        case '2':
            await listReservations();
            break;
        case '3':
            await viewReservation();
            break;
        case '4':
            await updateReservation();
            break;
        case '5':
            await deleteReservation();
            break;
        case '6':
            return;
        default:
            console.log('❌ Invalid option.');
    }
  
    await manageReservations(); // Repeat submenu
}

async function createReservation() {
    console.log('\n📅 Create a reservation');
  
    // 1. Select customer
    const customers = await Customer.findAll();
    if (customers.length === 0) {
      console.log('❌ No customers found. Please create one first.');
      return;
    }
  
    console.log('\n👥 Customers:');
    customers.forEach((c, i) => {
      console.log(`${i + 1}. ${c.firstname} ${c.lastname} (${c.email})`);
    });
  
    let customerIndex;
    do {
      const input = await ask('Select a customer by number: ');
      customerIndex = parseInt(input);
    } while (
      isNaN(customerIndex) ||
      customerIndex < 1 ||
      customerIndex > customers.length
    );
  
    const customer = customers[customerIndex - 1];
  
    // 2. Ask for date
    let date;
    do {
      date = await ask('Enter reservation date (YYYY-MM-DD): ');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.log('❌ Invalid date format.');
        date = null;
      }
    } while (!date);

      // 3. Determine day of week (1 = Monday ... 7 = Sunday)
    const jsDay = new Date(date).getDay(); // 0 (Sunday) to 6 (Saturday)
    const postgresDay = jsDay === 0 ? 7 : jsDay; // Convert Sunday to 7

    const menu = await Menu.findOne({ where: { day: postgresDay } });

    if (!menu) {
        const readableDay = daysOfWeek[postgresDay] || 'Unknown';
        console.log(`❌ No menu available for that day (${readableDay}).`);
        return;
    }
  
    // 4. Find available tables
    const allTables = await Table.findAll();
    const reservedTables = await Reservation.findAll({
      where: { date },
      attributes: ['tableId']
    });
  
    const reservedTableIds = reservedTables.map(r => r.tableId);
    const availableTables = allTables.filter(t => !reservedTableIds.includes(t.id));
  
    if (availableTables.length === 0) {
      console.log('❌ No available tables for that date.');
      return;
    }
  
    console.log('\n🍽️ Available tables:');
    availableTables.forEach((t, i) => {
      console.log(`${i + 1}. ${t.name}`);
    });
  
    let tableIndex;
    do {
      const input = await ask('Select a table by number: ');
      tableIndex = parseInt(input);
    } while (
      isNaN(tableIndex) ||
      tableIndex < 1 ||
      tableIndex > availableTables.length
    );
  
    const table = availableTables[tableIndex - 1];
  
    // 5. Create reservation
    const reservation = await Reservation.create({
      date,
      customerId: customer.id,
      tableId: table.id,
      menuId: menu.id
    });
  
    console.log('\n✅ Reservation created:');
    console.log(reservation.toJSON());
}

async function listReservations() {
    console.log('\n📋 List of reservations');
  
    const reservations = await Reservation.findAll({
      include: [Customer, Table, Menu],
      order: [['date', 'ASC']]
    });
  
    if (reservations.length === 0) {
      console.log('⚠️ No reservations found.');
      return;
    }
  
    console.log(
      'ID'.padEnd(5) +
      'Customer'.padEnd(25) +
      'Date'.padEnd(15) +
      'Table'.padEnd(20) +
      'Menu'.padEnd(25)
    );
    console.log('-'.repeat(90));
  
    reservations.forEach(r => {
      console.log(
        String(r.id).padEnd(5) +
        `${r.Customer.firstname} ${r.Customer.lastname}`.padEnd(25) +
        r.date.padEnd(15) +
        r.Table.name.padEnd(20) +
        r.Menu.name.padEnd(25)
      );
    });
}

async function viewReservation() {
    console.log('\n🔍 View a reservation');
  
    const reservations = await Reservation.findAll({
      include: [Customer, Table, Menu],
      order: [['date', 'ASC']]
    });
  
    if (reservations.length === 0) {
      console.log('⚠️ No reservations available.');
      return;
    }
  
    reservations.forEach(r => {
      console.log(`${r.id}. ${r.date} - ${r.Customer.firstname} ${r.Customer.lastname}`);
    });
  
    const input = await ask('Enter reservation ID: ');
    const reservationId = parseInt(input);
  
    if (isNaN(reservationId)) {
      console.log('❌ Invalid ID.');
      return;
    }
  
    const r = await Reservation.findByPk(reservationId, {
      include: [Customer, Table, Menu]
    });
  
    if (!r) {
      console.log('❌ Reservation not found.');
      return;
    }
  
    const jsDay = new Date(r.date).getDay();
    const day = jsDay === 0 ? 7 : jsDay;
  
    console.log(`\n📋 Reservation #${r.id}`);
    console.log(`Customer : ${r.Customer.firstname} ${r.Customer.lastname}`);
    console.log(`Email    : ${r.Customer.email}`);
    console.log(`Phone    : ${r.Customer.phonenumber}`);
    console.log(`Date     : ${r.date} (${daysOfWeek[day]})`);
    console.log(`Table    : ${r.Table.name} - ${r.Table.description}`);
    console.log(`Menu     : ${r.Menu.name}`);
}

async function updateReservation() {
    console.log('\n✏️ Update a reservation');
  
    const reservations = await Reservation.findAll({
      include: [Customer, Table, Menu],
      order: [['date', 'ASC']]
    });
  
    if (reservations.length === 0) {
      console.log('⚠️ No reservations to update.');
      return;
    }
  
    reservations.forEach(r => {
      console.log(`${r.id}. ${r.date} - ${r.Customer.firstname} ${r.Customer.lastname}`);
    });
  
    const input = await ask('Enter reservation ID to update: ');
    const reservationId = parseInt(input);
  
    const reservation = await Reservation.findByPk(reservationId, {
      include: [Customer, Table, Menu]
    });
  
    if (!reservation) {
      console.log('❌ Reservation not found.');
      return;
    }
  
    console.log(`\nCurrent reservation: ${reservation.date} | ${reservation.Table.name} | ${reservation.Customer.firstname} ${reservation.Customer.lastname}`);
  
    // 1. Change customer
    const customers = await Customer.findAll();
    customers.forEach((c, i) => {
      console.log(`${i + 1}. ${c.firstname} ${c.lastname}`);
    });
  
    const customerInput = await ask('Select new customer (or press ENTER to keep current): ');
    let newCustomerId = reservation.customerId;
    if (customerInput.trim()) {
      const customerIndex = parseInt(customerInput);
      if (customerIndex >= 1 && customerIndex <= customers.length) {
        newCustomerId = customers[customerIndex - 1].id;
      }
    }
  
    // 2. Change date
    const newDateInput = await ask(`New date (YYYY-MM-DD) or ENTER to keep [${reservation.date}]: `);
    let newDate = reservation.date;
    if (newDateInput.trim()) {
      newDate = newDateInput;
      // Check if a menu exists for that day
      const jsDay = new Date(newDate).getDay();
      const day = jsDay === 0 ? 7 : jsDay;
      const menu = await Menu.findOne({ where: { day } });
      if (!menu) {
        console.log('❌ No menu for that day. Canceling update.');
        return;
      }
      reservation.menuId = menu.id;
    }
  
    // 3. Change table (check availability)
    const allTables = await Table.findAll();
    const reservedTables = await Reservation.findAll({
      where: {
        date: newDate,
        id: { [Op.ne]: reservationId }
      },
      attributes: ['tableId']
    });
    const reservedIds = reservedTables.map(r => r.tableId);
    const availableTables = allTables.filter(t => !reservedIds.includes(t.id));
  
    availableTables.forEach((t, i) => {
      console.log(`${i + 1}. ${t.name} - ${t.description}`);
    });
  
    const tableInput = await ask('Select new table (or ENTER to keep current): ');
    let newTableId = reservation.tableId;
    if (tableInput.trim()) {
      const tableIndex = parseInt(tableInput);
      if (tableIndex >= 1 && tableIndex <= availableTables.length) {
        newTableId = availableTables[tableIndex - 1].id;
      }
    }
  
    // Update reservation
    await reservation.update({
      customerId: newCustomerId,
      date: newDate,
      tableId: newTableId
    });
  
    console.log('✅ Reservation updated.');
}

async function deleteReservation() {
    console.log('\n🗑️ Delete a reservation');
  
    const reservations = await Reservation.findAll({
      include: [Customer, Table],
      order: [['date', 'ASC']]
    });
  
    if (reservations.length === 0) {
      console.log('⚠️ No reservations to delete.');
      return;
    }
  
    reservations.forEach(r => {
      console.log(`${r.id}. ${r.date} - ${r.Customer.firstname} ${r.Customer.lastname}`);
    });
  
    const input = await ask('Enter reservation ID to delete: ');
    const reservationId = parseInt(input);
  
    const reservation = await Reservation.findByPk(reservationId);
  
    if (!reservation) {
      console.log('❌ Reservation not found.');
      return;
    }
  
    await reservation.destroy();
    console.log('✅ Reservation deleted.');
}

module.exports = {
    manageReservations
};
