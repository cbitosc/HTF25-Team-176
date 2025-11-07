const express = require('express');
const db = require('../database');

const router = express.Router();

// Middleware to verify JWT token (simplified for this example)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // For simplicity, we'll assume token is valid and contains user id
  // In production, you'd verify the JWT properly
  try {
    // This is a placeholder - in real implementation, decode JWT
    req.user = { id: 1 }; // Mock user ID
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT c.id, c.quantity, c.added_at,
           p.id as product_id, p.name, p.price, p.image_url, p.vendor_id,
           u.name as vendor_name
    FROM carts c
    JOIN products p ON c.product_id = p.id
    JOIN users u ON p.vendor_id = u.id
    WHERE c.user_id = ?
  `;

  db.all(query, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ cart: rows });
  });
});

// Add item to cart
router.post('/add', authenticateToken, (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Check if product exists and has stock
  db.get('SELECT stock_quantity FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already in cart
    db.get('SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ?', [req.user.id, product_id], (err, cartItem) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (cartItem) {
        // Update quantity
        const newQuantity = cartItem.quantity + quantity;
        db.run('UPDATE carts SET quantity = ? WHERE id = ?', [newQuantity, cartItem.id], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update cart' });
          }
          res.json({ message: 'Cart updated successfully' });
        });
      } else {
        // Add new item
        db.run('INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to add to cart' });
          }
          res.json({ message: 'Item added to cart', cartId: this.lastID });
        });
      }
    });
  });
});

// Update cart item quantity
router.put('/update/:cartId', authenticateToken, (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }

  db.run('UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, cartId, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update cart' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart updated successfully' });
  });
});

// Remove item from cart
router.delete('/remove/:cartId', authenticateToken, (req, res) => {
  const { cartId } = req.params;

  db.run('DELETE FROM carts WHERE id = ? AND user_id = ?', [cartId, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to remove item' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  });
});

// Clear entire cart
router.delete('/clear', authenticateToken, (req, res) => {
  db.run('DELETE FROM carts WHERE user_id = ?', [req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to clear cart' });
    }

    res.json({ message: 'Cart cleared successfully' });
  });
});

module.exports = router;
