const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

// Import models
const User = require('./models/users');
const Location = require('./models/locations');
const Post = require('./models/posts');

const PORT = process.env.PORT || 3000;

// Connect to Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to RouteRelief database')
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`); // Opening the server
        });
    })
    .catch((err) => console.log('Connection error', err));