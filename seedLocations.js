const mongoose = require('mongoose');
const fs = require('fs');
const Location = require('./models/locations')

// 1. DATABASE CONNECTION

const MONGO_URI = "mongodb+srv://routerelief-admin:RouteRelief123@cluster0.iiljuig.mongodb.net/routerelief?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected. now seed "))
  .catch(err => console.error("Connection error:", err));

// 2. DATA LOAD & TRANSFORMATION
const seedDatabase = async () => {
  try {
    // Load GeoJSON file
    const rawData = fs.readFileSync('./community-centres-2.geojson', 'utf-8');
    const geoJson = JSON.parse(rawData);

    // Map GeoJSON features to match the Mongoose Schema

  
const locationsToUpload = geoJson.features.map((feature, index) => {
  const services = [];

  // Tagging some centers with extra services for filtering
  if (index % 3 === 0) services.push("shelter");
  if (index % 4 === 0) services.push("food");
  if (index % 5 === 0) services.push("support");
  if (index % 6 === 0) services.push("hub");

  return {
    name: feature.properties.name || "Unknown Centre",
    address: feature.properties.address || "No Address Provided",
    lat: feature.geometry.coordinates[1], 
    lng: feature.geometry.coordinates[0],
    type: "community centre", 
    services: services,        // THE KEY FOR MULTI-SERVICE FILTERING
    status: "open",
    needsSupplies: index % 7 === 0, // Automatically tags some for testing the orange badge
    updatedAt: new Date()
  };
});


    // 3. DATABASE EXECUTION
    
    await Location.deleteMany({ type: "community centre" });

    // Bulk insert
    const result = await Location.insertMany(locationsToUpload);
    console.log(`Success: ${result.length} locations added to the database.`);

    // Close connection and exit
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seedDatabase();