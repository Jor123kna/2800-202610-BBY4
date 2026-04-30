const express = require("express");
const router = express.Router();

const users = require("./users");

router.get("/", (req, res) => {
  res.send(`
    <h1>Sign Up</h1>

    <form method="POST" action="/signup">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Sign Up</button>
    </form>

    <a href="/login">Already have an account? Login</a>
  `);
});

router.post("/", (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.send("Username already exists. <a href='/signup'>Try again</a>");
  }

  users.push({ username, password });

  res.redirect("/login");
});

module.exports = router;