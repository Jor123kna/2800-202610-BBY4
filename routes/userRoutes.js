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
            role: role || 'in-need',
            firstTimeMode: true
        });

        req.session.user = {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            firstTimeMode: user.firstTimeMode
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
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: 'Error logging out'
            });
        }

        res.clearCookie('connect.sid', {
            path: '/'
        });

        res.json({
            message: 'Logged out successfully'
        });
    });
});

// DELETE /users/delete
router.delete('/delete', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                message: 'Not logged in'
            });
        }

        await User.findByIdAndDelete(req.session.user.id);

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Account deleted, but logout failed'
                });
            }

            res.clearCookie('connect.sid', {
                path: '/'
            });

            res.json({
                message: 'Account deleted successfully'
            });
        });

    } catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({
            message: 'Error deleting account',
            error: err.message
        });
    }
});

// PUT /users/update
router.put('/update', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                message: 'Not logged in'
            });
        }

        const updates = {};

        if (req.body.firstTimeMode !== undefined) {
            updates.firstTimeMode = req.body.firstTimeMode;
        }

        if (req.body.role !== undefined) {
            if (!['helper', 'in-need'].includes(req.body.role)) {
                return res.status(400).json({
                    message: 'Invalid role'
                });
            }

            updates.role = req.body.role;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.id,
            updates,
            { returnDocument: 'after' }
        );

        req.session.user = {
            id: updatedUser._id,
            name: `${updatedUser.firstName} ${updatedUser.lastName}`,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            firstTimeMode: updatedUser.firstTimeMode
        };

        req.session.save(() => {
            res.json({
                message: 'User updated successfully',
                user: req.session.user
            });
        });

    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({
            message: 'Error updating user',
            error: err.message
        });
    }
});

module.exports = router;