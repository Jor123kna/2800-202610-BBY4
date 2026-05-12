const express = require("express");
const router = express.Router();
const Location = require("../models/locations");

// GET /locations - get all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({
      message: "Locations retrieved successfully",
      locations: locations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /locations - create a new location
router.post("/", async (req, res) => {
  try {
    const location = await Location.create({
      name: req.body.name,
      address: req.body.address,
      lat: req.body.lat,
      lng: req.body.lng,
      type: req.body.type,
      status: req.body.status,
      capacity: req.body.capacity,
      needsSupplies: req.body.needsSupplies,
      contactInfo: req.body.contactInfo,
      updatedBy: req.body.updatedBy,
    });
    res.status(201).json({
      message: "Location created successfully",
      location: location,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get /locations/:id - get a single location by ID
router.get("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate(
      "updatedBy",
      "username",
    ); // attach username from User

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /locations/:id - update a location by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        address: req.body.address,
        lat: req.body.lat,
        lng: req.body.lng,
        type: req.body.type,
        status: req.body.status,
        capacity: req.body.capacity,
        needsSupplies: req.body.needsSupplies,
        contactInfo: req.body.contactInfo,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
