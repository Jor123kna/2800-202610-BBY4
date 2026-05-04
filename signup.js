const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

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
  try {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().min(6).required()
    });

    const { username, password } = req.body;

    const { error } = schema.validate({ username, password });

    if (error) {
      return res.send(`Invalid input: ${error.details[0].message}`);
    }

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
      return res.send("Username already exists. <a href='/signup'>Try again</a>");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new users({
      username,
      password: hashedPassword
    });

    await newUser.save();

   res.redirect("/login");
   
  } catch (err) {
    console.error(err);
    res.send("An error occurred. Please try again.");
  }
});

module.exports = router;