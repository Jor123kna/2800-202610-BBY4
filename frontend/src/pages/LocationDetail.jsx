import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { getLocationOpenInfo } from "../utils/locationHours";


const serviceOptions = [
  { id: 'food', label: '🍞', name: 'Food' },
  { id: 'shelter', label: '🏠', name: 'Shelter' },
  { id: 'hub', label: '🆘', name: 'SOS Hub' },
  { id: 'support', label: '🏥', name: 'Medical' }
];

const formatDayLabel = (day) => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

// const typeOptions = [
//   'disaster support hub', 'emergency shelter', 'warming centre',
//   'cooling centre', 'food bank', 'community fridge', 'community kitchen',
//   'community centre', 'medical support', 'information centre',
//   'pet support', 'other'
// ];

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userType = userData?.role;

  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
    type: "other",
    status: "open",
    capacity: "",
    needsSupplies: false,
    contactInfo: "",
    services: [],
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`${API_URL}/locations/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        setLoc(data);

        setFormData({
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          lat: data.lat ?? "",
          lng: data.lng ?? "",
          status: data.status || "open",
          type: data.type || "other",
          capacity: data.capacity ?? "",
          needsSupplies: data.needsSupplies || false,
          contactInfo: data.contactInfo || {
            phone: "",
            email: "",
            website: ""
          },
          services: data.services || [],
          notes: data.notes || "",
        });
      } catch (err) {
        setError("Could not load this location.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleReportLocationUpdate = async (field, value) => {
    if (loc[field] === value) {
      return;
    }

    const confirmReport = window.confirm(
      `Report ${field} as ${value}? If another person reports the same thing, it will update.`
    );

    if (!confirmReport) return;

    try {
      const response = await fetch(`${API_URL}/locations/${loc._id}/report-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          field,
          value
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Unable to submit report.');
        return;
      }

      alert(data.message);

      // If this is on LocationDetails page:
      setLoc(data.location);

    } catch (error) {
      console.error('Location report error:', error);
      alert('Something went wrong submitting the report.');
    }
  };

  const formatServiceName = (service) => {
    return service
      .split('/')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' / ');
  };
  const [showFullHours, setShowFullHours] = useState(false);


  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? checked : value,
  //   });
  // };

  // const toggleService = (serviceId) => {
  //   const current = formData.services || [];
  //   const updated = current.includes(serviceId)
  //     ? current.filter(s => s !== serviceId)
  //     : [...current, serviceId];
  //   setFormData({ ...formData, services: updated });
  // };

  // const setStatus = (newStatus) => {
  //   setFormData({ ...formData, status: newStatus });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch(`${API_URL}/locations/${id}`, {
  //       method: "PUT",
  //       credentials: "include",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!res.ok) throw new Error("Update failed");

  //     const updated = await res.json();
  //     setLoc(updated);
  //     alert("Location updated successfully!");
  //   } catch (err) {
  //     alert("Could not update location.");
  //   }
  // };

  if (loading) {
    return (
      <div className="location-detail-page">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (error || !loc) {
    return (
      <div className="location-detail-page">
        <button
          onClick={() => navigate('/map')}
          className="btn-back"
        >
          ← Back to map
        </button>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">😕</div>
          <h3 className="empty-state-title">Location not found</h3>
          <p className="empty-state-desc">
            {error || 'This location may have been removed.'}
          </p>
        </div>
      </div>
    );
  }

  // Helpers for display 
  const statusColors = {
    open: { bg: '#EAF3DE', text: '#3B6D11', dot: '●' },
    limited: { bg: '#FAEEDA', text: '#854F0B', dot: '●' },
    closed: { bg: '#FCEBEB', text: '#A32D2D', dot: '●' }
  };
  const statusStyle = statusColors[loc.status] || statusColors.open;
  const openInfo = getLocationOpenInfo(loc);

  const serviceVoteOptions = [
    {
      service: 'food',
      field: 'foodLevel',
      label: 'FOOD STATUS',
      values: ['none', 'low', 'medium', 'high']
    },
    {
      service: 'water',
      field: 'waterLevel',
      label: 'WATER STATUS',
      values: ['none', 'low', 'medium', 'high']
    },
    {
      service: 'shelter',
      field: 'shelterLevel',
      label: 'SHELTER STATUS',
      values: ['none', 'low', 'medium', 'high']
    },
    {
      service: 'supplies',
      field: 'suppliesLevel',
      label: 'SUPPLIES STATUS',
      values: ['none', 'low', 'medium', 'high']
    }
  ];

  return (
    <div className="location-detail-page">
      <button
        onClick={() => navigate('/map')}
        className="btn-back"
        aria-label="Back to map"
      >
        ← Back to map
      </button>

      {/* Title card */}
      <div className="loc-card loc-title-card">
        <div className="loc-card-strip" />
        <div className="loc-card-body">
          <div className="loc-title-row">
            <h1 className="loc-title">{loc.name}</h1>
          </div>
          <div className="loc-status-line"
            style={{ color: statusStyle.text }}>
            <span>{statusStyle.dot}</span>
            <span style={{ textTransform: 'uppercase', fontWeight: 500, fontSize: '11px', letterSpacing: '0.5px' }}>
              {openInfo.label}
            </span>
            {loc.capacity !== null && loc.capacity !== undefined && (
              <>
                <span className="loc-status-divider">·</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {loc.capacity === 0
                    ? 'Currently full'
                    : `${loc.capacity} spots available`}
                </span>
              </>
            )}
          </div>

          <div className="loc-address">📍 {loc.address} {loc.city && `, ${loc.city}`}</div>

          {loc.type && (
            <div className="loc-type">{loc.type}</div>
          )}

          {loc.contactInfo?.phone && (
            <div className="loc-address">
              📞 {loc.contactInfo.phone}
            </div>
          )}

          {loc.contactInfo?.email && (
            <div className="loc-address">
              ✉️ {loc.contactInfo.email}
            </div>
          )}

          {loc.notes && (
            <div
              className="loc-address"
              style={{ marginTop: 'var(--space-2)' }}
            >
              📝 {loc.notes}
            </div>
          )}

        </div>
      </div>

      {/* Services card */}
      {loc.services && loc.services.length > 0 && (
        <div className="loc-card">
          <div style={{ marginTop: 'var(--space-3)' }}>
            <div className="loc-card-label">SERVICES OFFERED</div>

            <div className="loc-services-list">
              {loc.services.map((service) => (
                <span key={service} className="loc-service-pill">
                  {formatServiceName(service)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Service voting cards */}
      {serviceVoteOptions.map((option) => {
        if (!loc.services?.includes(option.service)) {
          return null;
        }

        return (
          <div className="loc-card" key={option.field}>
            <div className="loc-card-label">{option.label}</div>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              Current: {loc[option.field] || 'unknown'}
            </p>

            <div className="loc-status-buttons">
              {option.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleReportLocationUpdate(option.field, value)}
                  className={`loc-status-btn ${loc[option.field] === value ? 'active' : ''}`}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
              This updates after 2 people report the same status.
            </p>
          </div>
        );
      })}

      {/* directions + call */}
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

        {/* Hours of opperation */}
      <div className="loc-card">
        <div className="loc-card-label">HOURS</div>

        <p style={{ marginTop: 0 }}>
          🕒 {openInfo.label} · Today: {openInfo.todayHours}
        </p>

        <button
          type="button"
          onClick={() => setShowFullHours(!showFullHours)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-brand)',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}
        >
          {showFullHours ? 'Hide full hours' : 'View full hours'}
        </button>

        {showFullHours && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            {daysOfWeek.map((day) => {
              const dayHours = loc.hours?.[day];

              return (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  <span>{formatDayLabel(day)}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {!dayHours || dayHours.closed
                      ? 'Closed'
                      : `${dayHours.open} - ${dayHours.close}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Not logged in */}
      {!userType && (
        <div className="loc-signin-prompt">
          <p style={{ marginTop: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Sign in to get directions or update this location.
          </p>
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="btn-primary-block"
          >
            Sign in
          </button>
        </div>
      )}

      {/* Last updated meta */}
      {loc.updatedBy?.username && (
        <div className="loc-meta">
          Last updated by {loc.updatedBy.username} · {new Date(loc.updatedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default LocationDetail;