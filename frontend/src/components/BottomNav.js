import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function BottomNav() {
  const navigate = useNavigate();

  const tabs = [
    { to: '/community', label: 'Community', icon: '💬', tourClass: `nav-community` },
    { to: '/notifications', label: 'Notifications', icon: '🔔', tourClass: `nav-notifications` },
    { to: '/map', label: 'Map', icon: '📍', tourClass: `nav-map` },
    { to: '/info', label: 'Info', icon: '📖', tourClass: `nav-info` },
    { to: '/profile', label: 'Profile', icon: '👤', tourClass: `nav-profile` },
  ];

  const checkProfileLogin = async (e) => {
    if (e.currentTarget.getAttribute('href') === '/profile') {
      e.preventDefault();

      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          navigate('/profile');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking login:', error);
        navigate('/');
      }
    }
  };


  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          onClick={tab.to === '/profile' ? checkProfileLogin : undefined}
          className={({ isActive }) =>
            `${isActive ? 'bottom-nav-item active' : 'bottom-nav-item'} ${tab.tourClass}`
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