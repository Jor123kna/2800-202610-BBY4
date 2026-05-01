// creating map object 
let map = L.map("map");

// User Marker
let userMarker;

//bcit coordinates  
// Zome level 18 is the most detailed level of zoom, showing individual buildings and streets.
map.setView([49.2505, -123.0016], 12);

// Adding the tile layer 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Adding a marker
// L.marker([49.2505, -123.0016]).addTo(map).bindPopup("You are here").openPopup();


// Live location tracking of the user 
// let userLocation;
// userLocation=map.locate({setView:true, watch:true, maxZoom:16});
// L.marker(userLocation).addTo(map).bindPopup("You are here").openPopup();


// after the trigger now the reaction function, which is called when the location is found
function onLocationFound(e) {
    // 'e' is the event object that contains 'latlng' and 'accuracy'
    
    if (!userMarker) {
        // If the marker doesn't exist yet, build it and add it to the map
        userMarker = L.marker(e.latlng).addTo(map)
            .bindPopup("You are here").openPopup();
    } else {
        // If it already exists, just teleport it to the new spot
        userMarker.setLatLng(e.latlng);
    }
}

map.on('locationfound', onLocationFound);
// Telling the map to start looking for the location  

map.locate({setView:true,watch:true, maxZoom:16});








