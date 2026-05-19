import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const vancouverBounds = [
  [49.002, -123.324],
  [49.390, -122.690]
];


function MapComponent({ onLocationError, onLocationFound, locations = [] }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const hasCenteredOnUserRef = useRef(false);
  const markersLayerRef = useRef(null);


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
      minZoom: 11
    }).setView([49.2827, -123.1207], 12);

    leafletMapRef.current = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Initialize the layer group for markers
    markersLayerRef.current = L.layerGroup().addTo(map);


    function onFound(e) {
      const { latlng, accuracy } = e;

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
          color: '#136aec',
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
      console.error("Location error:", e.message);
      onLocationErrorRef.current?.(e.message);
    }

    map.on("locationfound", onFound);
    map.on("locationerror", onError);

    map.locate({
      watch: true,
      setView: false,
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
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
    const validLocations = locations.filter(loc =>
      loc.lat && loc.lng && loc.lat !== 0
    );

    // 2. Draw service pins
    validLocations.forEach((loc) => {
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 8,
        fillColor: '#d62828',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9,
      });

      // No neeed for it upgraded to get location 
      //   marker.bindPopup(`<b>${loc.name}</b><br/>${loc.address}`);

      // Construct the Google Maps Directions URL
      const mapLink = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

      // Get Directions button added
      marker.bindPopup(`
        <div>
    <strong>${loc.name}</strong>
    <p>${loc.address}</p>
    <a href="${mapLink}" target="_blank">
      Get Directions
    </a>
  </div>
      `);

      markersLayerRef.current.addLayer(marker);
    });

    // 3. CAMERA LOGIC: Only trigger if there are pins to show
    // This prevents the map from jumping to the boundary edge on initial load
    if (validLocations.length > 0) {
      let allPoints = validLocations.map(loc => [loc.lat, loc.lng]);

      // Include user in the view if they are already found
      if (userMarkerRef.current) {
        const userLatLng = userMarkerRef.current.getLatLng();
        allPoints.push([userLatLng.lat, userLatLng.lng]);
      }

      if (allPoints.length > 1) {
        leafletMapRef.current.fitBounds(allPoints, {
          padding: [50, 50],
          maxZoom: 15
        });
      } else {
        leafletMapRef.current.setView(allPoints[0], 15);
      }
    }
  }, [locations]);

  // useEffect(() => {
  //   const map = leafletMapRef.current;
  //   const allData = geoJsonDataRef.current;
  //   if (!map || !allData) return;

  //   if (geoJsonLayerRef.current) map.removeLayer(geoJsonLayerRef.current);

  //   const filteredFeatures = showFood
  //     ? allData.features.filter((f) => f.properties?.hasFood === true)
  //     : allData.features;

  //   const newLayer = L.geoJSON(
  //     { ...allData, features: filteredFeatures },
  //     {
  //       pointToLayer: (feature, latlng) =>
  //         L.circleMarker(latlng, {
  //           radius: 8,
  //           fillColor: "#d62828",
  //           color: "#ffffff",
  //           weight: 2,
  //           opacity: 1,
  //           fillOpacity: 0.9,
  //         }),
  //       onEachFeature: (feature, layer) => {
  //         const name = feature.properties?.name || "Community Centre";
  //         const address = feature.properties?.address || "No address available";
  //         const area = feature.properties?.geolocalarea || "Unknown area";
  //         layer.bindPopup(`
  //         <div>
  //           <strong>${name}</strong><br/>
  //           ${address}<br/>
  //           <em>${area}</em>
  //         </div>
  //       `);
  //       },
  //     },
  //   ).addTo(map);

  //   geoJsonLayerRef.current = newLayer;
  // }, [showFood]);

  return (
    <div ref={mapContainerRef} style={{ height: "500px", width: "100%" }} />
  );
}

export default MapComponent;
