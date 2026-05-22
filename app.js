require("dotenv").config();

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Sets up the session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "routereliefsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

// API routes
app.use("/users", require("./routes/userRoutes"));
app.use("/locations", require("./routes/locationRoutes"));
app.use("/posts", require("./routes/postRoutes"));
app.use("/replies", require("./routes/replyRoutes"));
app.use("/walkthrough", require("./routes/walkthroughRoutes"));
app.use("/api", require("./routes/chatRoutes"));



// Schemas
const Location = require("./models/locations");
const Post = require("./models/posts");
const User = require("./models/users");
const Reply = require("./models/replies");

// Serve React frontend
app.use(express.static(path.join(__dirname, "frontend", "build")));

// React Router fallback ONLY for GET requests
app.use((req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found - 404");
});

module.exports = app;
