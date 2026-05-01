import React from 'react';

function Community() {
  return (
    <div className="page-padding">
      <h1>Community</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
        Community feed - help requests and offers
      </p>
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <p>Post list will go here</p>
      </div>
    </div>
  );
}

export default Community;