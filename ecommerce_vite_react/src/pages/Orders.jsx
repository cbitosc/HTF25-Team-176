import React from 'react'
import { api } from '../lib/mockApi'

export default function Orders(){
  const orders = api.orders().filter(o=>{
    const user = JSON.parse(localStorage.getItem('ecom_user')||'null')
    if(!user) return false
    if(user.role==='admin') return true
    return o.email === user.email
  })
  return (
    <div>
      <h2>Orders</h2>
      {orders.length===0 && <p>No orders</p>}
      {orders.map(o=>(
        <div key={o.id} className="card">
          <div className="small">Order: {o.id} • {new Date(o.createdAt).toLocaleString()}</div>
          <div>Status: {o.status}</div>
          <div className="small">Items: {o.items.map(i=>i.productId).join(', ')}</div>
        </div>
      ))}
    </div>
  )
}
