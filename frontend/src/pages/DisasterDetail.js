import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DisasterDetail() {
  const { disasterId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const disasterData = {
    flood: {
      icon: '🌊',
      name: 'Flood',
      description: 'Heavy rain, river overflow',
      overview: [
        {
          icon: '📖',
          label: 'WHAT IS IT',
          colorClass: 'info',
          text: 'A flood occurs when water overflows onto normally dry land. In BC, floods are most common during winter when heavy rains overwhelm rivers and storm drains.',
        },
        {
          icon: '📍',
          label: 'RISK IN BC',
          colorClass: 'risk',
          text: 'Vancouver coastal areas, the Fraser Valley, and low-lying neighbourhoods are at high risk during winter storms and spring snowmelt.',
        },
        {
          icon: '⚠️',
          label: 'WARNING SIGNS',
          colorClass: 'warning',
          text: 'Heavy rainfall lasting several hours, rapidly rising water levels, official evacuation orders, and water pooling around your property.',
        },
      ],
      todo: {
        before: [
          'Prepare an emergency kit (water, food, flashlight, first aid)',
          'Know your evacuation routes',
          'Sign up for emergency alerts',
          'Move valuables to higher floors',
        ],
        during: [
          'Move to higher ground immediately',
          'Avoid walking or driving through flood waters',
          'Listen to emergency broadcasts',
          'Disconnect electrical appliances if safe to do so',
        ],
        after: [
          'Document damage with photos before cleaning up',
          'Contact your insurance company',
          'Avoid flood-damaged buildings until inspected',
          'Boil tap water until officials say it is safe',
        ],
      },
    },
    earthquake: {
      icon: '🌍',
      name: 'Earthquake',
      description: 'Ground shaking, building damage',
      overview: [
        {
          icon: '📖',
          label: 'WHAT IS IT',
          colorClass: 'info',
          text: 'An earthquake is a sudden shaking of the ground caused by movement of tectonic plates. BC is in an active earthquake zone along the Pacific Ring of Fire.',
        },
        {
          icon: '📍',
          label: 'RISK IN BC',
          colorClass: 'risk',
          text: 'BC has the highest earthquake risk in Canada. A major earthquake (magnitude 7+) is expected in the region within the next 50 years.',
        },
        {
          icon: '⚠️',
          label: 'WARNING SIGNS',
          colorClass: 'warning',
          text: 'There are usually no warning signs. Earthquakes happen suddenly, which is why preparation is critical.',
        },
      ],
      todo: {
        before: [
          'Secure heavy furniture and shelves to walls',
          'Identify safe spots in each room (under sturdy desks)',
          'Practice "Drop, Cover, and Hold On"',
          'Keep an emergency kit accessible',
        ],
        during: [
          'Drop, Cover, and Hold On — get under a desk or table',
          'Stay indoors until shaking stops',
          'If outside, move away from buildings and power lines',
          'If driving, pull over and stay in the vehicle',
        ],
        after: [
          'Check yourself and others for injuries',
          'Be prepared for aftershocks',
          'Inspect your home for damage before re-entering',
          'Use text messages instead of calls to reach loved ones',
        ],
      },
    },
    wildfire: {
      icon: '🔥',
      name: 'Wildfire',
      description: 'Fast-spreading fire and smoke',
      overview: [
        {
          icon: '📖',
          label: 'WHAT IS IT',
          colorClass: 'info',
          text: 'A wildfire is an uncontrolled fire in forests or grasslands. Smoke from wildfires can affect air quality even hundreds of kilometres away.',
        },
        {
          icon: '📍',
          label: 'RISK IN BC',
          colorClass: 'risk',
          text: 'Wildfire season runs from May to October. Interior BC and forested areas around Metro Vancouver are at high risk during dry summers.',
        },
        {
          icon: '⚠️',
          label: 'WARNING SIGNS',
          colorClass: 'warning',
          text: 'Smoke or hazy skies, smell of burning, fire alerts on news/radio, and visible flames or glow on the horizon.',
        },
      ],
      todo: {
        before: [
          'Create a defensible space around your home',
          'Pack a go-bag with essentials and important documents',
          'Plan multiple evacuation routes',
          'Sign up for local emergency alerts',
        ],
        during: [
          'Evacuate immediately if ordered',
          'Stay indoors with windows closed if smoke is heavy',
          'Wear an N95 mask if you must go outside',
          'Listen to emergency broadcasts for updates',
        ],
        after: [
          'Wait for officials to say it is safe to return',
          'Watch for hot spots and flare-ups',
          'Check air quality before opening windows',
          'Document property damage for insurance',
        ],
      },
    },
  };

  const disaster = disasterData[disasterId];

  if (!disaster) {
    return (
      <div className="page-padding">
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>❓</div>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Guide not found</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
            We couldn't find that disaster guide.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/info')}
          >
            Back to all guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-padding">
      {/* Back link */}
      <button
        className="back-link"
        onClick={() => navigate('/info')}
        aria-label="Back to disaster guides"
      >
        ‹ Back to guides
      </button>

      {/* Disaster header */}
      <div className="disaster-detail-header">
        <div className="disaster-detail-icon" aria-hidden="true">{disaster.icon}</div>
        <h1 className="disaster-detail-name">{disaster.name}</h1>
        <p className="disaster-detail-desc">{disaster.description}</p>
      </div>

      {/* Tab toggle (big cards) */}
      <div className="detail-tabs">
        <button
          type="button"
          className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          aria-pressed={activeTab === 'overview'}
        >
          <span className="detail-tab-icon" aria-hidden="true">📖</span>
          <span className="detail-tab-label">Overview</span>
        </button>
        <button
          type="button"
          className={`detail-tab ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => setActiveTab('todo')}
          aria-pressed={activeTab === 'todo'}
        >
          <span className="detail-tab-icon" aria-hidden="true">✓</span>
          <span className="detail-tab-label">To-Do</span>
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' ? (
        <div className="detail-overview">
          {disaster.overview.map((section, index) => (
            <div key={index} className="overview-card">
              <div className={`overview-card-header ${section.colorClass}`}>
                <span className="overview-card-icon" aria-hidden="true">{section.icon}</span>
                <span className="overview-card-label">{section.label}</span>
              </div>
              <div className="overview-card-text">{section.text}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="detail-todo">
          {/* BEFORE card */}
          <div className="todo-stage-card">
            <div className="todo-stage-header before">
              <span className="todo-stage-icon" aria-hidden="true">📋</span>
              <span className="todo-stage-label">BEFORE</span>
            </div>
            <ul className="todo-stage-list">
              {disaster.todo.before.map((item, index) => (
                <li key={index} className="todo-stage-item before">{item}</li>
              ))}
            </ul>
          </div>

          {/* DURING card */}
          <div className="todo-stage-card">
            <div className="todo-stage-header during">
              <span className="todo-stage-icon" aria-hidden="true">⚠️</span>
              <span className="todo-stage-label">DURING</span>
            </div>
            <ul className="todo-stage-list">
              {disaster.todo.during.map((item, index) => (
                <li key={index} className="todo-stage-item during">{item}</li>
              ))}
            </ul>
          </div>

          {/* AFTER card */}
          <div className="todo-stage-card">
            <div className="todo-stage-header after">
              <span className="todo-stage-icon" aria-hidden="true">✅</span>
              <span className="todo-stage-label">AFTER</span>
            </div>
            <ul className="todo-stage-list">
              {disaster.todo.after.map((item, index) => (
                <li key={index} className="todo-stage-item after">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisasterDetail;