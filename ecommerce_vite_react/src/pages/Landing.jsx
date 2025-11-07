import React, { useState } from 'react'
import { api } from '../lib/mockApi'

const productImages = {
  1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  2: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  3: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
}

export default function Landing(){
  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const allProducts = api.products()
  
  const products = allProducts.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (priceFilter === 'under50' && p.price >= 50) return false
    if (priceFilter === '50to100' && (p.price < 50 || p.price > 100)) return false
    if (priceFilter === 'over100' && p.price <= 100) return false
    return true
  })

  return (
    <div>
      <div className="hero">
        <h1>Discover Amazing Products</h1>
        <p>Shop the latest collection of premium products at great prices</p>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select 
          value={priceFilter} 
          onChange={e => setPriceFilter(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="all">All Prices</option>
          <option value="under50">Under $50</option>
          <option value="50to100">$50 to $100</option>
          <option value="over100">Over $100</option>
        </select>
      </div>

      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card product-card">
            <img 
              src={productImages[p.id]} 
              alt={p.title}
              className="product-image"
            />
            <div className="product-details">
              <h3 style={{ margin: '0 0 8px 0' }}>{p.title}</h3>
              <p className="small" style={{ margin: '0 0 16px 0' }}>
                <span style={{ color: '#111827', fontSize: '1.25rem', fontWeight: 500 }}>${p.price}</span>
                <br />
                {p.stock > 0 ? (
                  <span style={{ color: '#059669' }}>✓ In stock ({p.stock})</span>
                ) : (
                  <span style={{ color: '#dc2626' }}>Out of stock</span>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button 
                className="button" 
                style={{ flex: 1 }}
                onClick={() => {
                  try {
                    api.addToCart(p.id)
                    alert('Added to cart')
                  } catch(e) {
                    alert(e.message)
                  }
                }}
                disabled={p.stock === 0}
              >
                Add to cart
              </button>
              <button 
                className="button secondary"
                onClick={() => {
                  api.toggleWishlist(p.id)
                  alert('Toggled wishlist')
                }}
              >
                ♡
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div>
            <h3>About Us</h3>
            <p className="small">We offer the best selection of premium products at great prices.</p>
          </div>
          <div>
            <h3>Customer Service</h3>
            <p className="small">
              Contact us<br />
              Shipping Info<br />
              Returns & Exchanges
            </p>
          </div>
          <div>
            <h3>Connect</h3>
            <p className="small">
              Facebook<br />
              Twitter<br />
              Instagram
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
