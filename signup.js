const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const users = require("./users");

const saltRounds = 12;

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

router.post("/", async (req, res) => {

  const { username, password } = req.body;

  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.send("Username already exists. <a href='/signup'>Try again</a>");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  users.push({
    username,
    password: hashedPassword
  });

  res.redirect("/login");
});

module.exports = router;