import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Palette, Users as UsersIcon, Package, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Custom Orders', path: '/custom-orders', icon: Palette },
    { name: 'Inventory', path: '/products', icon: Package },
    { name: 'Users', path: '/users', icon: UsersIcon },
  ];

  return (
    <div style={{ 
      width: '260px', 
      backgroundColor: 'var(--bg-secondary)', 
      color: 'white',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0
    }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '24px', margin: 0, color: 'var(--accent-secondary)' }}>AMP3DWorld</h2>
        <span style={{ fontSize: '14px', opacity: 0.8 }}>Admin Panel</span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
             <Link 
              key={link.path} 
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--accent-secondary)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontWeight: isActive ? '600' : '400'
              }}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'transparent',
          color: 'var(--accent-secondary)',
          border: '1px solid rgba(255,255,255,0.2)',
          marginTop: 'auto',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}
