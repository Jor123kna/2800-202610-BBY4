const express = require('express');
const router = express.Router();
const Location = require('../models/locations');

// GET /locations - get all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json({
            message: 'Locations retrieved successfully',
            locations: locations
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /locations - create a new location
router.post('/', async (req, res) => {
    try {
        const location = await Location.create({
            name: req.body.name,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            type: req.body.type,
            status: req.body.status,
            updatedBy: req.body.updatedBy
        });
        res.status(201).json({
            message: 'Location created successfully',
            location: location
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;