import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const LAST_SEEN_KEY = 'notifsLastSeen';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const tabs = [
    { to: '/community', label: 'Community', icon: '💬', tourClass: `nav-community` },
    { to: '/notifications', label: 'Notifications', icon: '🔔', tourClass: `nav-notifications` },
    { to: '/map', label: 'Map', icon: '📍', tourClass: `nav-map` },
    { to: '/info', label: 'Info', icon: '📖', tourClass: `nav-info` },
    { to: '/profile', label: 'Profile', icon: '👤', tourClass: `nav-profile` },
  ];

  useEffect(() => {
    if (!userData) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${API_URL}/replies/notifications`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          setUnreadCount(0);
          return;
        }

        const data = await response.json();

        // Read last seen timestamp from localStorage
        const lastSeen = parseInt(localStorage.getItem(LAST_SEEN_KEY) || '0', 10);

        // Flatten all replies from both groups and count those newer than lastSeen
        const allReplies = (data.myPosts || []).flatMap((g) => g.replies);

        const unread = allReplies.filter((reply) => {
          const replyTime = new Date(reply.createdAt).getTime();
          return replyTime > lastSeen;
        }).length;

        setUnreadCount(unread);

      } catch (err) {
        console.error('Error fetching notification count:', err);
        setUnreadCount(0);
      }
    };

    // re-fetch on every page change
    fetchUnreadCount();
  }, [userData, location.pathname]);

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

  const formatBadgeCount = (count) => {
    if (count <= 0) return null;
    if (count > 99) return '99+';
    return String(count);
  };


  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => {
        const showBadge = tab.to === '/notifications' && unreadCount > 0;
        const badgeText = formatBadgeCount(unreadCount);

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            onClick={tab.to === '/profile' ? checkProfileLogin : undefined}
            className={({ isActive }) =>
              `${isActive ? 'bottom-nav-item active' : 'bottom-nav-item'} ${tab.tourClass}`
            }
          >
            {/* wrap icon to allow badge positioning */}
            <span className="bottom-nav-icon-wrap">
              <span className="bottom-nav-item-icon" aria-hidden="true">
                {tab.icon}
              </span>
              {showBadge && (
                <span
                  className="bottom-nav-badge"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {badgeText}
                </span>
              )}
            </span>
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNav;
