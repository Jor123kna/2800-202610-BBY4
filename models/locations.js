const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['food bank', 'shelter', 'community fridge', 'community kitchen', 'community centre', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'limited', 'closed'],
        default: 'open'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId, // User object
        ref: 'User' // Foreign key to user collection
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('locations', locationSchema);