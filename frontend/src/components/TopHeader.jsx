import React from "react";
import { useNavigate } from "react-router-dom";

function TopHeader({ showBack = false, title = "RouteRelief" }) {
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="top-header-actions">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="top-header-back"
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
