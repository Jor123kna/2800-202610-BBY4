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

  const handleSignOut = () => {
    localStorage.removeItem('routeReliefUser');

    setUserData({
      name: 'Not logged in',
      email: '',
      role: ''
    });

  };

  const handleDeleteAccount = async () => {
    const savedUser = localStorage.getItem('routeReliefUser');

    if (!savedUser) {
      alert('No user is currently logged in.');
      return;
    }

    const user = JSON.parse(savedUser);

    try {
      const response = await fetch(`http://localhost:5000/users/delete/${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to delete account.');
        return;
      }

      localStorage.removeItem('routeReliefUser');

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
    return <p>Loading profile...</p>;
  }

  const isLoggedIn = userData && userData.name !== 'Not logged in';
  const isFirstTimeMode = userData.firstTimeMode === true;
  const visiblePosts = userPosts.slice(0, visiblePostCount);
  const hasMorePosts = visiblePostCount < userPosts.length;

  return (
    <div className="page-padding">
      <h1>Profile</h1>
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Role: {userData.role}</p>
        {isLoggedIn && (
          <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
            <label className="input-label">Change your role</label>

            <div className="role-toggle">
              <button
                type="button"
                className={`role-toggle-option ${userData.role === 'in-need' ? 'selected in-need' : ''}`}
                onClick={() => handleRoleChange('in-need')}
                aria-pressed={userData.role === 'in-need'}
              >
                <span className="role-toggle-icon" aria-hidden="true">🆘</span>
                <span className="role-toggle-title">I need help</span>
                <span className="role-toggle-desc">Receive support from the community</span>
              </button>

              <button
                type="button"
                className={`role-toggle-option ${userData.role === 'helper' ? 'selected helper' : ''}`}
                onClick={() => handleRoleChange('helper')}
                aria-pressed={userData.role === 'helper'}
              >
                <span className="role-toggle-icon" aria-hidden="true">🤝</span>
                <span className="role-toggle-title">I want to help</span>
                <span className="role-toggle-desc">Offer support to those in need</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div className="card" style={{ marginTop: 'var(--space-4)' }}>
          <h2>Your Posts</h2>

          {userPosts.length === 0 ? (
            <p>You have not posted anything yet.</p>
          ) : (
            <>
              {visiblePosts.map((post) => (
                <div key={post._id} style={{ marginTop: 'var(--space-4)' }}>
                  <PostCard post={{
                    ...post,
                    author: `${post.author.firstName} ${post.author.lastName}`,
                    role: post.role || post.author.role,
                    date: post.createdAt
                  }} />

                  <button
                    style={{ marginTop: 'var(--space-2)' }}
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete Post
                  </button>
                </div>
              ))}

              {hasMorePosts && (
                <button
                  style={{ marginTop: 'var(--space-4)' }}
                  onClick={handleLoadMorePosts}
                >
                  Load 3 more
                </button>
              )}
            </>
          )}
        </div>
      )}

      {isLoggedIn && (
        <>

          <button
            style={{ marginTop: 'var(--space-4)' }}
            onClick={handleSignOut}
          >
            Sign Out
          </button>

          <button
            style={{ marginTop: 'var(--space-4)', marginLeft: 'var(--space-2)' }}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </>
      )}

      {!isLoggedIn && (
        <>
          <button
            style={{ marginTop: 'var(--space-4)', marginLeft: 'var(--space-2)' }}
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </>
      )}
      {isFirstTimeMode && (
        <>
          <button onClick={handleModeChange}>
            Turn off first-time mode
          </button>
        </>
      )}
      {!isFirstTimeMode && (
        <>
          <button onClick={handleModeChange}>
            Turn on first-time mode
          </button>
        </>
      )}

    </div>
  );
}

export default Profile;