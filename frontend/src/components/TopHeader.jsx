import React from 'react';
import { useNavigate } from 'react-router-dom';

function TopHeader({ showBack = false, title = 'RouteRelief' }) {
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-inverse)',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ←
          </button>
        )}
        <span>{title}</span>
      </div>
    </header>
  );
}

export default TopHeader;