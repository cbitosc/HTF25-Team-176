const db = require('./database');

setTimeout(() => {
  // Insert sample vendors first
  db.run(`INSERT INTO users (email, password, name, role, company_name, is_approved)
          VALUES ('vendor1@spookymart.com', '$2a$10$hashedpassword1', 'Ghoulish Goods Inc.', 'vendor', 'Ghoulish Goods Inc.', 1)`);

  db.run(`INSERT INTO users (email, password, name, role, company_name, is_approved)
          VALUES ('vendor2@spookymart.com', '$2a$10$hashedpassword2', 'Creepy Costumes', 'vendor', 'Creepy Costumes', 1)`);

  // Insert sample products
  db.run(`INSERT INTO products (vendor_id, name, description, price, image_url, stock_quantity)
          VALUES (1, 'Classic Pointed Witch Hat', 'A classic black witch hat perfect for Halloween', 19.99, 'https://via.placeholder.com/300x300.png?text=Witch+Hat', 50)`);

  db.run(`INSERT INTO products (vendor_id, name, description, price, image_url, stock_quantity)
          VALUES (1, 'Life-Size Posable Skeleton', 'Fully posable skeleton for decoration', 79.99, 'https://via.placeholder.com/300x300.png?text=Skeleton', 25)`);

  db.run(`INSERT INTO products (vendor_id, name, description, price, image_url, stock_quantity)
          VALUES (1, 'Bubbling Cauldron', 'Fog machine cauldron for spooky effects', 45.00, 'https://via.placeholder.com/300x300.png?text=Cauldron', 15)`);

  db.run(`INSERT INTO products (vendor_id, name, description, price, image_url, stock_quantity)
          VALUES (1, 'Pumpkin String Lights', '10ft string of pumpkin-shaped lights', 12.50, 'https://via.placeholder.com/300x300.png?text=Pumpkin+Lights', 30)`);

  db.run(`INSERT INTO products (vendor_id, name, description, price, image_url, stock_quantity)
          VALUES (2, 'Vampire Cape', 'Red velvet vampire cape with collar', 25.99, 'https://via.placeholder.com/300x300.png?text=Vampire+Cape', 20)`);

  db.run(`INSERT INTO products (vendor_id, name, description, price, image_url, stock_quantity)
          VALUES (2, 'Zombie Makeup Kit', 'Professional zombie makeup set', 35.00, 'https://via.placeholder.com/300x300.png?text=Zombie+Makeup', 12)`);

  console.log('Sample vendors and products inserted');

  // Close database connection after a delay
  setTimeout(() => {
    db.close();
  }, 1000);
}, 1000);
