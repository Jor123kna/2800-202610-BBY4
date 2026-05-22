const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const { validateSignup, validateSignin } = require('../middleware/userValidation');
const User = require('../models/users');

// Helper functions
// Create a reduced session user object from a database user document.
const createSessionUser = (user) => ({
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    firstTimeMode: user.firstTimeMode
});

// Require the request to have a logged-in session user, otherwise respond with 401.
const requireSessionUser = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'Not logged in' });
        return null;
    }

    return req.session.user;
};

// Save the session state and return a JSON response with status code and session user.
const saveSessionAndSend = (req, res, statusCode, message) => {
    req.session.save(() => {
        res.status(statusCode).json({
            message,
            user: req.session.user
        });
    });
};

// Destroy the current session, clear the cookie, and send a response.
const destroySessionAndSend = (req, res, successMessage, errorMessage) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: errorMessage });
        }

        res.clearCookie('connect.sid', { path: '/' });
        res.json({ message: successMessage });
    });
};

// Log server errors and respond with a 500 status code.
const sendServerError = (res, label, message, err) => {
    console.error(label, err);

    res.status(500).json({
        message,
        error: err.message
    });
};

// Load the current user document from the session user ID.
const findCurrentUser = async (req) => {
    return await User.findById(req.session.user.id);
};

// Update the session user object using the fresh user document.
const updateSessionFromUser = (req, user) => {
    req.session.user = createSessionUser(user);
};

// Collect and validate allowed user update fields from the request body.
const getValidUserUpdates = (req, res) => {
    const updates = {};

    if (req.body.firstTimeMode !== undefined) {
        updates.firstTimeMode = req.body.firstTimeMode;
    }

    if (req.body.role !== undefined) {
        if (!['helper', 'in-need'].includes(req.body.role)) {
            res.status(400).json({ message: 'Invalid role' });
            return null;
        }

        updates.role = req.body.role;
    }

    return updates;
};

// POST /users/signup
router.post('/signup', validateSignup, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName, lastName, email, phone,
            password: hashedPassword,
            role: role || 'in-need',
            firstTimeMode: true
        });

        updateSessionFromUser(req, user);
        saveSessionAndSend(req, res, 201, 'User created successfully');
    } catch (err) {
        sendServerError(res, 'Signup error:', 'Error creating user', err);
    }
});

// POST /users/signin
router.post('/signin', validateSignin, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        updateSessionFromUser(req, user);
        saveSessionAndSend(req, res, 200, 'Signed in successfully');

    } catch (err) {
        sendServerError(res, 'Signin error:', 'Error signing in', err);

    }
});

// GET /users/profile
router.get('/profile', (req, res) => {

    const sessionUser = requireSessionUser(req, res);
    if (!sessionUser) return;

    res.json({ user: sessionUser });
});

// GET /users/logout
router.get('/logout', (req, res) => {
    destroySessionAndSend(
        req,
        res,
        'Logged out successfully',
        'Error logging out'
    );
});

// DELETE /users/delete
router.delete('/delete', async (req, res) => {
    try {
        const sessionUser = requireSessionUser(req, res);
        if (!sessionUser) return;

        await User.findByIdAndDelete(sessionUser.id);

        destroySessionAndSend(
            req,
            res,
            'Account deleted successfully',
            'Account deleted, but logout failed'
        );

    } catch (err) {
        sendServerError(res, 'Delete account error:', 'Error deleting account', err);
    }
});

// PUT /users/update
router.put('/update', async (req, res) => {
    try {
        const sessionUser = requireSessionUser(req, res);
        if (!sessionUser) return;

        const updates = getValidUserUpdates(req, res);
        if (!updates) return;

        const updatedUser = await User.findByIdAndUpdate(
            sessionUser.id,
            updates,
            { returnDocument: "after"}
        );

        updateSessionFromUser(req, updatedUser);
        saveSessionAndSend(req, res, 200, 'User updated successfully');

    } catch (err) {
        sendServerError(res, 'Update user error:', 'Error updating user', err);
    }
});

// Bookmark / Saved posts feature
// GET /users/saved - list all posts the user has bookmarked
router.get('/saved', async (req, res) => {
    try {
        const sessionUser = requireSessionUser(req, res);
        if (!sessionUser) return;

        const user = await User.findById(sessionUser.id).populate({
            path: 'savedPosts',
            populate: {
                path: 'author',
                select: 'firstName lastName role'
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ savedPosts: user.savedPosts || [] });

    } catch (err) {
        sendServerError(res, 'Get saved posts error:', 'Error getting saved posts', err);
    }
});


// POST /users/saved/:postId - bookmark a post
router.post('/saved/:postId', async (req, res) => {
    try {
        const sessionUser = requireSessionUser(req, res);
        if (!sessionUser) return;

        const user = await findCurrentUser(req);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postId = req.params.postId;
        const alreadySaved = user.savedPosts.some(
            (id) => id.toString() === postId
        );

        if (!alreadySaved) {
            user.savedPosts.push(postId);
            await user.save();
        }

        res.json({
            message: 'Post saved',
            saved: true
        });

    } catch (err) {
        sendServerError(res, 'Save post error:', 'Error saving post', err);
    }
});


// DELETE /users/saved/:postId - remove a bookmark
router.delete('/saved/:postId', async (req, res) => {
    try {
        const sessionUser = requireSessionUser(req, res);
        if (!sessionUser) return;

        const user = await findCurrentUser(req);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postId = req.params.postId;
        user.savedPosts = user.savedPosts.filter(
            (id) => id.toString() !== postId
        );

        await user.save();
        res.json({
            message: 'Post unsaved',
            saved: false
        });
    } catch (err) {
        sendServerError(res, 'Unsave post error:', 'Error removing bookmark', err);
    }
});

module.exports = router;