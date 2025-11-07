import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, CreditCard } from 'lucide-react';

const ProfileOverview = () => {
  const stats = [
    { label: 'Total Orders', value: 12, icon: Package, color: '#E85D04', link: '/profile/orders' },
    { label: 'Wishlist Items', value: 5, icon: Heart, color: '#386641', link: '/profile/wishlist' },
    { label: 'Saved Addresses', value: 3, icon: MapPin, color: '#2E003E', link: '/profile/addresses' },
    { label: 'Payment Methods', value: 2, icon: CreditCard, color: '#FFD60A', link: '/profile/payment-methods' },
  ];

  const recentOrders = [
    { id: 'ORD-2025-001', date: '2025-10-20', total: 4299.99, status: 'Delivered', items: 2 },
    { id: 'ORD-2025-002', date: '2025-10-15', total: 1599.50, status: 'In Transit', items: 1 },
  ];

  return (
    <div>
      <h1 className="profile-title">Welcome Back! 👋</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="stat-card"
              style={{ borderLeftColor: stat.color }}
            >
              <div className="stat-card-content">
                <div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
                <Icon size={40} style={{ color: stat.color, opacity: 0.3 }} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: "'Lobster Two', cursive", fontSize: '1.5rem', color: '#2E003E', margin: 0 }}>
            Recent Orders
          </h2>
          <Link to="/profile/orders" style={{ color: '#E85D04', fontWeight: 600, textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        <div className="order-list">
          {recentOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 className="order-id">{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.date).toLocaleDateString()} • {order.items} items
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="order-total">₹{order.total.toFixed(2)}</p>
                  <span className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#E85D04', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
        <h3 style={{ fontFamily: "'Lobster Two', cursive", fontSize: '1.25rem', marginBottom: '1rem' }}>
          Need Help?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <button className="btn" style={{ background: 'white', color: '#2E003E' }}>Track Order</button>
          <button className="btn" style={{ background: 'white', color: '#2E003E' }}>Contact Support</button>
          <button className="btn" style={{ background: 'white', color: '#2E003E' }}>Return/Exchange</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
