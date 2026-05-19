import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getLocationOpenInfo } from "../utils/locationHours";


import MapComponent from "../components/MapComponent";
import PageHint, { hints } from "../components/PageHint";

function Map() {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [mapKey, setMapKey] = useState(0);



  const userType = userData?.role;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_URL}/locations`, {
          credentials: "include",
        });
        const data = await response.json();
        setLocations(data.locations || []);
      } catch (error) {
        console.error("Could not load locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);


  const filterMatchesLocation = (filter, loc) => {
    if (filter === "all") return true;

    const type = loc.type;
    const services = loc.services || [];

    if (filter === "shelter") {
      return (
        ["emergency shelter", "warming centre", "cooling centre"].includes(type) ||
        services.includes("shelter") ||
        services.includes("warming centre") ||
        services.includes("cooling centre")
      );
    }

    if (filter === "food") {
      return (
        ["food bank", "community fridge", "community kitchen"].includes(type) ||
        services.includes("food") ||
        services.includes("low-cost meals")
      );
    }

    if (filter === "water") {
      return services.includes("water");
    }

    if (filter === "supplies") {
      return services.includes("supplies");
    }

    if (filter === "community") {
      return (
        type === "community centre" ||
        services.includes("community gathering") ||
        services.includes("youth programs") ||
        services.includes("senior programs") ||
        services.includes("newcomer support")
      );
    }

    if (filter === "medical") {
      return type === "medical support" || services.includes("medical support");
    }

    if (filter === "pet") {
      return type === "pet support" || services.includes("pet support");
    }

    if (filter === "info") {
      return (
        type === "information centre" ||
        type === "disaster support hub" ||
        services.includes("information") ||
        services.includes("recovery information") ||
        services.includes("family reunification") ||
        services.includes("disaster support hub")
      );
    }

    return false;
  };


  // If location access is denied, we show an error banner with retry button
  const handleRetryLocation = () => {
    setLocationError(false);
    // Prompt browser to re-request, user must have allowed in settings first.
    // Reloading the map component is the cleanest way; we toggle a key to remount it.
    setMapKey((k) => k + 1);
  };



  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase());

    // This is the line that connects to our new filter logic
    const matchesFilter = filterMatchesLocation(activeFilter, loc);

    return matchesSearch && matchesFilter;

  });



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

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "badge-open";
      case "limited":
        return "badge-limited";
      case "closed":
        return "badge-closed";
      default:
        return "badge-open";
    }
  };

  const getFilters = () => {
    const categoryFilters = [
      { value: "all", label: "All" },
      { value: "shelter", label: "🏠 Shelter" },
      { value: "food", label: "🍞 Food" },
      { value: "water", label: "💧 Water" },
      { value: "supplies", label: "📦 Supplies" },
      { value: "community", label: "🏘️ Community" },
      { value: "medical", label: "🏥 Medical" },
      { value: "pet", label: "🐾 Pet Help" },
      { value: "info", label: "ℹ️ Info" }
    ];
    if (userType === "in-need")
      return [
        { value: "available", label: "✅ Has Space" },
        ...categoryFilters,
      ];
    if (userType === "helper")
      return [
        { value: "needs-help", label: "🙏 Needs Help" },
        ...categoryFilters,
      ];
    return categoryFilters;
  };

  const filters = getFilters();


  return (
    <div className="page-padding-wide map-page">
      {/* Page Hint */}
      {showHint && userData?.firstTimeMode && (
        <PageHint message={hints["Map"]} onClose={() => setShowHint(false)} />
      )}

      {/* Search bar */}
      <div className="map-search-bar">
        <span className="map-search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          className="map-search-input"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search locations"
        />
        {searchQuery && (
          <button
            type="button"
            className="map-search-clear"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div
        className="map-filter-chips"
        role="tablist"
        aria-label="Location category filter"
      >
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.value}
            className={`map-filter-chip ${activeFilter === filter.value ? "active" : ""}`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Location error banner — shown above the map, no browser alert */}
      {locationError && (
        <div className="map-location-error" role="alert">
          <span className="map-location-error-icon" aria-hidden="true">
            📍
          </span>
          <div className="map-location-error-body">
            <p className="map-location-error-title">Location access denied</p>
            <p className="map-location-error-desc">
              Allow location access in your browser settings, then try again.
            </p>
          </div>
          <button
            type="button"
            className="map-location-error-btn"
            onClick={handleRetryLocation}
          >
            Retry
          </button>
        </div>
      )}

      {/* Map area */}
      <div
        className="map-area"
        aria-label="Map showing nearby relief locations"
        style={{ height: "500px", padding: 0, overflow: "hidden" }}
      >
        <MapComponent
          key={mapKey}
          locations={filteredLocations}
          showFood={activeFilter === "food"}
          onLocationError={() => setLocationError(true)}
          onLocationFound={() => setLocationError(false)}
        />

      </div>

      {/* Result count */}
      <div className="map-results-header">
        <span className="map-results-count">
          {loading
            ? "Loading..."
            : `${filteredLocations.length} location${filteredLocations.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Location list */}
      {!loading && filteredLocations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            🔍
          </div>
          <div className="empty-state-title">No locations found</div>
          <div className="empty-state-desc">
            Try a different search or filter
          </div>
        </div>
      ) : (
        <div className="map-location-list">
          {filteredLocations.map((loc) => {
            const openInfo = getLocationOpenInfo(loc);

            const serviceBadges = [
              {
                service: "food",
                field: "foodLevel",
                icon: "🍞",
                labels: {
                  low: "Low food",
                  none: "No food"
                }
              },
              {
                service: "water",
                field: "waterLevel",
                icon: "💧",
                labels: {
                  low: "Low water",
                  none: "No water"
                }
              },
              {
                service: "supplies",
                field: "suppliesLevel",
                icon: "📦",
                labels: {
                  low: "Low supplies",
                  none: "No supplies"
                }
              },
              {
                service: "shelter",
                field: "shelterLevel",
                icon: "🏠",
                labels: {
                  low: "Low shelter",
                  none: "No shelter"
                }
              },
            ].filter((item) => {
              const offersService = loc.services?.includes(item.service);
              const hasLowOrNone = loc[item.field] === "low" || loc[item.field] === "none";

              return offersService && hasLowOrNone;
            });

            return (
              <button
                key={loc._id}
                type="button"
                className={`map-location-card ${selectedId === loc._id ? "selected" : ""}`}
                onClick={() => navigate(`/locations/${loc._id}`)}
                aria-label={`View details for ${loc.name}`}
              >
                <div className="map-location-icon" aria-hidden="true">
                  {getTypeIcon(loc.type)}
                </div>

                <div className="map-location-info">
                  <div className="map-location-name">{loc.name}</div>
                  <div className="map-location-address">{loc.address}</div>

                  {/* {userType === "in-need" && loc.capacity !== null && (
                    <div className="map-location-capacity">
                      {loc.capacity === 0
                        ? "⚠️ Full"
                        : `${loc.capacity} spots available`}
                    </div>
                  )} */}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "6px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  {serviceBadges.map((badge) => (
                    <span key={badge.field} className="badge badge-limited">
                      {badge.icon} {badge.labels[loc[badge.field]]}
                    </span>
                  ))}
                  <span
                    className={`badge ${openInfo.isOpen === true
                      ? "badge-open"
                      : openInfo.isOpen === false
                        ? "badge-closed"
                        : "badge-limited"
                      }`}
                  >
                    {openInfo.label}
                  </span>

                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default Map;
