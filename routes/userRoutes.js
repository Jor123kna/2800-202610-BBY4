const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const { validateSignup, validateSignin } = require('../middleware/userValidation');
const User = require('../models/users');

// POST /users/signup
router.post('/signup', validateSignup, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'An account with this email already exists.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role: role || 'in-need'
        });

        req.session.user = {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        req.session.save(() => {
            res.status(201).json({
                message: 'User created successfully',
                user: req.session.user
            });
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({
            message: 'Error creating user',
            error: err.message
        });
    }
});

// POST /users/signin
router.post('/signin', validateSignin, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        req.session.user = {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        req.session.save(() => {
            res.json({
                message: 'Signed in successfully',
                user: req.session.user
            });
        });

    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({
            message: 'Error signing in',
            error: err.message
        });
    }
});

// GET /users/profile
router.get('/profile', (req, res) => {
    console.log('Session user:', req.session.user);

    if (!req.session.user) {
        return res.status(401).json({
            message: 'Not logged in'
        });
    }

    res.json({
        user: req.session.user
    });
});

// GET /users/logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({
            message: 'Logged out successfully'
        });
    });
});

module.exports = router;