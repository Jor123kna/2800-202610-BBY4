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


// POST /locations/:id/report-update
router.post("/:id/report-update", isLoggedIn, async (req, res) => {
  try {
    const { field, value } = req.body;
    const userId = req.session.user.id;

    const allowedValues = {
      status: ["open", "limited", "closed"],
      foodLevel: ["unknown", "none", "low", "medium", "high"],
      waterLevel: ["unknown", "none", "low", "medium", "high"],
      shelterLevel: ["unknown", "none", "low", "medium", "high"],
      suppliesLevel: ["unknown", "none", "low", "medium", "high"],
      capacity: ["0", "1", "2", "3", "4", "5", "10", "20", "50"],
      needsSupplies: ["true", "false"]
    };

    // Make sure the field is allowed
    if (!allowedValues[field]) {
      return res.status(400).json({
        message: "Invalid update type."
      });
    }

    // Make sure the value is allowed for that field
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

    // If the location already has this value, no vote is needed
    if (String(location[field]) === String(value)) {
      return res.status(400).json({
        message: "This location already has that value."
      });
    }

    // Check if this user already voted for this exact same field + value
    const alreadyReportedSameUpdate = location.reports.some((report) => {
      return (
        report.user.toString() === userId &&
        report.field === field &&
        report.value === String(value)
      );
    });

    if (alreadyReportedSameUpdate) {
      return res.status(400).json({
        message: "You already reported this update."
      });
    }

    // Remove this user's old vote for the same field.
    // Example: if they voted foodLevel low, then change to high,
    // the low vote gets removed before high is added.
    location.reports = location.reports.filter((report) => {
      return !(
        report.user.toString() === userId &&
        report.field === field
      );
    });

    // Add the user's new vote
    location.reports.push({
      user: userId,
      field,
      value: String(value)
    });

    // Find reports that match the same field + value
    const matchingReports = location.reports.filter((report) => {
      return report.field === field && report.value === String(value);
    });

    // Count unique users only.
    // This prevents one user with duplicate reports from causing an update.
    const uniqueUserIds = [
      ...new Set(matchingReports.map((report) => report.user.toString()))
    ];

    // If 2 different users reported the same thing, update the real location value
    if (uniqueUserIds.length >= 2) {
      if (field === "capacity") {
        location[field] = Number(value);
      } else if (field === "needsSupplies") {
        location[field] = value === "true";
      } else {
        location[field] = value;
      }

      location.updatedBy = userId;
      location.updatedAt = new Date();

      // Clear all votes for this field after the real value updates
      location.reports = location.reports.filter((report) => {
        return report.field !== field;
      });

      await location.save();

      return res.json({
        message: `${field} updated to ${value}.`,
        location
      });
    }

    // If there is only 1 unique vote, save it as pending
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
