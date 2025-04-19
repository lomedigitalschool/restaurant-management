// Add function to manage menus, products
const { Menu, Product, MenuProduct } = require('../models');
const { ask } = require('./common');
const { createProduct, listProducts } = require('./product');

const daysOfWeek = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
};

async function manageMenus() {
    console.log('\n--- Manage Menus ---');
    console.log('1. Create a product');
    console.log('2. List products');
    console.log('3. Create a menu');
    console.log('4. List of menus');
    console.log('5. Detail of a menu');
    console.log('6. Back to main menu');
  
    const choice = await ask('Your choice: ');
  
    switch (choice) {
        case '1': {
            await createProduct();
            break;
        }
        case '2':
            await listProducts();
            break;
        case '3':
            await createMenu();
            break;
        case '4':
            await listMenus();
            break;
        case '5':
            await viewMenu();
            break;
        case '6':
            return;
        default:
            console.log('❌ Invalid option.');
    }
  
    await manageMenus(); // Repeat submenu
}

async function createMenu() {
    console.log('\n📝  Create menu');

    // 1. Name (required)
    let name;
    do {
        name = await ask('Menu name (required): ');
        if (!name) console.log('❌ Name cannot be empty.');
    } while (!name);

     // 2. Description (optional)
    const description = await ask('Description (optional): ');

    // 3. Choose the day (required)
    let day;
    do {
        const input = await ask('Day of the menu (1 = Monday, 7 = Sunday): ');
        day = parseInt(input);
        if (isNaN(day) || day < 1 || day > 7) {
        console.log('❌ Invalid day. Enter a number between 1 and 7.');
        day = null;
        }
    } while (!day);

    // 4. Price (required)
    let price;
    do {
        const input = await ask('Menu price (required): ');
        price = parseFloat(input);
        if (isNaN(price) || price <= 0) {
        console.log('❌ Invalid price. Must be a positive number.');
        price = null;
        }
    } while (!price);

    // 5. Select products
    const products = await Product.findAll();
    if (products.length === 0) {
        console.log('❌ No products available. Please create products first.');
        return;
    }

    console.log('\n📦 Available products:');
    products.forEach(p => {
        console.log(`${p.id}. ${p.name}`);
    });

    const productInput = await ask('Select product IDs (comma-separated, e.g. 1,2,3): ');
    const selectedIds = productInput
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

    const selectedProducts = await Product.findAll({
        where: { id: selectedIds }
    });

    // 6. Create menu and associate products
    const menu = await Menu.create({ name, description, day, price });
    await menu.addProducts(selectedProducts);

    console.log('\n✅ Menu created successfully:');
    console.log(menu.toJSON());
}

function formatText(text, length = 20) {
    if (!text) return ''.padEnd(length);
    const trimmed = text.length > length ? text.slice(0, length - 1) + '…' : text;
    return trimmed.padEnd(length);
}
  
async function listMenus() {
    console.log('\n📋 List menus');

    const menus = await Menu.findAll();

    if (menus.length === 0) {
        console.log('⚠️ No menus found.');
        return;
    }

    const nameWidth = 25;
    const descriptionWidth = 25;
    const dayWidth = 15;
    const priceWidth = 10;

    console.log(
        'Name'.padEnd(nameWidth) +
        'Description'.padEnd(descriptionWidth) +
        'Day'.padEnd(dayWidth) +
        'Price'.padEnd(priceWidth)
    );
    console.log('-'.repeat(nameWidth + descriptionWidth + dayWidth + priceWidth));

    menus.forEach(menu => {
        const readableDay = daysOfWeek[menu.day] || 'Unknown';

        console.log(
        formatText(menu.name, nameWidth) +
        formatText(menu.description, descriptionWidth) +
        formatText(readableDay, dayWidth) +
        String(menu.price || '' + 'FCFA').padEnd(priceWidth)
        );
    });
}

async function viewMenu() {
    console.log('\n🔍 View menu details');
  
    // Show available menus first
    const menus = await Menu.findAll();
    if (menus.length === 0) {
      console.log('⚠️ No menus found.');
      return;
    }
  
    menus.forEach(menu => {
      console.log(`${menu.id}. ${menu.name}`);
    });
  
    const input = await ask('Enter the menu ID to view: ');
    const menuId = parseInt(input);
  
    if (isNaN(menuId)) {
      console.log('❌ Invalid ID');
      return;
    }
  
    const menu = await Menu.findByPk(menuId, {
      include: Product
    });
  
    if (!menu) {
      console.log('❌ Menu not found.');
      return;
    }
  
    console.log(`\n📋 Menu Details (#${menu.id})`);
    console.log(`Name       : ${menu.name}`);
    console.log(`Description: ${menu.description || '-'}`);
    console.log(`Day        : ${daysOfWeek[menu.day] || 'Unknown'}`);
    console.log(`Price      : ${menu.price} FCFA \n`);
  
    console.log('📦 Products in this menu:');
    console.log(`→ Products found: ${menu.Products?.length}`);
    if (menu.Products?.length === 0) {
      console.log('  - No products linked.');
    } else {
      menu.Products?.forEach(p => {
        console.log(`  - ${p.name}: ${p.description || ''}`);
      });
    }
  }

module.exports = {
    manageMenus
};