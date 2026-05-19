const express = require("express");
const router = express.Router();
const Location = require("../models/locations");
const { isLoggedIn } = require('../middleware/requireLogin');

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
        services: req.body.services,
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

// POST /locations/:id/report-update
router.post("/:id/report-update", isLoggedIn, async (req, res) => {
  try {
    const { field, value } = req.body;

    const allowedValues = {
      status: ["open", "limited", "closed"],
      foodLevel: ["unknown", "none", "low", "medium", "high"],
      waterLevel: ["unknown", "none", "low", "medium", "high"],
      shelterLevel: ["unknown", "none", "low", "medium", "high"],
      suppliesLevel: ["unknown", "none", "low", "medium", "high"],
      capacity: ["0", "1", "2", "3", "4", "5", "10", "20", "50"],
      needsSupplies: ["true", "false"]
    };

    if (!allowedValues[field]) {
      return res.status(400).json({
        message: "Invalid update type."
      });
    }

    if (!allowedValues[field].includes(String(value))) {
      return res.status(400).json({
        message: "Invalid update value."
      });
    }

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        message: "Location not found."
      });
    }

    const alreadyReportedSameUpdate = location.reports.some((report) => {
      return (
        report.user.toString() === req.session.user.id &&
        report.field === field &&
        report.value === String(value)
      );
    });

    if (alreadyReportedSameUpdate) {
      return res.status(400).json({
        message: "You already reported this update."
      });
    }

    location.reports.push({
      user: req.session.user.id,
      field,
      value: String(value)
    });

    const matchingReports = location.reports.filter((report) => {
      return report.field === field && report.value === String(value);
    });

    if (matchingReports.length >= 2) {
      if (field === "capacity") {
        location[field] = Number(value);
      } else if (field === "needsSupplies") {
        location[field] = value === "true";
      } else {
        location[field] = value;
      }

      location.updatedBy = req.session.user.id;
      location.updatedAt = new Date();

      // Clear only the reports for this field after saving the accepted change.
      location.reports = location.reports.filter((report) => {
        return report.field !== field;
      });

      await location.save();

      return res.json({
        message: `${field} updated to ${value}.`,
        location
      });
    }

    await location.save();

    res.json({
      message: "Report submitted. One more matching report is needed before this location updates.",
      location
    });

  } catch (err) {
    console.error("Report location update error:", err);

    res.status(500).json({
      message: "Error reporting location update.",
      error: err.message
    });
  }
});

module.exports = router;
