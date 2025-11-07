import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/mockApi'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const nav = useNavigate()
  const user = JSON.parse(localStorage.getItem('ecom_user') || 'null')
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      nav('/login')
    }
  }, [user, nav])

  if (!user || user.role !== 'admin') return null

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
          {['overview', 'vendors', 'products', 'orders'].map(tab => (
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

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'vendors' && <VendorsTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <OrdersTab />}
      </div>
    </div>
  )
}

function OverviewTab() {
  const orders = api.orders()
  const products = api.products()
  const pendingVendors = api.getPendingVendors()

  return (
    <div>
      <div className="grid">
        <div className="card">
          <h3>Sales Summary</h3>
          <p className="small">Total products: {products.length}</p>
          <p className="small">Total orders: {orders.length}</p>
          <p className="small">Pending vendors: {pendingVendors.length}</p>
        </div>
        <div className="card">
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <button className="button">Export Sales Report</button>
            <button className="button secondary">View System Logs</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function VendorsTab() {
  const pendingVendors = api.getPendingVendors()

  return (
    <div>
      <h3>Pending Vendor Applications</h3>
      <div className="grid">
        {pendingVendors.map(vendor => (
          <div key={vendor.id} className="card">
            <h4>{vendor.companyDetails.name}</h4>
            <p className="small">Email: {vendor.email}</p>
            <p className="small">Registration: {vendor.companyDetails.registrationNumber}</p>
            <p className="small">Address: {vendor.companyDetails.address}</p>
            <p className="small">Description: {vendor.companyDetails.description}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                className="button"
                onClick={() => {
                  try {
                    api.approveVendor(vendor.id)
                    alert('Vendor approved successfully')
                    window.location.reload()
                  } catch (e) {
                    alert(e.message)
                  }
                }}
              >
                Approve
              </button>
              <button 
                className="button secondary"
                onClick={() => {
                  if (confirm('Are you sure you want to reject this vendor?')) {
                    api.rejectVendor(vendor.id)
                    alert('Vendor rejected')
                    window.location.reload()
                  }
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
        {pendingVendors.length === 0 && (
          <p className="small">No pending vendor applications</p>
        )}
      </div>
    </div>
  )
}

function ProductsTab() {
  const products = api.products()
  
  return (
    <div>
      <h3>All Products</h3>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <h4>{p.title}</h4>
            <p className="small">Price: ${p.price}</p>
            <p className="small">Stock: {p.stock}</p>
            <p className="small">Status: {p.status}</p>
            <div style={{ marginTop: '12px' }}>
              <button className="button secondary">Review Product</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersTab() {
  const orders = api.orders()
  
  return (
    <div>
      <h3>Recent Orders</h3>
      {orders.slice().reverse().map(o => (
        <div key={o.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="small">Order {o.id} • {o.email}</div>
              <div>Status: {o.status}</div>
            </div>
            <button className="button secondary">Details</button>
          </div>
        </div>
      ))}
    </div>
  )
}
