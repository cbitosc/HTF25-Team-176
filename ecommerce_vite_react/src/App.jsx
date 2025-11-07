import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import VendorDashboard from './pages/VendorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { api } from './lib/mockApi'

export default function App(){
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('ecom_user') || 'null')
  const cartItems = api.getCart()
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div>
      <nav className="nav">
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--accent)' }}>
          ShopHub
        </div>
        <Link to="/" style={{ color: location.pathname === '/' ? 'var(--accent)' : undefined }}>
          Home
        </Link>
        <Link to="/cart" style={{ 
          color: location.pathname === '/cart' ? 'var(--accent)' : undefined,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Cart
          {cartCount > 0 && (
            <span style={{
              background: 'var(--accent)',
              color: 'white',
              borderRadius: '9999px',
              padding: '2px 6px',
              fontSize: '0.75rem'
            }}>
              {cartCount}
            </span>
          )}
        </Link>
        
        {user ? (
          <>
            <Link to="/profile" style={{ color: location.pathname === '/profile' ? 'var(--accent)' : undefined }}>
              Profile
            </Link>
            <Link to="/orders" style={{ color: location.pathname === '/orders' ? 'var(--accent)' : undefined }}>
              Orders
            </Link>
            {user.role === 'vendor' && (
              <Link to="/vendor" style={{ color: location.pathname === '/vendor' ? 'var(--accent)' : undefined }}>
                Vendor Dashboard
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: location.pathname === '/admin' ? 'var(--accent)' : undefined }}>
                Admin Dashboard
              </Link>
            )}
            <button 
              onClick={() => {
                localStorage.removeItem('ecom_user')
                window.location.reload()
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4b5563',
                fontSize: '1rem',
                padding: 0
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ marginLeft: 'auto', color: location.pathname === '/login' ? 'var(--accent)' : undefined }}>
            Login
          </Link>
        )}
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/vendor" element={<VendorDashboard/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>
      </main>
    </div>
  )
}
