import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// funtion to be used to get the distance btw user and the community
function getDistance(userLat, userLng, destinationLat, destinationLng) {
  // if you want to get the answer in miles change to 3959
  const R = 6371; // Radius of the Earth in km

  // findid the diff btw btw user lat and dest lat & dest long - userlng
  // then we will convert it to radian JS dont get degres on curved surface
  const dLat = ((destinationLat - userLat) * Math.PI) / 180;
  const dLon = ((destinationLng - userLng) * Math.PI) / 180;

  // find the staring line distance
  /* first we calculate the distance by thinking it as of 2d 
drawing a line btw user and the destination straight line 
first find north south move 
second east west move
*/

  // Cutting through the sphere and knowing the disctance btw two points
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((destinationLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  // since we cant go from point a to b by cutting through the sphere
  //  we need to find the angle between the two points and then multiply it by the radius of the earth to get the distance
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // now mulltiple it by raidus of earth to get the distance
  return R * c;
}

// generate custom map icons based on location type
function createLocationIcon(type) {
  const isFood =
    type === "food bank" ||
    type === "community fridge" ||
    type === "community kitchen";
  const isShelter = [
    "emergency shelter",
    "warming centre",
    "cooling centre",
  ].includes(type);
  const emoji = isFood ? "🍞" : isShelter ? "🏠" : "📍";

  return L.divIcon({
    className: "custom-relief-marker", // Hooks into our CSS class rule
    html: `<div>${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const vancouverBounds = [
  [49.002, -123.324],
  [49.39, -122.69],
];

function MapComponent({ onLocationError, onLocationFound, locations = [] }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const hasCenteredOnUserRef = useRef(false);
  const markersLayerRef = useRef(null);

  // we track the user lat/lng to execute proximity sorting
  const [userProximityCoords, setUserProximityCoords] = React.useState(null);

  const onLocationErrorRef = useRef(onLocationError);
  const onLocationFoundRef = useRef(onLocationFound);
  useEffect(() => {
    onLocationErrorRef.current = onLocationError;
  }, [onLocationError]);
  useEffect(() => {
    onLocationFoundRef.current = onLocationFound;
  }, [onLocationFound]);

  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    // Initialize map with Vancouver boundary constraints
    const map = L.map(mapContainerRef.current, {
      maxBounds: vancouverBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 11,
    }).setView([49.2827, -123.1207], 12);

    leafletMapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    // Locate ME

    markersLayerRef.current = L.layerGroup().addTo(map);

    const LocateControl = L.Control.extend({
      options: { position: "topright" },
      onAdd: function () {
        const btn = L.DomUtil.create("button", "custom-locate-btn");

        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" class="custom-locate-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.54-7.49-7.49H7v-2h-.49C7.01 6.54 10.05 3.5 14 3.01V4h2v-.99c3.95.49 7 3.54 7.49 7.49H23v2h-.49c-.49 3.95-3.54 7-7.49 7.49V20h-2v-.07zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          </svg>
        `;

        L.DomEvent.on(btn, "click", function (e) {
          L.DomEvent.stopPropagation(e);
          if (userMarkerRef.current) {
            const currentLatLng = userMarkerRef.current.getLatLng();
            map.setView(currentLatLng, 15);
          }
        });

        return btn;
      },
    });

    map.addControl(new LocateControl());

    leafletMapRef.current = map;

    // Initialize the layer group for markers
    markersLayerRef.current = L.layerGroup().addTo(map);

    function onFound(e) {
      const { latlng, accuracy } = e;

      setUserProximityCoords({ lat: latlng.lat, lng: latlng.lng });

      // // testing
      // console.log("!!! MAP COMPONENT FOUND USER AT:", latlng);

      if (onLocationFoundRef.current) {
        onLocationFoundRef.current(latlng);
      }

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker(latlng)
          .addTo(map)
          .bindPopup("You are here");
      } else {
        userMarkerRef.current.setLatLng(latlng);
      }

      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle(latlng, {
          radius: accuracy,
          color: "#136aec",
          fillColor: "#136aec",
          fillOpacity: 0.15,
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng(latlng).setRadius(accuracy);
      }

      if (!hasCenteredOnUserRef.current) {
        map.setView(latlng, 14);
        hasCenteredOnUserRef.current = true;
      }
    }

    // map.locate({ watch: true, enableHighAccuracy: true });

    function onError(e) {
      // Ignore background 'position unavailable' spam from browser simulation watchers
      if (e.message.toLowerCase().includes("position unavailable")) {
        return;
      }

      console.error("Location error:", e.message);
      onLocationErrorRef.current?.(e.message);
    }

    map.on("locationfound", onFound);
    map.on("locationerror", onError);

    map.locate({
      watch: true,
      setView: false,
      maxZoom: 16,
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 6000,
    });

    return () => {
      map.off("locationfound", onFound);
      map.off("locationerror", onError);
      map.stopLocate();
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update markers and adjust camera when locations prop changes
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Filter valid locations from the database
    const validLocations = locations.filter(
      (loc) => loc.lat && loc.lng && loc.lat !== 0,
    );

    // SORTING LOGIC: If we have the user's location, sort the array!
    if (userProximityCoords) {
      validLocations.sort((a, b) => {
        const distanceA = getDistance(
          userProximityCoords.lat,
          userProximityCoords.lng,
          a.lat,
          a.lng,
        );
        const distanceB = getDistance(
          userProximityCoords.lat,
          userProximityCoords.lng,
          b.lat,
          b.lng,
        );
        return distanceA - distanceB;
      });
    }

    // 2. Draw custom markers for each location
    validLocations.forEach((item) => {
      const markerIcon = createLocationIcon(item.type);

      // Initialize the marker using the new custom icon
      const marker = L.marker([item.lat, item.lng], { icon: markerIcon });

      const navigationUrl =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        item.lat +
        "," +
        item.lng;
      marker.bindPopup(`
        <div style="text-align: center; min-width: 150px; font-family: Arial, sans-serif;">
          <strong style="font-size: 1.1em; display: block; margin-bottom: 4px;">${item.name}</strong>
          <p style="margin: 0 0 10px 0; font-size: 0.9em; color: #555;">${item.address}</p>
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="/locations/${item._id}" 
               style="background-color: #136aec; color: #ffffff; padding: 8px 12px; text-decoration: none; border-radius: 4px; font-weight: bold; display: block; font-size: 0.9em;">
              View Details
            </a>
            <a href="${navigationUrl}" target="_blank" 
               style="background-color: #f0f0f0; color: #333333; padding: 6px 12px; text-decoration: none; border-radius: 4px; border: 1px solid #cccccc; display: block; font-size: 0.85em;">
              Get Directions
            </a>
          </div>
        </div>
      `);

      markersLayerRef.current.addLayer(marker);
    });

    // 3. CAMERA LOGIC: Only trigger if there are pins to show
    //  preventing the map from jumping to the boundary edge on initial load
    if (validLocations.length > 0) {
      let allPoints = validLocations.map((loc) => [loc.lat, loc.lng]);

      // Include user in the view if they are already found
      if (userMarkerRef.current) {
        const userLatLng = userMarkerRef.current.getLatLng();
        allPoints.push([userLatLng.lat, userLatLng.lng]);
      }

      if (allPoints.length > 1) {
        leafletMapRef.current.fitBounds(allPoints, {
          padding: [50, 50],
          maxZoom: 15,
        });
      } else {
        leafletMapRef.current.setView(allPoints[0], 15);
      }
    }
  }, [locations, userProximityCoords]);

  return <div ref={mapContainerRef} className="map-component-container" />;
}

export default MapComponent;
