import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const serviceOptions = [
  { id: 'food', label: '🍞', name: 'Food' },
  { id: 'shelter', label: '🏠', name: 'Shelter' },
  { id: 'hub', label: '🆘', name: 'SOS Hub' },
  { id: 'support', label: '🏥', name: 'Medical' }
];

const typeOptions = [
  'disaster support hub', 'emergency shelter', 'warming centre',
  'cooling centre', 'food bank', 'community fridge', 'community kitchen',
  'community centre', 'medical support', 'information centre',
  'pet support', 'other'
];

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
          lat: data.lat ?? "",
          lng: data.lng ?? "",
          status: data.status || "open",
          type: data.type || "other",
          capacity: data.capacity ?? "",
          needsSupplies: data.needsSupplies || false,
          contactInfo: data.contactInfo || "",
          services: data.services || [],
        });
      } catch (err) {
        setError("Could not load this location.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleService = (serviceId) => {
    const current = formData.services || [];
    const updated = current.includes(serviceId)
      ? current.filter(s => s !== serviceId)
      : [...current, serviceId];
    setFormData({ ...formData, services: updated });
  };

  const setStatus = (newStatus) => {
    setFormData({ ...formData, status: newStatus });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/locations/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setLoc(updated);
      alert("Location updated successfully!");
    } catch (err) {
      alert("Could not update location.");
    }
  };

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
              {loc.status}
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
          <div className="loc-address">📍 {loc.address}</div>
          {loc.type && (
            <div className="loc-type">{loc.type}</div>
          )}
        </div>
      </div>

      {/* Services card */}
      {loc.services && loc.services.length > 0 && (
        <div className="loc-card">
          <div className="loc-card-label">SERVICES</div>
          <div className="loc-services-list">
            {loc.services.map((sId) => {
              const opt = serviceOptions.find(o => o.id === sId);
              if (!opt) return null;
              return (
                <span key={sId} className="loc-service-pill">
                  {opt.label} {opt.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Volunteer call-out */}
      {loc.needsSupplies && (
        <div className="loc-callout">
          <span className="loc-callout-icon">🙏</span>
          <span>This location also needs donations & volunteers</span>
        </div>
      )}

      {/* directions + call */}
      {userType === 'in-need' && (
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
          {loc.contactInfo && (
            <a href={`tel:${loc.contactInfo}`} className="loc-action-link">
              <button type="button" className="btn-outline-block">
                📞 Call {loc.contactInfo}
              </button>
            </a>
          )}
        </div>
      )}

      {/* HELPER edit form */}
      {userType === 'helper' && (
        <form onSubmit={handleSubmit} className="loc-helper-form">

          {/* Status card */}
          <div className="loc-card">
            <div className="loc-card-label">STATUS</div>
            <div className="loc-status-buttons">
              {['open', 'limited', 'closed'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`loc-status-btn ${formData.status === s ? 'active' : ''}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <label className="loc-field-label">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Number (0 = full, blank = unknown)"
              className="loc-input"
            />
          </div>

          {/* Basic info card */}
          <div className="loc-card">
            <div className="loc-card-label">LOCATION INFO</div>
            <label className="loc-field-label">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="loc-input"
            />
            <label className="loc-field-label">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="loc-input"
            />
            <div className="loc-grid-2">
              <div>
                <label className="loc-field-label">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="loc-input"
                />
              </div>
              <div>
                <label className="loc-field-label">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  className="loc-input"
                />
              </div>
            </div>
            <label className="loc-field-label">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="loc-input"
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Services card */}
          <div className="loc-card">
            <div className="loc-card-label">SERVICES OFFERED</div>
            <div className="loc-services-grid">
              {serviceOptions.map((service) => {
                const isActive = formData.services?.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className={`loc-service-checkbox ${isActive ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isActive || false}
                      onChange={() => toggleService(service.id)}
                    />
                    <span>{service.label} {service.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Contact card */}
          <div className="loc-card">
            <div className="loc-card-label">CONTACT</div>
            <input
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Phone number or email"
              className="loc-input"
            />
          </div>

          {/* Needs supplies toggle */}
          <label className="loc-supplies-toggle">
            <input
              type="checkbox"
              name="needsSupplies"
              checked={formData.needsSupplies}
              onChange={handleChange}
            />
            <span>🙏 This location needs supplies / volunteers</span>
          </label>

          <button type="submit" className="btn-primary-block">
            Save changes
          </button>
        </form>
      )}

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