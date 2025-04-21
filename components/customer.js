// Add function to manage customers
const { Customer } = require('../models');
const { ask } = require('./common');

async function manageCustomers() {
    console.log('\n--- Manage Customers ---');
    console.log('1. Create a customer');
    console.log('2. List customers');
    console.log('3. Back to main menu');
  
    const choice = await ask('Your choice: ');
  
    switch (choice) {
      case '1': {
        await createCustomer();
        break;
      }
      case '2':
        await listCustomers();
        break;
      case '3':
        return;
      default:
        console.log('❌ Invalid option.');
    }
  
    await manageCustomers(); // Repeat submenu
}

async function createCustomer() {
  console.log('\n📝 Create a new customer');

  let firstname;
  do {
    firstname = await ask('First name: ');
    if (!firstname) console.log('❌ First name cannot be empty.');
  } while (!firstname);

  let lastname;
  do {
    lastname = await ask('Last name: ');
    if (!lastname) console.log('❌ Last name cannot be empty.');
  } while (!lastname);

  let email;
  do {
    email = await ask('Email: ');
    if (!email) {
      console.log('❌ Email is required.');
    }
  } while (!email);

  let phonenumber;
  do {
    phonenumber = await ask('Phone number: ');
    if (!phonenumber) {
      console.log('❌ Phone number is required.');
    }
  } while (!phonenumber);

  const customer = await Customer.create({ firstname, lastname, email, phonenumber });
  console.log('\n✅ Customer created:');
  console.log(customer.toJSON());
}

async function listCustomers() {
  console.log('\n📋 List of customers');

  const customers = await Customer.findAll();

  if (customers.length === 0) {
    console.log('⚠️ No customers found.');
    return;
  }

  console.log(
    'First name'.padEnd(15) +
    'Last name'.padEnd(15) +
    'Email'.padEnd(30) +
    'Phone'.padEnd(20)
  );
  console.log('-'.repeat(80));

  customers.forEach(c => {
    console.log(
      String(c.firstname).padEnd(15) +
      String(c.lastname).padEnd(15) +
      String(c.email).padEnd(30) +
      String(c.phonenumber).padEnd(20)
    );
  });
}

module.exports = {
    manageCustomers,
    createCustomer,
    listCustomers
};
