import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download } from 'lucide-react';

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const mockOrders = [
    {
      id: 'ORD-2025-001',
      date: '2025-10-20',
      total: 4299.99,
      status: 'delivered',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 2999.99 },
        { name: 'Phone Case', quantity: 2, price: 650.00 },
      ],
    },
    {
      id: 'ORD-2025-002',
      date: '2025-10-15',
      total: 1599.50,
      status: 'in-transit',
      items: [{ name: 'Smart Watch Band', quantity: 1, price: 1599.50 }],
    },
    {
      id: 'ORD-2025-003',
      date: '2025-10-10',
      total: 8999.00,
      status: 'processing',
      items: [{ name: 'Bluetooth Speaker', quantity: 1, price: 8999.00 }],
    },
  ];

  const filteredOrders = filterStatus === 'all'
    ? mockOrders
    : mockOrders.filter((order) => order.status === filterStatus);

  return (
    <div>
      <h1 className="profile-title">My Orders</h1>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {['all', 'processing', 'in-transit', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p style={{ fontSize: '1.125rem' }}>No orders found</p>
        </div>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 className="order-id">{order.id}</h3>
                  <p className="order-date">
                    Ordered on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`order-status status-${order.status}`}>
                    {order.status.replace('-', ' ').charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="order-total">₹{order.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '1rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: '#2E003E', margin: 0 }}>{item.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontWeight: 600, color: '#386641', margin: 0 }}>₹{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to={`/profile/orders/${order.id}`} className="btn btn-primary">
                  <Eye size={18} />
                  View Details
                </Link>
                <button className="btn btn-secondary">
                  <Download size={18} />
                  Invoice
                </button>
                {order.status === 'delivered' && (
                  <button className="btn btn-outline">Return/Exchange</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
