import React from "react";

export function DisasterDetailHeader({
  disaster,
  onBack,
  onTriggerEffect,
  disabled,
}) {
  return (
    <>
      <div className="disaster-detail-header-actions">
        <button
          className="back-link"
          onClick={onBack}
          aria-label="Back to disaster guides"
        >
          ‹ Back to guides
        </button>
      </div>

      <div className="disaster-detail-header">
        <button
          type="button"
          className={`disaster-detail-icon-button ${disaster.id}`}
          onClick={onTriggerEffect}
          disabled={disabled}
          aria-label={`Trigger ${disaster.name} effect`}
          aria-disabled={disabled}
        >
          <span className="disaster-detail-icon" aria-hidden="true">
            {disaster.icon}
          </span>
        </button>

        <h1 className="disaster-detail-name">{disaster.name}</h1>
        <p className="disaster-detail-desc">{disaster.description}</p>

        <a
          href={disaster.officialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="official-link"
          aria-label={`Official resource: ${disaster.officialLink.label} (opens in new tab)`}
        >
          <span className="official-link-icon" aria-hidden="true">
            🏛️
          </span>
          <span className="official-link-text">
            {disaster.officialLink.label}
          </span>
          <span className="official-link-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </>
  );
}

export function DisasterDetailTabs({ activeTab, setActiveTab }) {
  return (
    <div className="detail-tabs">
      <button
        type="button"
        className={`detail-tab ${activeTab === "overview" ? "active" : ""}`}
        onClick={() => setActiveTab("overview")}
        aria-pressed={activeTab === "overview"}
      >
        <span className="detail-tab-icon" aria-hidden="true">
          📖
        </span>
        <span className="detail-tab-label">Overview</span>
      </button>
      <button
        type="button"
        className={`detail-tab ${activeTab === "todo" ? "active" : ""}`}
        onClick={() => setActiveTab("todo")}
        aria-pressed={activeTab === "todo"}
      >
        <span className="detail-tab-icon" aria-hidden="true">
          ✓
        </span>
        <span className="detail-tab-label">To-Do</span>
      </button>
    </div>
  );
}

export function DisasterOverview({ overview }) {
  return (
    <div className="detail-overview">
      {overview.map((section, index) => (
        <div key={index} className="overview-card">
          <div className={`overview-card-header ${section.colorClass}`}>
            <span className="overview-card-icon" aria-hidden="true">
              {section.icon}
            </span>
            <span className="overview-card-label">{section.label}</span>
          </div>
          <div className="overview-card-text">{section.text}</div>
        </div>
      ))}
    </div>
  );
}

function DisasterStageCard({ title, icon, items, stageClass }) {
  return (
    <div className="todo-stage-card">
      <div className={`todo-stage-header ${stageClass}`}>
        <span className="todo-stage-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="todo-stage-label">{title}</span>
      </div>
      <ul className="todo-stage-list">
        {items.map((item, index) => (
          <li key={index} className={`todo-stage-item ${stageClass}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DisasterTodo({ todo }) {
  return (
    <div className="detail-todo">
      <DisasterStageCard
        title="BEFORE"
        icon="📋"
        items={todo.before}
        stageClass="before"
      />
      <DisasterStageCard
        title="DURING"
        icon="⚠️"
        items={todo.during}
        stageClass="during"
      />
      <DisasterStageCard
        title="AFTER"
        icon="✅"
        items={todo.after}
        stageClass="after"
      />
    </div>
  );
}
