const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const db_repo = require("./auth_repository");
const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";
const { DB } = db_repo;
const db = new DB();
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const isValidUser = await db.check_for_user(username, password);

    if (isValidUser) {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "24h" });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "User not found or invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const createUserResult = await db.create_user(username, password);

    if (createUserResult.success) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(400).json({ error: createUserResult.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Authentication service running on port ${PORT}`);
});
