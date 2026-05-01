import React from 'react';

function Info() {
  return (
    <div className="page-padding">
      <h1>Info</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
        Disaster guides and preparedness information
      </p>
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <p>Disaster guides (Flood, Earthquake, Wildfire, etc.) will go here</p>
      </div>
    </div>
  );
}

export default Info;