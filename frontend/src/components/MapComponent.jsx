import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent({ showFood, onLocationError, onLocationFound }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const hasCenteredOnUserRef = useRef(false);
  const geoJsonDataRef = useRef(null);

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

    const map = L.map(mapContainerRef.current).setView(
      [49.2505, -123.0016],
      12,
    );
    leafletMapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

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
          color: "#136aec",
          fillColor: "#136aec",
          fillOpacity: 0.15,
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng(latlng);
        accuracyCircleRef.current.setRadius(accuracy);
      }

      if (!hasCenteredOnUserRef.current) {
        map.setView(latlng, 15);
        hasCenteredOnUserRef.current = true;
      }

      onLocationFoundRef.current?.();
    }

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

    fetch("/community-centres-2.geojson")
      .then((res) => res.json())
      .then((data) => {
        geoJsonDataRef.current = data;

        const layer = L.geoJSON(data, {
          pointToLayer: (feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 8,
              fillColor: "#d62828",
              color: "#ffffff",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9,
            }),
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.name || "Community Centre";
            const address =
              feature.properties?.address || "No address available";
            const area = feature.properties?.geolocalarea || "Unknown area";
            layer.bindPopup(`
              <div>
                <strong>${name}</strong><br/>
                ${address}<br/>
                <em>${area}</em>
              </div>
            `);
          },
        }).addTo(map);

        geoJsonLayerRef.current = layer;
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));

    return () => {
      map.off("locationfound", onFound);
      map.off("locationerror", onError);
      map.stopLocate();
      map.remove();
      leafletMapRef.current = null;
      userMarkerRef.current = null;
      accuracyCircleRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = leafletMapRef.current;
    const allData = geoJsonDataRef.current;
    if (!map || !allData) return;

    if (geoJsonLayerRef.current) map.removeLayer(geoJsonLayerRef.current);

    const filteredFeatures = showFood
      ? allData.features.filter((f) => f.properties?.hasFood === true)
      : allData.features;

    const newLayer = L.geoJSON(
      { ...allData, features: filteredFeatures },
      {
        pointToLayer: (feature, latlng) =>
          L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#d62828",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          }),
        onEachFeature: (feature, layer) => {
          const name = feature.properties?.name || "Community Centre";
          const address = feature.properties?.address || "No address available";
          const area = feature.properties?.geolocalarea || "Unknown area";
          layer.bindPopup(`
          <div>
            <strong>${name}</strong><br/>
            ${address}<br/>
            <em>${area}</em>
          </div>
        `);
        },
      },
    ).addTo(map);

    geoJsonLayerRef.current = newLayer;
  }, [showFood]);

  return (
    <div ref={mapContainerRef} style={{ height: "500px", width: "100%" }} />
  );
}

export default MapComponent;
