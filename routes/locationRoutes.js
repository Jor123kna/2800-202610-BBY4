const express = require("express");
const router = express.Router();
const Location = require("../models/locations");
const { isLoggedIn } = require('../middleware/requireLogin');

//------------------
// Helper functions
//------------------

/**
 * Allowed values for each field in a location report.
 */
const allowedReportValues = {
  foodLevel: ["unknown", "none", "low", "medium", "high"],
  waterLevel: ["unknown", "none", "low", "medium", "high"],
  shelterLevel: ["unknown", "none", "low", "medium", "high"],
  suppliesLevel: ["unknown", "none", "low", "medium", "high"],
};

/**
 * Validate that a submitted report field and value are allowed.
 * @param {string} field
 * @param {string} value
 * @returns {boolean}
 */
const isValidReport = (field, value) => {
  return (
    allowedReportValues[field] &&
    allowedReportValues[field].includes(String(value))
  );
};

/**
 * Remove any previous report by the same user for the same field.
 * @param {object} location
 * @param {string} userId
 * @param {string} field
 */
const removeOldUserVote = (location, userId, field) => {
  location.reports = location.reports.filter((report) => {
    return !(report.user.toString() === userId && report.field === field);
  });
};

/**
 * Count the number of unique users who reported the same value for a field.
 * @param {object} location
 * @param {string} field
 * @param {string} value
 * @returns {number}
 */
const countMatchingUsers = (location, field, value) => {
  const matchingReports = location.reports.filter((report) => {
    return report.field === field && report.value === String(value);
  });

  return new Set(matchingReports.map((report) => report.user.toString())).size;
};

/**
 * Approve the report update by applying the new value to the location,
 * setting the updated metadata, clearing old reports for the field, and saving.
 * @param {object} location
 * @param {string} userId
 * @param {string} field
 * @param {string} value
 */
const approveReportUpdate = async (location, userId, field, value) => {
  location[field] = value;
  location.updatedBy = userId;
  location.updatedAt = new Date();

  location.reports = location.reports.filter((report) => {
    return report.field !== field;
  });

  await location.save();
};

/**
 * GET /locations
 * Retrieve all locations.
 */
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

/**
 * GET /locations/:id
 * Retrieve a single location by ID and populate the updater username.
 */
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

/**
 * POST /locations/:id/report-update
 * Submit a suggested update for a location field. Requires two matching reports
 * before the location value is actually updated.
 */
router.post("/:id/report-update", isLoggedIn, async (req, res) => {
  try {
    const { field, value } = req.body;
    const userId = req.session.user.id;

    if (!isValidReport(field, value)) {
      return res.status(400).json({ message: "Invalid update type or value." });
    }

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    if (String(location[field]) === String(value)) {
      return res.status(400).json({ message: "This location already has that value." });
    }

    removeOldUserVote(location, userId, field);

    location.reports.push({
      user: userId,
      field,
      value: String(value),
    });

    if (countMatchingUsers(location, field, value) >= 2) {
      await approveReportUpdate(location, userId, field, value);
      return res.json({ message: `${field} updated to ${value}.`, location });
    }

    await location.save();
    res.json({
      message: "Report submitted. One more matching report is needed before this location updates.",
      location,
    });
  } catch (err) {
    console.error("Report location update error:", err);
    res.status(500).json({
      message: "Error reporting location update.",
      error: err.message,
    });
  }
});

module.exports = router;
