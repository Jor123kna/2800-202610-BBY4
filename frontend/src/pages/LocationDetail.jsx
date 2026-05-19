import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { getLocationOpenInfo } from "../utils/locationHours";
import PageHint, { hints } from "../components/PageHint";


const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const userType = userData?.role;

  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullHours, setShowFullHours] = useState(false);

  const [showHint, setShowHint] = useState(true);

  const getTypeIcon = (type) => {
    switch (type) {
      case "emergency shelter":
        return "🏠";
      case "warming centre":
        return "🔥";
      case "cooling centre":
        return "❄️";
      case "food bank":
        return "🍞";
      case "community fridge":
        return "🥬";
      case "community kitchen":
        return "🍳";
      case "community centre":
        return "🏘️";
      case "disaster support hub":
        return "🆘";
      case "information centre":
        return "ℹ️";
      case "medical support":
        return "🏥";
      case "pet support":
        return "🐾";
      default:
        return "📍";
    }
  };


  // Fetch this location from the backend when the page loads
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`${API_URL}/locations/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Not found");
        }

        const data = await res.json();
        setLoc(data);
      } catch (err) {
        setError("Could not load this location.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  // Sends a user report/vote for a location update.
  // The backend only updates the real value after 2 matching reports.
  const handleReportLocationUpdate = async (field, value) => {
    // Do nothing if the value is already selected
    if (loc[field] === value) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/locations/${loc._id}/report-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          field,
          value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to submit report.");
        return;
      }

      alert(data.message);
      setLoc(data.location);
    } catch (error) {
      console.error("Location report error:", error);
      alert("Something went wrong submitting the report.");
    }
  };

  const formatTypeName = (type) => {
    if (!type) return "";

    const lowerType = type.toLowerCase();

    return lowerType.charAt(0).toUpperCase() + lowerType.slice(1);
  };

  // Makes service names nicer to read in the services pills
  const formatServiceName = (service) => {
    return service
      .split("/")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" / ");
  };

  // Makes day names nicer in the hours list
  const formatDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (loading) {
    return (
      <div className="location-detail-page">
        <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  if (error || !loc) {
    return (
      <div className="location-detail-page">
        <button onClick={() => navigate("/map")} className="btn-back">
          ← Back to map
        </button>

        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            😕
          </div>
          <h3 className="empty-state-title">Location not found</h3>
          <p className="empty-state-desc">
            {error || "This location may have been removed."}
          </p>
        </div>
      </div>
    );
  }

  // Colours for the community-reported location status
  const statusColors = {
    open: { bg: "#EAF3DE", text: "#3B6D11", dot: "●" },
    limited: { bg: "#FAEEDA", text: "#854F0B", dot: "●" },
    closed: { bg: "#FCEBEB", text: "#A32D2D", dot: "●" },
  };

  const statusStyle = statusColors[loc.status] || statusColors.open;

  // Automatic open/closed info based on the location's hours
  const openInfo = getLocationOpenInfo(loc);

  // These cards only appear if the location has the matching service
  const serviceVoteOptions = [
    {
      services: ["food", "low-cost meals", "community kitchen"],
      field: "foodLevel",
      label: "FOOD STATUS",
      values: ["none", "low", "medium", "high"],
    },
    {
      services: ["water"],
      field: "waterLevel",
      label: "WATER STATUS",
      values: ["none", "low", "medium", "high"],
    },
    {
      services: ["shelter", "warming centre", "cooling centre", "disaster support hub"],
      field: "shelterLevel",
      label: "SHELTER STATUS",
      values: ["none", "low", "medium", "high"],
    },
    {
      services: ["supplies"],
      field: "suppliesLevel",
      label: "SUPPLIES STATUS",
      values: ["none", "low", "medium", "high"],
    },
  ];

  return (
    <div className="location-detail-page">
      <button
        onClick={() => navigate("/map")}
        className="btn-back"
        aria-label="Back to map"
      >
        ← Back to map
      </button>

      {/* Page Hint */}
      {showHint && userData?.firstTimeMode && (
        <PageHint message={hints["LocationDetails"]} onClose={() => setShowHint(false)} />
      )}

      {/* Title card */}
      <div className="loc-card loc-title-card">
        <div className="loc-card-strip" />

        <div className="loc-card-body">
          <div className="loc-title-row">
            <h1 className="loc-title">{loc.name}</h1>
          </div>

          <div className="loc-status-line" style={{ color: statusStyle.text }}>
            <span>{statusStyle.dot}</span>

            <span
              style={{
                textTransform: "uppercase",
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.5px",
              }}
            >
              {openInfo.label}
            </span>

          </div>

          <div className="loc-address">
            📍 {loc.address}
            {loc.city && `, ${loc.city}`}
          </div>

          {loc.type && <div className="loc-address">
            {getTypeIcon(loc.type)} {formatTypeName(loc.type)}
          </div>
          }


          {loc.notes && (
            <div
              className="loc-address"
              style={{ marginTop: "var(--space-2)" }}
            >
              📝 {loc.notes}
            </div>
          )}
        </div>
      </div>

      {/* CONTACT CARD */}
      <div className="loc-card">
        <div className="loc-card-label">CONTACT</div>

        {loc.contactInfo?.phone && (
          <div className="loc-address">📞 {loc.contactInfo.phone}</div>
        )}

        {loc.contactInfo?.email && (
          <div className="loc-address">✉️ {loc.contactInfo.email}</div>
        )}


      </div>

      {/* Services offered */}
      {loc.services && loc.services.length > 0 && (
        <div className="loc-card">
          <div className="loc-card-label">SERVICES OFFERED</div>

          <div className="loc-services-list">
            {loc.services.map((service) => (
              <span key={service} className="loc-service-pill">
                {formatServiceName(service)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Service voting cards */}
      {userType && serviceVoteOptions.map((option) => {
        const hasMatchingService = option.services.some((service) =>
          loc.services?.includes(service)
        );

        if (!hasMatchingService) {
          return null;
        }

        return (
          <div className="loc-card" key={option.field}>
            <div className="loc-card-label">{option.label}</div>

            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Current: {loc[option.field] || "unknown"}
            </p>

            <div className="loc-status-buttons">
              {option.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleReportLocationUpdate(option.field, value)}
                  className={`loc-status-btn ${loc[option.field] === value ? "active" : ""
                    }`}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>

            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-xs)",
                marginTop: "var(--space-2)",
              }}
            >
              This updates after 2 people report the same status.
            </p>
          </div>
        );
      })}

      {/* Directions and website actions */}
      <div className="loc-actions-stack">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
          target="_blank"
          rel="noreferrer"
          className="loc-action-link"
        >
          <button type="button" className="btn-primary-block">
            🗺️ Get directions
          </button>
        </a>

        {loc.contactInfo?.website && (
          <a
            href={loc.contactInfo.website}
            target="_blank"
            rel="noreferrer"
            className="loc-action-link"
          >
            <button type="button" className="btn-outline-block">
              🌐 Visit website
            </button>
          </a>
        )}
      </div>

      {/* Hours of operation */}
      <div className="loc-card">
        <div className="loc-card-label">HOURS</div>

        <p style={{ marginTop: 0 }}>
          🕒 {openInfo.label} · Today: {openInfo.todayHours}
        </p>

        <button
          type="button"
          onClick={() => setShowFullHours(!showFullHours)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-brand)",
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {showFullHours ? "Hide full hours" : "View full hours"}
        </button>

        {showFullHours && (
          <div style={{ marginTop: "var(--space-3)" }}>
            {daysOfWeek.map((day) => {
              const dayHours = loc.hours?.[day];

              return (
                <div
                  key={day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <span>{formatDayLabel(day)}</span>

                  <span style={{ color: "var(--color-text-secondary)" }}>
                    {!dayHours || dayHours.closed
                      ? "Closed"
                      : `${dayHours.open} - ${dayHours.close}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Not logged in message */}
      {!userType && (
        <div className="loc-signin-prompt">
          <p
            style={{
              marginTop: 0,
              color: "var(--color-text-secondary)",
              fontSize: "14px",
            }}
          >
            Sign in to get report updates for this location.
          </p>

          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="btn-primary-block"
          >
            Sign in
          </button>
        </div>
      )}

      {/* Last updated info */}
      {loc.updatedBy?.username && (
        <div className="loc-meta">
          Last updated by {loc.updatedBy.username} ·{" "}
          {new Date(loc.updatedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default LocationDetail;