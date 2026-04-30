const express = require("express");
const router = express.Router();

const users = require("./users");

router.get("/", (req, res) => {
  res.send(`
    <h1>Login</h1>

    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>

    <a href="/signup">Need an account? Sign up</a>
  `);
});

router.post("/", (req, res) => {
  const { username, password } = req.body;

  const foundUser = users.find(
    user => user.username === username && user.password === password
  );

  if (!foundUser) {
    return res.send("Invalid username or password. <a href='/login'>Try again</a>");
  }

  req.session.user = username;
  res.redirect("/");
});

module.exports = router;