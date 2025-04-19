-- Table: customers
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phonenumber VARCHAR(50) UNIQUE NOT NULL
);

-- Table: cooks
CREATE TABLE cooks (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  phonenumber VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- Table: products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

-- Table: menus
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name CHAR(255) NOT NULL,
  description CHAR(255),
  day INT NOT NULL,
  price DECIMAL NOT NULL
);

-- Table: tables (restaurant tables)
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

-- Table: reservations
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  menuId INT NOT NULL REFERENCES menus(id),
  tableId INT NOT NULL REFERENCES tables(id),
  customerId INT NOT NULL REFERENCES customers(id)
);

-- Table: menuProducts (N:N between menus and products)
CREATE TABLE menuProducts (
  menuId INT NOT NULL REFERENCES menus(id),
  productId INT NOT NULL REFERENCES products(id),
  PRIMARY KEY (menuId, productId)
);

-- Table: menuCooked (N:N between menus, cooks, and reservations)
CREATE TABLE menuCooked (
  menuId INT NOT NULL REFERENCES menus(id),
  cookId INT NOT NULL REFERENCES cooks(id),  
  reservationId INT NOT NULL REFERENCES reservations(id),
  PRIMARY KEY (menuId, cookId, reservationId)
);