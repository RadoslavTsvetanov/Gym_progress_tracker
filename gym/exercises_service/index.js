const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json();
});

app.post("/create_exercises", (req, res) => {
  const exercises = req.body;
  console.log(exercises);
  res.json({ succes: "ko" });
});

app.get("/get_exercises", (req, res) => {
  const username = req.body.username;
  res.json({ exercises });
});

app.post("/add_new_workout", (req, res) => {
  const { username, workout } = req.body;
  console.log(username, workout);
  res.json({ khgy: "jokj" });
});

app.get("get_progression", (req, res) => {
  const { username } = req.body;
  console.log(username);
  res.json(progression);
});
// Handle undefined routes
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Run the server
const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
