import React from 'react';

function Post() {
  return (
    <div className="page-padding">
      <h1>Post</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
        Create a new post
      </p>
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <p>Post creation form will go here</p>
      </div>
    </div>
  );
}

export default Post;