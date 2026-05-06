import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);
  const [userPosts, setUserPosts] = React.useState([]);
  const [visiblePostCount, setVisiblePostCount] = React.useState(3);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/profile', {
          method: 'GET',
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data.user);

          const postsResponse = await fetch('http://localhost:5000/posts/mine', {
            method: 'GET',
            credentials: 'include'
          });

          const postsData = await postsResponse.json();

          if (postsResponse.ok) {
            setUserPosts(postsData.posts);
          } else {
            console.log(postsData.message);
          }
        } else {
          console.log(data.message);
          setUserData({
            name: 'Not logged in',
            email: '',
            role: ''
          });
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
        setUserData({
          name: 'Unable to load profile',
          email: '',
          role: ''
        });
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/logout', {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to sign out.');
        return;
      }

      localStorage.removeItem('routeReliefUser');

      setUserData({
        name: 'Not logged in',
        email: '',
        role: ''
      });

      navigate('/signin');

    } catch (error) {
      console.error('Sign out error:', error);
      alert('Something went wrong signing out.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/delete', {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to delete account.');
        return;
      }

      setUserData({
        name: 'Not logged in',
        email: '',
        role: ''
      });

      navigate('/signup');

    } catch (error) {
      console.error('Delete account error:', error);
      alert('Something went wrong deleting the account.');
    }
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleModeChange = async () => {
    if (!userData) return;

    const newMode = userData.firstTimeMode === true ? false : true;

    try {
      const response = await fetch('http://localhost:5000/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          firstTimeMode: newMode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to update profile.');
        return;
      }

      setUserData(data.user);

    } catch (error) {
      console.error('Update profile error:', error);
      alert('Something went wrong updating your profile.');
    }
  };

  const handleRoleChange = async (role) => {
    try {
      const response = await fetch('http://localhost:5000/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to update role.');
        return;
      }

      setUserData(data.user);
    } catch (error) {
      console.error('Role update error:', error);
      alert('Something went wrong updating your role.');
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to delete post.');
        return;
      }

      setUserPosts(userPosts.filter((post) => post._id !== postId));

    } catch (error) {
      console.error('Delete post error:', error);
      alert('Something went wrong deleting the post.');
    }
  };

  const handleLoadMorePosts = () => {
    setVisiblePostCount(visiblePostCount + 3);
  };

  if (!userData) {
    return (
      <div className="page-padding">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading profile...</p>
      </div>
    );
  }

  const isLoggedIn = userData && userData.name !== 'Not logged in' && userData.name !== 'Unable to load profile';
  const isFirstTimeMode = userData.firstTimeMode === true;
  const visiblePosts = userPosts.slice(0, visiblePostCount);
  const hasMorePosts = visiblePostCount < userPosts.length;

  // 🆕 ADDED: Get initials from user name (e.g., "Hailey Kim" -> "HK")
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Not logged in - show simple prompt
  if (!isLoggedIn) {
    return (
      <div className="page-padding">
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>👤</div>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Not signed in</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
            Sign in to view your profile
          </p>
          <button
            className="btn btn-primary"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // Logged in - show full profile
  return (
    <div>
      {/* Hero header with avatar */}
      <div className="profile-header">
        <div className="profile-avatar">{getInitials(userData.name)}</div>
        <div className="profile-name">{userData.name}</div>
        <div className="profile-email">{userData.email}</div>
        <div className="profile-role-badge">
          {userData.role === 'in-need' && (
            <span className="profile-role-badge-pill in-need">🆘 In Need</span>
          )}
          {userData.role === 'helper' && (
            <span className="profile-role-badge-pill helper">🤝 Helper</span>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="profile-content page-padding">

        {/* Change role section */}
        <div className="profile-section">
          <div className="profile-section-label">CHANGE ROLE</div>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-toggle-option ${userData.role === 'in-need' ? 'selected in-need' : ''}`}
              onClick={() => handleRoleChange('in-need')}
              aria-pressed={userData.role === 'in-need'}
            >
              <span className="role-toggle-icon" aria-hidden="true">🆘</span>
              <span className="role-toggle-title">I need help</span>
              <span className="role-toggle-desc">Receive support</span>
            </button>

            <button
              type="button"
              className={`role-toggle-option ${userData.role === 'helper' ? 'selected helper' : ''}`}
              onClick={() => handleRoleChange('helper')}
              aria-pressed={userData.role === 'helper'}
            >
              <span className="role-toggle-icon" aria-hidden="true">🤝</span>
              <span className="role-toggle-title">I want to help</span>
              <span className="role-toggle-desc">Offer support</span>
            </button>
          </div>
        </div>

        {/* Posts section */}
        <div className="profile-section">
          <div className="profile-section-header">
            <div className="profile-section-label">YOUR {userPosts.length === 1 ? 'POST' : 'POSTS'}</div>
            <div className="profile-section-count">
              {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
            </div>
          </div>

          {userPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true">📭</div>
              <h3 className="empty-state-title">No posts yet</h3>
              <p className="empty-state-desc">Share something with your community</p>
            </div>
          ) : (
            <div className="post-list">
              {visiblePosts.map((post) => (
                <div key={post._id} className="profile-post-item">
                  <PostCard post={{
                    ...post,
                    author: `${post.author.firstName} ${post.author.lastName}`,
                    role: post.role || post.author.role,
                    date: post.createdAt
                  }} />
                  <button
                    className="btn-link-danger"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete post
                  </button>
                </div>
              ))}

              {hasMorePosts && (
                <button
                  className="btn-secondary-block"
                  onClick={handleLoadMorePosts}
                >
                  Load {userPosts.length === 1 ? 'another post' : 'more posts'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* First-time mode toggle */}
        <div className="profile-section">
          <button
            className="btn-link"
            onClick={handleModeChange}
          >
            {isFirstTimeMode ? 'Turn off first-time mode' : 'Turn on first-time mode'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="profile-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={handleSignOut}
          >
            Sign out
          </button>

          <button
            className="btn-link-danger-center"
            onClick={handleDeleteAccount}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;