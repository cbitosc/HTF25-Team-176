import { NavLink, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, Heart, Settings, LogOut } from 'lucide-react';

const ProfileSidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Profile Overview', path: '/profile', icon: User },
    { name: 'My Orders', path: '/profile/orders', icon: Package },
    { name: 'Addresses', path: '/profile/addresses', icon: MapPin },
    { name: 'Payment Methods', path: '/profile/payment-methods', icon: CreditCard },
    { name: 'Wishlist', path: '/profile/wishlist', icon: Heart },
    { name: 'Settings', path: '/profile/settings', icon: Settings },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <div className="profile-sidebar">
      <div className="profile-user-info">
        <div className="profile-avatar">JD</div>
        <h3 className="profile-username">John Doe</h3>
        <p className="profile-email">john.doe@example.com</p>
      </div>

      <nav>
        <ul className="profile-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="profile-nav-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/profile'}
                  className={({ isActive }) =>
                    `profile-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="logout-btn">
        <button onClick={handleLogout} className="profile-nav-link" style={{ width: '100%' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
