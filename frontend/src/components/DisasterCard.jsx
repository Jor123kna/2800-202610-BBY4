import React from "react";

function DisasterCard({ disaster, onSelect }) {
  return (
    <button
      key={disaster.id}
      type="button"
      className="disaster-card"
      onClick={() => onSelect(disaster.id)}
      aria-label={`View ${disaster.name} guide`}
    >
      <div className="disaster-card-header">
        <div className={`disaster-card-icon ${disaster.colorClass}`} aria-hidden="true">
          {disaster.icon}
        </div>
        <div className="disaster-card-info">
          <div className="disaster-card-name">{disaster.name}</div>
          <div className="disaster-card-desc">{disaster.description}</div>
        </div>
        <div className="disaster-card-arrow" aria-hidden="true">
          ›
        </div>
      </div>

      <div className="disaster-card-tags">
        <span className={`disaster-tag ${disaster.colorClass}`}>Before</span>
        <span className={`disaster-tag ${disaster.colorClass}`}>During</span>
        <span className={`disaster-tag ${disaster.colorClass}`}>After</span>
      </div>
    </button>
  );
}

export default DisasterCard;
