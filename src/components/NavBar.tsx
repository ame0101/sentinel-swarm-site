// src/components/NavBar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Custom icon property interface
interface IconProps {
  size?: number;
  color?: string;
}

// Custom Home Icon (Landing Page)
const CustomHomeIcon: React.FC<IconProps> = ({ size = 20, color = '#FF3A00' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l9-9 9 9" />
    <path d="M9 21V9h6v12" />
  </svg>
);

// Custom Dashboard Icon
const CustomDashboardIcon: React.FC<IconProps> = ({ size = 20, color = '#FF3A00' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

// Custom Analytics Icon (if needed later)
const CustomAnalyticsIcon: React.FC<IconProps> = ({ size = 20, color = '#FF3A00' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="7" y2="12" />
    <line x1="3" y1="6" x2="7" y2="6" />
    <line x1="3" y1="18" x2="7" y2="18" />
    <line x1="10" y1="6" x2="10" y2="18" />
    <line x1="17" y1="10" x2="17" y2="18" />
    <line x1="14" y1="14" x2="14" y2="18" />
  </svg>
);

// Custom Alerts Icon
const CustomAlertsIcon: React.FC<IconProps> = ({ size = 20, color = '#FF3A00' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

const NavBar: React.FC = () => {
  const location = useLocation();

  // Define a color palette for consistency
  const colors = {
    background: '#0A0A0A',
    accent: '#FF3A00',
    text: '#FFFFFF',
    textMuted: '#AAAAAA',
  };

  // Menu items - note that "Home" now uses the root path '/'
  const menuItems = [
    { name: 'Home', path: '/', icon: <CustomHomeIcon size={20} color={colors.accent} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <CustomDashboardIcon size={20} color={colors.accent} /> },
    { name: 'Alerts', path: '/alerts', icon: <CustomAlertsIcon size={20} color={colors.accent} /> },
  ];

  return (
    <nav
      style={{
        backgroundColor: colors.background,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2px solid ${colors.accent}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* The title is clickable and links back to the landing page (root) */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: colors.accent, margin: 0, fontSize: '1.6rem' }}>
            Sentinel Swarm
          </h1>
          <p style={{ color: colors.textMuted, margin: 0, fontSize: '0.85rem' }}>Enterprise Security</p>
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isActive ? 'rgba(255, 58, 0, 0.15)' : 'transparent',
                color: isActive ? colors.accent : colors.text,
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
