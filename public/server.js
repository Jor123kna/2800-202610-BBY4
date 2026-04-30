const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/users');
const Location = require('./models/locations');
const Post = require('./models/posts');

// Connect to Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to RouteRelief database'))
    .catch((err) => console.log('Connection error', err));