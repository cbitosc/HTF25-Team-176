/*
 Simple in-memory mock "API" using localStorage.
 Provides products, cart, wishlist, orders, and simple auth.
*/
const STORAGE_KEY = 'ecom_mock_v2'

function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

function read(){
  const raw = localStorage.getItem(STORAGE_KEY)
  if(!raw){
    const seed = {
      users: [
        {
          id: 1,
          email: 'seller@shop.com',
          password: 'seller123', // In real app, this would be hashed
          role: 'vendor',
          status: 'approved',
          companyDetails: {
            name: 'Tech Gadgets Inc',
            registrationNumber: 'REG123456',
            address: '123 Tech Street, Silicon Valley',
            description: 'Premium electronics retailer'
          }
        },
        {
          id: 2,
          email: 'admin@shop.com',
          password: 'admin123',
          role: 'admin'
        },
        {
          id: 3,
          email: 'user@shop.com',
          password: 'user123',
          role: 'customer'
        }
      ],
      products: [
        {id: 1, title: 'Wireless Headphones', price: 59, stock: 10, vendorId: 1, status: 'approved'},
        {id: 2, title: 'Smart Watch', price: 129, stock: 5, vendorId: 1, status: 'approved'},
        {id: 3, title: 'Running Shoes', price: 89, stock: 20, vendorId: 1, status: 'approved'}
      ],
      pendingVendors: [],
      cart: [],
      wishlist: [],
      orders: [],
      coupons: [{code:'WELCOME10',percent:10}]
    }
    localStorage.setItem(STORAGE_KEY,JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw)
}
function write(data){ localStorage.setItem(STORAGE_KEY,JSON.stringify(data)) }
export const api = {
  // Authentication methods
  login(email, password) {
    const data = read()
    const user = data.users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid credentials')
    return user
  },

  register(email, password, role) {
    const data = read()
    if (data.users.some(u => u.email === email)) {
      throw new Error('Email already registered')
    }
    const user = {
      id: generateId(),
      email,
      password,
      role,
      status: 'active'
    }
    data.users.push(user)
    write(data)
    return user
  },

  registerVendor(email, password, companyDetails) {
    const data = read()
    if (data.users.some(u => u.email === email)) {
      throw new Error('Email already registered')
    }
    const vendor = {
      id: generateId(),
      email,
      password,
      role: 'vendor',
      status: 'pending',
      companyDetails
    }
    data.pendingVendors.push(vendor)
    write(data)
    return vendor
  },

  // Admin methods
  getPendingVendors() {
    return read().pendingVendors
  },

  approveVendor(vendorId) {
    const data = read()
    const vendorIndex = data.pendingVendors.findIndex(v => v.id === vendorId)
    if (vendorIndex === -1) throw new Error('Vendor not found')
    
    const vendor = data.pendingVendors[vendorIndex]
    vendor.status = 'approved'
    data.users.push(vendor)
    data.pendingVendors.splice(vendorIndex, 1)
    write(data)
    return vendor
  },

  rejectVendor(vendorId) {
    const data = read()
    const vendorIndex = data.pendingVendors.findIndex(v => v.id === vendorId)
    if (vendorIndex === -1) throw new Error('Vendor not found')
    data.pendingVendors.splice(vendorIndex, 1)
    write(data)
  },

  // Product methods
  products(filters = {}) {
    const data = read()
    return data.products.filter(p => {
      if (filters.vendorId && p.vendorId !== filters.vendorId) return false
      if (filters.status && p.status !== filters.status) return false
      return true
    })
  },

  getProduct(id) {
    return read().products.find(p => p.id === id)
  },
  addToCart(prodId, qty=1){
    const data = read()
    const p = data.products.find(x=>x.id===prodId)
    if(!p || p.stock < qty) throw new Error('Out of stock')
    const existing = data.cart.find(c=>c.productId===prodId)
    if(existing) existing.qty += qty; else data.cart.push({productId:prodId,qty})
    write(data)
    return data.cart
  },
  removeFromCart(prodId){
    const data = read()
    data.cart = data.cart.filter(c=>c.productId!==prodId)
    write(data); return data.cart
  },
  toggleWishlist(prodId){
    const data = read()
    if(data.wishlist.includes(prodId)) data.wishlist = data.wishlist.filter(x=>x!==prodId)
    else data.wishlist.push(prodId)
    write(data); return data.wishlist
  },
  getCart(){ return read().cart },
  applyCoupon(code){
    const data = read()
    const c = data.coupons.find(x=>x.code===code)
    return c || null
  },
  placeOrder(userEmail, address, couponCode=null){
    const data = read()
    // check stock and decrement
    for(const item of data.cart){
      const prod = data.products.find(p=>p.id===item.productId)
      if(!prod || prod.stock < item.qty) throw new Error('Insufficient stock for ' + prod?.title)
    }
    // decrement
    for(const item of data.cart){
      const prod = data.products.find(p=>p.id===item.productId)
      prod.stock -= item.qty
    }
    const order = {id:Date.now(),items:data.cart, email:userEmail, address, status:'Placed', createdAt:new Date().toISOString(), coupon:couponCode}
    data.orders.push(order)
    data.cart = []
    write(data)
    return order
  },
  orders(){ return read().orders },
  addProduct(product) {
    const data = read()
    product.id = Math.max(0, ...data.products.map(p => p.id)) + 1
    product.createdAt = new Date().toISOString()
    product.status = 'pending' // All products need admin approval
    data.products.push(product)
    write(data)
    return product
  },

  updateProduct(updated) {
    const data = read()
    const idx = data.products.findIndex(p => p.id === updated.id)
    if (idx >= 0) {
      updated.updatedAt = new Date().toISOString()
      if (updated.price !== data.products[idx].price || updated.title !== data.products[idx].title) {
        updated.status = 'pending' // Changes require re-approval
      }
      data.products[idx] = updated
    }
    write(data)
    return updated
  },

  approveProduct(productId) {
    const data = read()
    const product = data.products.find(p => p.id === productId)
    if (!product) throw new Error('Product not found')
    product.status = 'approved'
    write(data)
    return product
  },

  rejectProduct(productId) {
    const data = read()
    const idx = data.products.findIndex(p => p.id === productId)
    if (idx >= 0) data.products.splice(idx, 1)
    write(data)
  },

  // Sales Analytics
  getVendorStats(vendorId) {
    const data = read()
    const products = data.products.filter(p => p.vendorId === vendorId)
    const orders = data.orders.filter(o => 
      o.items.some(item => {
        const product = products.find(p => p.id === item.productId)
        return product !== undefined
      })
    )

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'approved').length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => {
          const product = products.find(p => p.id === item.productId)
          return product ? itemSum + (product.price * item.qty) : itemSum
        }, 0)
        return sum + orderTotal
      }, 0)
    }
  }
}
