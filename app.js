require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// middleware
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// session
app.use(session({
    secret: process.env.SESSION_SECRET || 'routereliefsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: 'lax'
    }
}));

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

app.use('/users', require('./routes/userRoutes'));
app.use('/locations', require('./routes/locationRoutes'));
app.use('/posts', require('./routes/postRoutes'))

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