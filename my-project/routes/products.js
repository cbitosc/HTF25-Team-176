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

// Get all products
router.get('/', (req, res) => {
  const query = `
    SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock_quantity, p.created_at,
           u.name as vendor_name, u.company_name
    FROM products p
    JOIN users u ON p.vendor_id = u.id
    WHERE u.is_approved = 1
    ORDER BY p.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ products: rows });
  });
});

// Get single product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT p.*, u.name as vendor_name, u.company_name
    FROM products p
    JOIN users u ON p.vendor_id = u.id
    WHERE p.id = ? AND u.is_approved = 1
  `;

  db.get(query, [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  });
});

// Add new product (vendor only)
router.post('/', authenticateToken, (req, res) => {
  const { name, description, price, image_url, stock_quantity } = req.body;

  if (!name || !price || !stock_quantity) {
    return res.status(400).json({ error: 'Name, price, and stock quantity are required' });
  }

  if (req.user.role !== 'vendor') {
    return res.status(403).json({ error: 'Only vendors can add products' });
  }

  db.run(
    'INSERT INTO products (vendor_id, name, description, price, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, name, description || '', price, image_url || '', stock_quantity],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add product' });
      }

      res.status(201).json({
        message: 'Product added successfully',
        productId: this.lastID
      });
    }
  );
});

// Update product (vendor only)
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, stock_quantity } = req.body;

  if (req.user.role !== 'vendor') {
    return res.status(403).json({ error: 'Only vendors can update products' });
  }

  // Check if product belongs to vendor
  db.get('SELECT vendor_id FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.vendor_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own products' });
    }

    db.run(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock_quantity = ? WHERE id = ?',
      [name, description, price, image_url, stock_quantity, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update product' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
      }
    );
  });
});

// Delete product (vendor only)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'vendor') {
    return res.status(403).json({ error: 'Only vendors can delete products' });
  }

  // Check if product belongs to vendor
  db.get('SELECT vendor_id FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.vendor_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete product' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    });
  });
});

module.exports = router;
