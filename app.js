require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'routereliefsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// API routes
app.use('/users', require('./routes/userRoutes'));
app.use('/locations', require('./routes/locationRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/walkthrough', require('./routes/walkthroughRoutes'));

// Schema
const Location = require('./models/locations');

// test database connection
app.get('/test-db', (req, res) => {
    if (mongoose.connection.readyState === 1) {
        res.json({ message: 'Connected to MongoDB!' });
    } else {
        res.json({ message: 'Not connected to MongoDB.' });
    }
});

app.post('/add-location', async (req, res) => {
    try {
        const location = new Location({
            name: req.body.name,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            type: req.body.type,
            status: req.body.status
        });

        await location.save();

        res.json({ message: "Location added to database!" });

    } catch (error) {
        console.error(error);
        res.json({ message: "Error adding location" });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found - 404');
});

module.exports = app;