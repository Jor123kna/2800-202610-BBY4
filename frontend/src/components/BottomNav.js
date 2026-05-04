import React from 'react';
import { NavLink , useNavigate} from 'react-router-dom';

function BottomNav() {
  const navigate = useNavigate();

  const tabs = [
    { to: '/community', label: 'Community', icon: '💬' },
    { to: '/post',      label: 'Post',      icon: '✏️' },
    { to: '/map',       label: 'Map',       icon: '📍' },
    { to: '/info',      label: 'Info',      icon: '📖' },
    { to: '/profile',   label: 'Profile',   icon: '👤' },
  ];

 const checkProfileLogin = async (e) => {
    if (e.currentTarget.getAttribute('href') === '/profile') {
      e.preventDefault();

      try {
        const response = await fetch('http://localhost:5000/users/profile', {
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