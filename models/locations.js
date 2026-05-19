const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  field: {
    type: String,
    enum: [
      "foodLevel",
      "waterLevel",
      "shelterLevel",
      "suppliesLevel",
    ],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: ""
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
  services: {
    type: [String],
    enum: [
      "disaster support hub",
      "information",
      "shelter",
      "warming centre",
      "cooling centre",
      "food",
      "water",
      "supplies",
      "washrooms",
      "showers",
      "laundry",
      "low-cost meals",
      "family reunification",
      "recovery information",
      "youth programs",
      "senior programs",
      "childcare",
      "newcomer support",
      "community gathering",
      "fitness/recreation",
      "arts/culture",
      "medical support",
      "pet support",
      "wifi",
      "charging stations",
      "accessibility support"
    ],
    default: [],
  },
  status: {
    type: String,
    enum: ["open", "limited", "closed"],
    default: "open",
  },
  foodLevel: {
    type: String,
    enum: ["unknown", "none", "low", "medium", "high"],
    default: "unknown"
  },

  waterLevel: {
    type: String,
    enum: ["unknown", "none", "low", "medium", "high"],
    default: "unknown"
  },

  shelterLevel: {
    type: String,
    enum: ["unknown", "none", "low", "medium", "high"],
    default: "unknown"
  },

  suppliesLevel: {
    type: String,
    enum: ["unknown", "none", "low", "medium", "high"],
    default: "unknown"
  },
  contactInfo: {
    phone: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: ""
    }
  },
  notes: {
    type: String,
    default: ""
  },
  reports: {
    type: [reportSchema],
    default: []
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId, // User object
    ref: "User",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  hours: {
    monday: {
      open: { type: String, default: "" },
      close: { type: String, default: "" },
      closed: { type: Boolean, default: false }
    },
    tuesday: {
      open: { type: String, default: "" },
      close: { type: String, default: "" },
      closed: { type: Boolean, default: false }
    },
    wednesday: {
      open: { type: String, default: "" },
      close: { type: String, default: "" },
      closed: { type: Boolean, default: false }
    },
    thursday: {
      open: { type: String, default: "" },
      close: { type: String, default: "" },
      closed: { type: Boolean, default: false }
    },
    friday: {
      open: { type: String, default: "" },
      close: { type: String, default: "" },
      closed: { type: Boolean, default: false }
    },
    saturday: {
      open: { type: String, default: "" },
      close: { type: String, default: "" },
      closed: { type: Boolean, default: false }
    },
    sunday: {
      open: { type: String, default: "" },
      close: { type: String, default: "" },
      closed: { type: Boolean, default: false }
    }
  },
  timezone: {
    type: String,
    default: "America/Vancouver"
  }
});

module.exports = mongoose.model("Location", locationSchema);
