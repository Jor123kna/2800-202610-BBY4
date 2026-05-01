import React from 'react';
import { NavLink } from 'react-router-dom';

function BottomNav() {
  const tabs = [
    { to: '/community', label: 'Community', icon: '💬' },
    { to: '/post',      label: 'Post',      icon: '✏️' },
    { to: '/map',       label: 'Map',       icon: '📍' },
    { to: '/info',      label: 'Info',      icon: '📖' },
    { to: '/profile',   label: 'Profile',   icon: '👤' },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            isActive ? 'bottom-nav-item active' : 'bottom-nav-item'
          }
        >
          <span className="bottom-nav-item-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;