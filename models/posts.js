const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId, // User object
    ref: "User", // Foreign key to user collection
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  neighbourhood: {
    type: String,
    required: false,
  },
  aigenerated: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["helper", "in-need"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
