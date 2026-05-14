import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
// using useSate a hook that lets thi page store checkbox on of value 

import MapComponent from '../components/MapComponent';
import PageHint from '../components/PageHint';


/* The map area is currently a mock visual. */
function Map() {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(true);
  const { userData} = useAuth();

 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_URL}/locations`);
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

    // We only declare these ONCE at the top
    const type = loc.type;
    const hasService = loc.services && loc.services.includes(filter);

    if (filter === "shelter") {
      return ["emergency shelter", "warming centre", "cooling centre"].includes(type) || hasService;
    }
    if (filter === "food") {
      return ["food bank", "community fridge", "community kitchen"].includes(type) || hasService;
    }
    if (filter === "community") {
      return ["community centre", "community kitchen"].includes(type);
    }
    if (filter === "hub") {
      return ["disaster support hub", "information centre"].includes(type) || hasService;
    }
    if (filter === "support") {
      return ["medical support", "pet support"].includes(type) || hasService;
    }
    if (filter === "other") {
      return type === "other";
    }
    return false;
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

  const filters = [
    { value: "all", label: "All" },
    { value: "shelter", label: "🏠 Shelter" },
    { value: "food", label: "🍞 Food" },
    { value: "community", label: "🏘️ Community" },
    { value: "hub", label: "🆘 Hubs" },
    { value: "support", label: "🏥 Support" },
    { value: "other", label: "📍 Other" },
  ];

  return (
    <div className="page-padding-wide map-page">

      {/* Page Hint */}
      {showHint && userData?.firstTimeMode && (
        <PageHint
          message="Tap + to create a post. Filter by In Need or To Help!"
          onClose={() => setShowHint(false)}
        />
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

      {/* Mock map area */}
      <div
        className="map-area"
        aria-label="Map showing nearby relief locations"
      >
        {/* Mock streets */}
        <div className="map-street horizontal" style={{ top: "30%" }}></div>
        <div className="map-street horizontal" style={{ top: "60%" }}></div>
        <div className="map-street vertical" style={{ left: "25%" }}></div>
        <div className="map-street vertical" style={{ left: "70%" }}></div>

        {/* Map markers */}
        {filteredLocations.slice(0, 5).map((loc, index) => {
          const positions = [
            { top: "25%", left: "20%" },
            { top: "50%", left: "60%" },
            { top: "40%", left: "40%" },
            { top: "65%", left: "30%" },
            { top: "35%", left: "75%" },
          ];
          return (
            <button
              key={loc._id}
              type="button"
              className={`map-marker ${selectedId === loc._id ? "selected" : ""}`}
              style={positions[index]}
              onClick={() => setSelectedId(loc._id)}
              aria-label={`Select ${loc.name}`}
            >
              📍
            </button>
          );
        })}

        {/* "Mock map" label */}
        <div
          className="map-area"
          aria-label="Map showing nearby relief locations"
          style={{ height: "500px", padding: 0, overflow: "hidden" }}
        >
          <MapComponent locations={filteredLocations} />
        </div>
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
          {filteredLocations.map((loc) => (
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
              </div>
              <span className={`badge ${getStatusClass(loc.status)}`}>
                {loc.status}
              </span>
                 {loc.needsSupplies && (
         <span style={{
            backgroundColor: '#e67e22',
            color: 'white',
            padding: '2px 8px',
             borderRadius: '4px',
             fontSize: '10px',
             marginLeft: '8px',
             fontWeight: 'bold',
             display: 'inline-block' }}>
    ⚠️ NEEDS SUPPLIES
  </span>
)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Map;
