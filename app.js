require('dotenv').config();
const express = require('express');
const session = require('express-session');

const app = express();

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
})

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found - 404');
});

module.exports = app;