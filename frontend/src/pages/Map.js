// import React from 'react';
import React, { useState } from 'react';
// using useSate a hook that lets thi page store checkbox on of value 

import MapComponent from '../components/MapComponent';

function Map() {
    const [showFood, setShowFood] = useState(false);
  return (
    <div className="page-padding-wide">
      <h1>Map</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
        Evacuation routes and community centres
      </p>
           <div style={{ marginTop: 'var(--space-4)' }}>
        <label>
          <input
            type="checkbox"
            checked={showFood}
            onChange={(e) => setShowFood(e.target.checked)}
          />
          {' '}Show food centres
        </label>
      </div>
      <div
        className="card"
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-3)',
        }}
      >
        <MapComponent showFood={showFood} />
      </div>
    </div>
  );
}

export default Map;