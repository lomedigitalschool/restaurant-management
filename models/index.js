// Add the sequelize models

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cook = sequelize.define('Cook', {
  firstname: { type: DataTypes.STRING(50), allowNull: false },
  lastname: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  phonenumber: { type: DataTypes.STRING(50), allowNull: false, unique: true }
  },{
    tableName: 'cooks',
    timestamps: false // 👈 disables createdAt & updatedAt 
});

const Customer = sequelize.define('Customer', {
  firstname: { type: DataTypes.STRING(50), allowNull: false },
  lastname: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  phonenumber: { type: DataTypes.STRING(50), allowNull: false, unique: true }
  },{
    tableName: 'customers',
    timestamps: false // 👈 disables createdAt & updatedAt 
});

const Menu = sequelize.define('Menu', {
  name: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.STRING(255)},
  day: {type: DataTypes.INTEGER, allowNull: false },
  price: {type: DataTypes.DECIMAL, allowNull: false}
  },{
    tableName: 'menus',
    timestamps: false // 👈 disables createdAt & updatedAt 
});

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.STRING(255) }
  },{
    tableName: 'products',
    timestamps: false // 👈 disables createdAt & updatedAt 
});

const Table = sequelize.define('Table', {
  name: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.STRING(255) }
  },{
    tableName: 'tables',
    timestamps: false // 👈 disables createdAt & updatedAt 
});

const Reservation = sequelize.define('Reservation', {
  date: {type: DataTypes.DATE, allowNull: false}
  },{
    tableName: 'reservations',
    timestamps: false // 👈 disables createdAt & updatedAt 
});

const MenuCooked = sequelize.define('menucooked', { },{
    tableName: 'menucooked',
    timestamps: false // 👈 disables createdAt & updatedAt 
});

const MenuProduct = sequelize.define('MenuProduct', {}, {
  tableName: 'menuproducts',
  timestamps: false
});

/* ========== Associations ========== */

// Reservation belongs to Menu, Table, Customer
Reservation.belongsTo(Menu, { foreignKey: 'menuId' });
Reservation.belongsTo(Table, { foreignKey: 'tableId' });
Reservation.belongsTo(Customer, { foreignKey: 'customerId' });

Menu.hasMany(Reservation, { foreignKey: 'menuId' });
Table.hasMany(Reservation, { foreignKey: 'tableId' });
Customer.hasMany(Reservation, { foreignKey: 'customerId' });

// Menu ↔ Product (N:N)
Menu.belongsToMany(Product, { through: MenuProduct, timestamps: false, foreignKey: 'menuId' });
Product.belongsToMany(Menu, { through: MenuProduct, timestamps: false, foreignKey: 'productId' });

// Menu ↔ Cook ↔ Reservation (N:N:N via MenuCooked)
Menu.belongsToMany(Cook, {
  through: MenuCooked,
  timestamps: false,
  foreignKey: 'menuId',
  otherKey: 'cookId'
});
Cook.belongsToMany(Menu, {
  through: MenuCooked,
  timestamps: false,
  foreignKey: 'cookId',
  otherKey: 'menuId'
});
MenuCooked.belongsTo(Reservation, { foreignKey: 'reservationId' });

/* ========== Export models ========== */

module.exports = {
  sequelize,
  Customer,
  Table,
  Product,
  Menu,
  Reservation,
  Cook,
  MenuCooked,
  MenuProduct
};
