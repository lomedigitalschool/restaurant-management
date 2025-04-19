// ----------------------------------------------------------------------------------------------------
// Menu will be displayed like this
// Select the option:
// 1- Manage customers
// 1-1 Create a customer
// 1-2 List of customers
// 2- Manage menus, products
// 2-1 Create a product
// 2-2 List of products
// 2-5 Create a menu
// 2-6 List of menus
// 2-7 Detail of a menu
// 2- Manage tables
// 3-1 Create a table
// 3-2 List of tables
// 4- Manage reservations
// 4-1 Create a reservation
// 4-2 List of reservations
// 4-3 Detail of a reservation
// 4-4 Update a reservation
// 4-5 Delete a reservation
// 5- CA of the day
// ----------------------------------------------------------------------------------------------------

// --------------------------Import components---------------------------------------------------------
const readline = require('readline');
const { sequelize } = require('./models');
const { manageCustomers } = require('./components/customer');
const { manageFinance } = require('./components/finance');
const { manageMenus } = require('./components/menu');
const { manageReservations} = require('./components/reservation');
const { manageTables} = require('./components/table');
const { ask, closeInterface } = require('./components/common');
// ----------------------------------------------------------------------------------------------------

// --------------------------Main menu-----------------------------------------------------------------  
  async function mainMenu() {
    console.log('\n=== RESTAURANT MANAGEMENT MENU ===');
    console.log('1. Manage customers');
    console.log('2. Manage menus');
    console.log('3. Manage tables');
    console.log('4. Manage reservations');
    console.log('5. CA of the day');
    console.log('6. Exit');
  
    const choice = await ask('\nYour choice: ');
  
    switch (choice) {
        case '1':
            await manageCustomers();
            break;
    
        case '2':
            await manageMenus();
            break;
    
        case '3':
            await manageTables();
            break;
    
        case '4':
            await manageReservations();
            break;
  
        case '5':
            await manageFinance();
            break;
  
        case '6':
            await sequelize.close();
            closeInterface();
            console.log('👋 Exiting...');
            return;
    
        default:
            console.log('❌ Invalid option.');
    }
  
    await mainMenu();
  }
// ----------------------------------------------------------------------------------------------------

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); //	Creates tables only if they don’t exist
    console.log('✅ Connected to database.');

    mainMenu();
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
  }
})();
