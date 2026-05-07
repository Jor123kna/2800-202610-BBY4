import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapComponent({showFood}) {
  // Ref for the actual div that holds the map
  const mapContainerRef = useRef(null);

  // Ref for the Leaflet map object
  const leafletMapRef = useRef(null);

  // Ref for the user's live location marker
  const userMarkerRef = useRef(null);

  // Ref for the accuracy circle around the user
  const accuracyCircleRef = useRef(null);

  const geoJsonLayerRef = useRef(null);

  const hasCenteredOnUserRef = useRef(false);

  const geoJsonDataRef = useRef(null);

  useEffect(() => {
    
    // Stop if the div does not exist yet
    // Stop if the map was already created
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([49.2505, -123.0016], 12);
    leafletMapRef.current = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    function onLocationFound(e) {
      const { latlng, accuracy } = e;

      // If marker does not exist, create it
      // Otherwise, move the existing marker
      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker(latlng)
          .addTo(map)
          .bindPopup('You are here');
      } else {
        userMarkerRef.current.setLatLng(latlng);
      }

      // Create or update the accuracy circle
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle(latlng, {
          radius: accuracy,
          color: '#136aec',
          fillColor: '#136aec',
          fillOpacity: 0.15,
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng(latlng);
        accuracyCircleRef.current.setRadius(accuracy);
      }

      // Move map view to the user's current location
    //   map.setView(latlng, 15);
     if (!hasCenteredOnUserRef.current) {
          map.setView(latlng, 15);
           hasCenteredOnUserRef.current = true;
         }
    }

    function onLocationError(e) {
      console.error('Location error:', e.message);
      alert('Could not get your location. Please allow location access.');
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({
      watch: true,
      setView: false,
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

     
    // Sprint 2 
    // Loading community centres 
    // Load the community centres GeoJSON from the public folder
    fetch('/community-centres-2.geojson')
      .then((response) => response.json())
      .then((data) => {
        geoJsonDataRef.current = data;
        // console.log('gejson data ',data.features.length);
       
        const geoJsonLayer = L.geoJSON(data, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: '#d62828',
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    });
  },

  onEachFeature: function (feature, layer) {
    const name = feature.properties?.name || 'Community Centre';
    const address = feature.properties?.address || 'No address available';
    const area = feature.properties?.geolocalarea || 'Unknown area';

    layer.bindPopup(`
      <div>
        <strong>${name}</strong><br/>
        ${address}<br/>
        <em>${area}</em>
      </div>
    `);
  },
}).addTo(map);

geoJsonLayerRef.current = geoJsonLayer;
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
      });

    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
      map.stopLocate();
      map.remove();

      leafletMapRef.current = null;
      userMarkerRef.current = null;
      accuracyCircleRef.current = null;
    };
  }, []);
    useEffect(() => {
    const map = leafletMapRef.current;
    const allData = geoJsonDataRef.current;

    if (!map || !allData) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }
    const filteredFeatures = showFood
      ? allData.features.filter(
          (feature) => feature.properties?.hasFood === true
        )
      : allData.features;

    const filteredGeoJson = {
      ...allData,
      features: filteredFeatures,
    };
    const newGeoJsonLayer = L.geoJSON(filteredGeoJson, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: '#d62828',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        });
      },
      onEachFeature: function (feature, layer) {
        const name = feature.properties?.name || 'Community Centre';
        const address = feature.properties?.address || 'No address available';
        const area = feature.properties?.geolocalarea || 'Unknown area';

        layer.bindPopup(`
          <div>
            <strong>${name}</strong><br/>
            ${address}<br/>
            <em>${area}</em>
          </div>
        `);
         },
    }).addTo(map);

    geoJsonLayerRef.current = newGeoJsonLayer;
  }, [showFood]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: '500px',
        width: '100%',
      }}
    />
  );
}

export default MapComponent;