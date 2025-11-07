import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/mockApi'

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('products')
  const user = JSON.parse(localStorage.getItem('ecom_user') || 'null')
  const nav = useNavigate()
  
  useEffect(() => {
    if (!user || user.role !== 'vendor' || user.status !== 'approved') {
      nav('/login')
    }
  }, [user, nav])

  if (!user || user.role !== 'vendor') return null
  if (user.status === 'pending') {
    return (
      <div className="card" style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <h2>Application Pending</h2>
        <p>Your vendor account is currently under review. We'll notify you once it's approved.</p>
        <button 
          className="button secondary" 
          onClick={() => {
            localStorage.removeItem('ecom_user')
            nav('/login')
          }}
          style={{ marginTop: '20px' }}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2>Vendor Dashboard</h2>
      
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
          {['products', 'orders', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'button' : 'button secondary'}
              style={{ margin: '0 0 -2px 0', borderRadius: '8px 8px 0 0' }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'products' && <ProductsTab user={user} />}
        {activeTab === 'orders' && <OrdersTab user={user} />}
        {activeTab === 'analytics' && <AnalyticsTab user={user} />}
      </div>
    </div>
  )
}

function ProductsTab({ user }) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  
  const products = api.products({ vendorId: user.id })

  function add(e) {
    e.preventDefault()
    try {
      api.addProduct({
        title,
        price: Number(price),
        stock: Number(stock),
        description,
        imageUrl,
        vendorId: user.id,
        status: 'pending'
      })
      alert('Product added and pending approval')
      setIsAdding(false)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Your Products</h3>
        <button className="button" onClick={() => setIsAdding(true)}>Add New Product</button>
      </div>

      {isAdding && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Add New Product</h3>
          <form onSubmit={add}>
            <div className="form-row">
              <label>Product Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Premium Wireless Headphones"
                required 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-row">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  required 
                />
              </div>
              <div className="form-row">
                <label>Stock</label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={e => setStock(e.target.value)}
                  min="0"
                  required 
                />
              </div>
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows="3"
                placeholder="Detailed product description..."
                required
              />
            </div>
            <div className="form-row">
              <label>Image URL</label>
              <input 
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button type="submit" className="button">Add Product</button>
              <button type="button" className="button secondary" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid">
        {products.map(p => (
          <div className="card" key={p.id}>
            {p.imageUrl && (
              <img 
                src={p.imageUrl} 
                alt={p.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>{p.title}</h4>
                <p className="small" style={{ margin: '0 0 4px 0' }}>Price: ${p.price}</p>
                <p className="small" style={{ margin: '0 0 4px 0' }}>Stock: {p.stock}</p>
                <p className="small" style={{ 
                  margin: '0',
                  color: p.status === 'approved' ? 'var(--forest-green)' : 'var(--pumpkin-spice)'
                }}>
                  Status: {p.status}
                </p>
              </div>
              <button className="button secondary">Edit</button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="small">No products yet. Click "Add New Product" to get started.</p>
        )}
      </div>
    </div>
  )
}

function OrdersTab({ user }) {
  const orders = api.orders().filter(o => {
    return o.items.some(item => {
      const product = api.getProduct(item.productId)
      return product.vendorId === user.id
    })
  })

  return (
    <div>
      <h3>Orders for Your Products</h3>
      {orders.map(o => (
        <div key={o.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px 0' }}>
                Order #{o.id} • {new Date(o.createdAt).toLocaleDateString()}
              </p>
              <p className="small" style={{ margin: '0 0 4px 0' }}>
                Customer: {o.email}
              </p>
              <p className="small" style={{ margin: '0' }}>
                Status: {o.status}
              </p>
            </div>
            <button className="button secondary">Details</button>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="small">No orders yet.</p>
      )}
    </div>
  )
}

function AnalyticsTab({ user }) {
  const products = api.products({ vendorId: user.id })
  const orders = api.orders().filter(o => {
    return o.items.some(item => {
      const product = api.getProduct(item.productId)
      return product.vendorId === user.id
    })
  })

  return (
    <div>
      <div className="grid">
        <div className="card">
          <h3>Quick Stats</h3>
          <p className="small">Total Products: {products.length}</p>
          <p className="small">Total Orders: {orders.length}</p>
          <p className="small">Products in Stock: {products.filter(p => p.stock > 0).length}</p>
        </div>
        <div className="card">
          <h3>Low Stock Alert</h3>
          {products.filter(p => p.stock < 5).map(p => (
            <div key={p.id} style={{ marginBottom: '8px' }}>
              <p className="small" style={{ color: 'var(--pumpkin-spice)', margin: '0' }}>
                {p.title} - Only {p.stock} left
              </p>
            </div>
          ))}
          {products.filter(p => p.stock < 5).length === 0 && (
            <p className="small">All products have sufficient stock.</p>
          )}
        </div>
      </div>
    </div>
  )
}