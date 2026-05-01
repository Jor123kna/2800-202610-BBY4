require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// session
app.use(session({
    secret: process.env.SESSION_SECRET || 'routereliefsecret',
    resave: false,
    saveUninitialized: false
}));

// routes
app.get('/', (req, res) => {
    res.send('Main Page');
});

// test routes for POSTMAN
app.use('/users', require('./routes/userRoutes'));
app.use('/locations', require('./routes/locationRoutes'));

// Schema
const Location = require('./models/locations');
const User = require('./models/users');
const Post = require('./models/posts');

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