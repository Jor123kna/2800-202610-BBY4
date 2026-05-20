import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHint, { hints } from "../components/PageHint";
import DisasterCard from "../components/DisasterCard";
import { disasters } from "../data/disasterData";
import InstallGuideCard from "../components/InstallGuideCard";

function Info() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showHint, setShowHint] = useState(true);

  const handleDisasterClick = (disasterId) => {
    navigate(`/disaster/${disasterId}`);
  };

  return (
    <div className="page-padding">
      {showHint && userData?.firstTimeMode && (
        <PageHint message={hints["Info"]} onClose={() => setShowHint(false)} />
      )}

      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1 style={{ marginBottom: "var(--space-2)" }}>Disaster Guides</h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
          }}
        >
          Be prepared for emergencies in the Lower Mainland
        </p>
      </div>

      {/* Install app card */}
      <InstallGuideCard />

      <div className="disaster-list">
        {disasters.map((disaster) => (
          <DisasterCard
            key={disaster.id}
            disaster={disaster}
            onSelect={handleDisasterClick}
          />
        ))}
      </div>

      <button
        className="fab fab--label"
        onClick={() => navigate("/AiChat")}
        aria-label="Chat with ai"
      >
        💬 Chat with ai
      </button>
      <div style={{ height: "var(--space-8)" }}></div>
    </div>
  );
}

export default Info;
