const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to RouteRelief database'))
    .catch((err) => console.log('Connection error ', err));