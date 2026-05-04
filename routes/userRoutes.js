const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/users');

// POST /users/signup - create a new user
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: 'An account with this email already exists.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: hashedPassword
        });

        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            email: user.email
        };

        res.status(201).json({
            message: 'User created successfully',
            user: req.session.user
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({
            message: 'Error creating user',
            error: err.message
        });
    }
});

module.exports = router;