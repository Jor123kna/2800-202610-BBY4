const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middleware/requireLogin');
const User = require('../models/users');

// Update the user's first-time mode in MongoDB
const completeWalkthroughForUser = async (userId) => {
    return await User.findByIdAndUpdate(
        req.session.user.id,
        { firstTimeMode: false },
        { returnDocument: 'after' }
    );
};

// Rebuild the session user object with updated data
const updateSessionUser = (req, user) => {
    req.session.user = {
        id: updatedUser._id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        firstTimeMode: updatedUser.firstTimeMode
    };
};

// PUT /walkthrough/complete
router.put('/complete', isLoggedIn, async (req, res) => {
    try {
        const updatedUser = await completeWalkthroughForUser(req.session.user.id);

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        updateSessionUser(req, updatedUser);
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({
                    message: 'Walkthrough completed, but session failed to save'
                });
            }
            res.json({
                message: 'Walkthrough completed',
                user: req.session.user
            });
        });
    } catch (err) {
        console.error('Walkthrough complete error:', err);
        res.status(500).json({
            message: 'Error completing walkthrough',
            error: err.message
        });
    }
});

module.exports = router;