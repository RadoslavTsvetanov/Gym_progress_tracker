// example-service.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());

// Middleware to check if the request has a valid token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(token);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

app.get("/resource", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected resource", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Example service running on port ${PORT}`);
});
