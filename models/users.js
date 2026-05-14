const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["helper", "in-need", "admin"],
    default: "in-need",
  },
  firstTimeMode: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  aiMessageCount: {
    type: Number,
    default: 0,
  },
  aiMessageDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
