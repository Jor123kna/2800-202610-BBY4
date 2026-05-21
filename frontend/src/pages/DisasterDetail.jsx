import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHint, { hints } from "../components/PageHint";
import { useAuth } from "../context/AuthContext";
import { disasterDetails } from "../data/disasterData";
import {
  DisasterDetailHeader,
  DisasterDetailTabs,
  DisasterOverview,
  DisasterTodo,
} from "../components/DisasterDetailComponents";
import DisasterEffects from "../components/DisasterEffects";

function DisasterDetail() {
  const { disasterId } = useParams();
  const navigate = useNavigate();

  const { userData } = useAuth();
  const [showHint, setShowHint] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeEffect, setActiveEffect] = useState(null);

  const disaster = disasterDetails[disasterId];

  const triggerEffect = () => {
    setActiveEffect(`disaster_${disaster.id}`);
    setTimeout(() => setActiveEffect(null), 4000);
  };

  if (!disaster) {
    return (
      <div className="page-padding">
        <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
          <div style={{ fontSize: "48px", marginBottom: "var(--space-4)" }}>
            ❓
          </div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Guide not found</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-6)",
            }}
          >
            We couldn't find that disaster guide.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/info")}>
            Back to all guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-padding">
      {showHint && userData?.firstTimeMode && (
        <PageHint
          message={hints["DisasterDetails"]}
          onClose={() => setShowHint(false)}
        />
      )}

      <DisasterDetailHeader
        disaster={disaster}
        onBack={() => navigate("/info")}
        onTriggerEffect={triggerEffect}
      />

      <DisasterDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "overview" ? (
        <DisasterOverview overview={disaster.overview} />
      ) : (
        <DisasterTodo todo={disaster.todo} />
      )}

      <button
        className="fab fab--label"
        onClick={() => navigate("/AiChat")}
        aria-label="Chat with ai"
      >
        💬 Chat with ai
      </button>

      <DisasterEffects type={activeEffect} />
      <div style={{ height: "var(--space-8)" }}></div>
    </div>
  );
}

export default DisasterDetail;
