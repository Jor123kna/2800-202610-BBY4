import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { disasterDetails } from "../data/disasterData";
import {
  DisasterDetailHeader,
  DisasterDetailTabs,
  DisasterOverview,
  DisasterTodo,
} from "../components/DisasterDetailComponents";

function DisasterDetail() {
  const { disasterId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const disaster = disasterDetails[disasterId];

  if (!disaster) {
    return (
      <div className="page-padding">
        <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
          <div style={{ fontSize: "48px", marginBottom: "var(--space-4)" }}>❓</div>
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
      <DisasterDetailHeader disaster={disaster} onBack={() => navigate("/info")} />
      <DisasterDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "overview" ? (
        <DisasterOverview overview={disaster.overview} />
      ) : (
        <DisasterTodo todo={disaster.todo} />
      )}
    </div>
  );
}

export default DisasterDetail;
