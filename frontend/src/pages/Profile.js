import React from 'react';

function Profile() {
  return (
    <div className="page-padding">
      <h1>Profile</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
        Your profile and settings
      </p>
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <p>User information and settings will go here</p>
      </div>
    </div>
  );
}

export default Profile;