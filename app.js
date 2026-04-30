const express = require("express");
const session = require("express-session");

const loginRoutes = require("./login");
const signupRoutes = require("./signup");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static("public"));

app.use("/login", loginRoutes);
app.use("/signup", signupRoutes);

app.get("/", (req, res) => {
  res.send(`
    <h1>Home Page</h1>

    ${
      req.session.user
        ? `<p>Logged in as ${req.session.user}</p>
           <a href="/logout">Logout</a>`
        : `<a href="/login">Login</a><br>
           <a href="/signup">Sign Up</a>`
    }
  `);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});