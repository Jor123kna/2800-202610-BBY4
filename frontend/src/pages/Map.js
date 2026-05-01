import React from 'react';

function Map() {
  return (
    <div className="page-padding">
      <h1>Map</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
        Evacuation routes and community centres
      </p>
      <div
        className="card"
        style={{
          marginTop: 'var(--space-4)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-surface-sunken)',
        }}
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>Map will go here</p>
      </div>
    </div>
  );
}

export default Map;