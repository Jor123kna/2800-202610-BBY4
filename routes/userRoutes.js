const express = require('express');
const router = express.Router();
const User = require('../models/users');

// POST /users - create a new user
router.post('/', async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });
        res.status(201).json({
            message: 'User created successfully',
            user: user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;