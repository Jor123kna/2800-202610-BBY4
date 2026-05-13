import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const userType = userData?.role; // 'in-need' | 'helper' | undefined

  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // only helpers use this form state
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

  if (loading) return <div className="page-padding-wide">Loading...</div>;
  if (error) return <div className="page-padding-wide">{error}</div>;

  return (
    <div className="page-padding-wide">
      <button onClick={() => navigate("/map")}>← Back to map</button>

      {/* ── Location Info (shown to everyone) ── */}
      <h1>{loc.name}</h1>
      <p>{loc.address}</p>
      <p>Type: {loc.type}</p>

      <span className={`badge badge-${loc.status}`}>{loc.status}</span>

      {loc.capacity !== null && loc.capacity !== undefined && (
        <p>
          {loc.capacity === 0
            ? "⚠️ Currently full"
            : `${loc.capacity} spots available`}
        </p>
      )}

      {loc.updatedBy?.username && (
        <p style={{ fontSize: "13px", color: "gray" }}>
          Last updated by {loc.updatedBy.username} on{" "}
          {new Date(loc.updatedAt).toLocaleString()}
        </p>
      )}

      <hr />

      {/* ── IN NEED: directions + call ── */}
      {userType === "in-need" && (
        <div className="location-actions">
          <h2>Get Help Here</h2>

          {loc.contactInfo && (
            <a href={`tel:${loc.contactInfo}`}>
              <button type="button">📞 Call {loc.contactInfo}</button>
            </a>
          )}

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            <button type="button">🗺️ Get Directions</button>
          </a>

          {loc.needsSupplies && (
            <p style={{ marginTop: "12px" }}>
              🙏 This location also needs supply donations or volunteers.
            </p>
          )}
        </div>
      )}

      {/* ── HELPER: full edit form ── */}
      {userType === "helper" && (
        <div className="location-actions">
          <h2>Update Location</h2>

          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Location Name"
              />
            </label>

            <label>
              Address
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </label>

            <label>
              Latitude
              <input
                type="number"
                step="any"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Latitude"
              />
            </label>

            <label>
              Longitude
              <input
                type="number"
                step="any"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Longitude"
              />
            </label>

            <label>
              Type
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="disaster support hub">
                  Disaster Support Hub
                </option>
                <option value="emergency shelter">Emergency Shelter</option>
                <option value="warming centre">Warming Centre</option>
                <option value="cooling centre">Cooling Centre</option>
                <option value="food bank">Food Bank</option>
                <option value="community fridge">Community Fridge</option>
                <option value="community kitchen">Community Kitchen</option>
                <option value="community centre">Community Centre</option>
                <option value="medical support">Medical Support</option>
                <option value="information centre">Information Centre</option>
                <option value="pet support">Pet Support</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="limited">Limited</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label>
              Capacity
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity (0 = full, leave blank = unknown)"
              />
            </label>

            <label>
              Contact Info
              <input
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Phone number or email"
              />
            </label>

            <label>
              <input
                type="checkbox"
                name="needsSupplies"
                checked={formData.needsSupplies}
                onChange={handleChange}
              />{" "}
              Needs Supplies / Volunteers
            </label>

            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}

      {/* NOT LOGGED IN: prompt to sign in */}
      {!userType && (
        <div style={{ marginTop: "1rem" }}>
          <p>Sign in to get directions or update this location.</p>
          <button type="button" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}

export default LocationDetail;
