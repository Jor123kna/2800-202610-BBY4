import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHint, {hints} from '../components/PageHint';


function Info() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showHint, setShowHint] = useState(true);

  // Disaster guide data
  const disasters = [
    {
      id: 'flood',
      name: 'Flood',
      icon: '🌊',
      description: 'Heavy rain, river overflow',
      colorClass: 'flood',
    },
    {
      id: 'earthquake',
      name: 'Earthquake',
      icon: '🌍',
      description: 'Ground shaking, building damage',
      colorClass: 'earthquake',
    },
    {
      id: 'wildfire',
      name: 'Wildfire',
      icon: '🔥',
      description: 'Fast-spreading fire and smoke',
      colorClass: 'wildfire',
    },
  ];

  // TODO: Disaster Detail page
  const handleDisasterClick = (disasterId) => {
    navigate(`/info/${disasterId}`);
  };

  return (
    <div className="page-padding">

      {/* Page Hint */}
      {showHint && userData?.firstTimeMode && (
        <PageHint
          message={hints['Info']}
          onClose={() => setShowHint(false)}
        />
      )}

      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Disaster Guides</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Be prepared for emergencies
        </p>
      </div>

      {/* Disaster guide cards */}
      <div className="disaster-list">
        {disasters.map((disaster) => (
          <button
            key={disaster.id}
            type="button"
            className="disaster-card"
            onClick={() => handleDisasterClick(disaster.id)}
            aria-label={`View ${disaster.name} guide`}
          >
            {/* Top row */}
            <div className="disaster-card-header">
              <div className={`disaster-card-icon ${disaster.colorClass}`} aria-hidden="true">
                {disaster.icon}
              </div>
              <div className="disaster-card-info">
                <div className="disaster-card-name">{disaster.name}</div>
                <div className="disaster-card-desc">{disaster.description}</div>
              </div>
              <div className="disaster-card-arrow" aria-hidden="true">›</div>
            </div>

            {/* Bottom row: stage tags */}
            <div className="disaster-card-tags">
              <span className={`disaster-tag ${disaster.colorClass}`}>Before</span>
              <span className={`disaster-tag ${disaster.colorClass}`}>During</span>
              <span className={`disaster-tag ${disaster.colorClass}`}>After</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Info;