const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "disaster support hub",
      "emergency shelter",
      "warming centre",
      "cooling centre",
      "food bank",
      "community fridge",
      "community kitchen",
      "community centre",
      "medical support",
      "information centre",
      "pet support",
      "other",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "limited", "closed"],
    default: "open",
  },
  capacity: {
    type: Number,
    default: null, // null = unknown, 0 = full, >0 = spots available
  },
  needsSupplies: {
    type: Boolean,
    default: false,
  },
  contactInfo: {
    type: String,
    default: "",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId, // User object
    ref: "User", // Foreign key to user collection
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Location", locationSchema);
