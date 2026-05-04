import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {

  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);

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

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  const isLoggedIn = userData && userData.name !== 'Not logged in';

  return (
    <div className="page-padding">
      <h1>Profile</h1>
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Role: {userData.role}</p>
      </div>

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
    </div>
  );
}

export default Profile;