import React, {useState} from 'react'
import { api } from '../lib/mockApi'

export default function Cart(){
  const [coupon,setCoupon]=useState('')
  const cart = api.getCart()
  const products = api.products()
  const lineItems = cart.map(c=>({...c,product:products.find(p=>p.id===c.productId)}))
  const subtotal = lineItems.reduce((s,i)=>s + (i.product.price * i.qty),0)
  const apply = ()=>{
    const c = api.applyCoupon(coupon)
    if(!c) return alert('Invalid coupon')
    alert('Coupon applied: ' + c.code + ' - ' + c.percent + '%')
  }
  const place = ()=>{
    const user = JSON.parse(localStorage.getItem('ecom_user')||'null')
    if(!user) return alert('Login first')
    const address = prompt('Shipping address')
    if(!address) return
    try{
      const order = api.placeOrder(user.email,address,coupon||null)
      alert('Order placed: ' + order.id)
    }catch(e){ alert(e.message) }
  }
  return (
    <div>
      <h2>Cart</h2>
      <div className="card">
        {lineItems.length===0 && <p>No items in cart</p>}
        {lineItems.map(i=>(
          <div key={i.productId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div>
              <strong>{i.product.title}</strong>
              <div className="small">Qty: {i.qty} • ${i.product.price}</div>
            </div>
            <div>
              <button className="button" onClick={()=>{ api.removeFromCart(i.productId); window.location.reload() }}>Remove</button>
            </div>
          </div>
        ))}
        <hr/>
        <p className="small">Subtotal: ${subtotal}</p>
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <input placeholder="Coupon code" value={coupon} onChange={e=>setCoupon(e.target.value)} />
          <button className="button" onClick={apply}>Apply</button>
        </div>
        <div style={{marginTop:12}}>
          <button className="button" onClick={place}>Place order</button>
        </div>
      </div>
    </div>
  )
}
