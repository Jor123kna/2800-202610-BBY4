import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const serviceOptions = [
  { id: 'food', label: '🍞 Food' },
  { id: 'shelter', label: '🏠 Shelter' },
  { id: 'hub', label: '🆘 SOS Hub' },
  { id: 'support', label: '🏥 Medical/Support' }
];

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // editable form state
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
        const res = await fetch(`http://localhost:5000/locations/${id}`);

        if (!res.ok) throw new Error("Not found");

        const data = await res.json();

        setLoc(data);

        setFormData({
          name: data.name || "",
          address: data.address || "",
          lat: data.lat || "",
          lng: data.lng || "",
          status: data.status || "",
          type: data.type || "",
          capacity: data.capacity || 0,
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
      const res = await fetch(`http://localhost:5000/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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

      <h1>Edit Location</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Location Name"
        />

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />

        <input
          type="number"
          step="any"
          name="lat"
          value={formData.lat}
          onChange={handleChange}
          placeholder="Latitude"
        />

        <input
          type="number"
          step="any"
          name="lng"
          value={formData.lng}
          onChange={handleChange}
          placeholder="Longitude"
        />

        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="disaster support hub">Disaster Support Hub</option>
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

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="open">Open</option>
          <option value="limited">Limited</option>
          <option value="closed">Closed</option>
        </select>

        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Capacity"
        />

        <input
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          placeholder="Contact Info"
        />

        <label>
          <input
            type="checkbox"
            name="needsSupplies"
            checked={formData.needsSupplies}
            onChange={handleChange}
          />
          Needs Supplies
        </label>
        
<div className="form-group" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
    Additional Services (Tags)
  </label>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
    {serviceOptions.map((service) => (
      <label key={service.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
        <input
          type="checkbox"
          style={{ marginRight: '8px', width: '18px', height: '18px' }}
          checked={formData.services?.includes(service.id)}
          onChange={() => {
            const currentServices = formData.services || [];
            const newServices = currentServices.includes(service.id)
              ? currentServices.filter(s => s !== service.id) // Remove if checked
              : [...currentServices, service.id];             // Add if unchecked
            
            setFormData({ ...formData, services: newServices });
          }}
        />
        {service.label}
      </label>
    ))}
  </div>
</div>




        <button type="submit">Save Changes</button>
      </form>

      <hr />

      <h2>{loc.name}</h2>
      <p>{loc.address}</p>

      <span className={`badge badge-${loc.status}`}>{loc.status}</span>
    </div>
  );
}

export default LocationDetail;
