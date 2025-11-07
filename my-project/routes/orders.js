const express = require('express');
const db = require('../database');

const router = express.Router();

// Middleware to verify JWT token (simplified)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Mock user for simplicity
  req.user = { id: 1, role: 'customer' };
  next();
};

// Create new order from cart
router.post('/create', authenticateToken, (req, res) => {
  // Get user's cart
  const cartQuery = `
    SELECT c.product_id, c.quantity, p.price, p.stock_quantity
    FROM carts c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.all(cartQuery, [req.user.id], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.product_id}` });
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Begin transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Create order
      db.run('INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
        [req.user.id, totalAmount, 'pending'], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to create order' });
        }

        const orderId = this.lastID;

        // Add order items
        let completed = 0;
        const totalItems = cartItems.length;

        cartItems.forEach(item => {
          db.run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderId, item.product_id, item.quantity, item.price], function(err) {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Failed to add order item' });
            }

            // Update product stock
            db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
              [item.quantity, item.product_id], (err) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to update stock' });
              }

              completed++;
              if (completed === totalItems) {
                // Clear cart
                db.run('DELETE FROM carts WHERE user_id = ?', [req.user.id], (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Failed to clear cart' });
                  }

                  db.run('COMMIT');
                  res.status(201).json({
                    message: 'Order created successfully',
                    orderId: orderId,
                    totalAmount: totalAmount
                  });
                });
              }
            });
          });
        });
      });
    });
  });
});

// Get user's orders
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT o.id, o.total_amount, o.status, o.created_at,
           COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.all(query, [req.user.id], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ orders });
  });
});

// Get order details
router.get('/:orderId', authenticateToken, (req, res) => {
  const { orderId } = req.params;

  // Get order info
  db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, req.user.id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    const itemsQuery = `
      SELECT oi.quantity, oi.price, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.all(itemsQuery, [orderId], (err, items) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ order, items });
    });
  });
});

// Update order status (for vendors/admins)
router.put('/:orderId/status', authenticateToken, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, orderId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  });
});

module.exports = router;
